import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateAndSanitize, paymentSchema } from '@/lib/validation'
import { getRateLimiter } from '@/lib/rate-limiter'
import { logPaymentAction } from '@/lib/audit-logger'
import { sendPaymentReminderEmail } from '@/lib/email'
import logger from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Rate limiting
    const limiter = getRateLimiter('api')
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    
    try {
      await limiter.consume(ip)
    } catch {
      return NextResponse.json(
        { error: 'Muitas requisições' },
        { status: 429 }
      )
    }

    const payments = await prisma.payment.findMany({
      where: {
        client: {
          userId: session.user.id
        }
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(payments)

  } catch (error) {
    logger.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Rate limiting
    const limiter = getRateLimiter('api')
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    
    try {
      await limiter.consume(ip)
    } catch {
      return NextResponse.json(
        { error: 'Muitas requisições' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validatedData = validateAndSanitize(paymentSchema, body)

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: validatedData.clientId,
        userId: session.user.id,
      }
    })

    if (!client) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    // Create payment and update client balance in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          ...validatedData,
          date: new Date(validatedData.date),
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      })

      // Update client's outstanding balance if payment is successful
      if (validatedData.status === 'PAGO') {
        await tx.client.update({
          where: { id: validatedData.clientId },
          data: {
            outstandingBalance: {
              decrement: validatedData.amount
            }
          }
        })
      }

      return payment
    })

    // Log the action
    await logPaymentAction(
      session.user.id,
      'CREATE',
      result.id,
      undefined,
      result,
      request
    )

    logger.info(`Payment created: ${result.id} by user: ${session.user.id}`)

    return NextResponse.json(result, { status: 201 })

  } catch (error) {
    logger.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}