import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateAndSanitize, clientSchema } from '@/lib/validation'
import { getRateLimiter } from '@/lib/rate-limiter'
import { logClientAction } from '@/lib/audit-logger'
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

    const clients = await prisma.client.findMany({
      where: { userId: session.user.id },
      include: {
        payments: {
          orderBy: { date: 'desc' },
          take: 5, // Last 5 payments
        },
        _count: {
          select: { payments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(clients)

  } catch (error) {
    logger.error('Error fetching clients:', error)
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
    const validatedData = validateAndSanitize(clientSchema, body)

    // Check if document already exists
    const existingClient = await prisma.client.findUnique({
      where: { document: validatedData.document }
    })

    if (existingClient) {
      return NextResponse.json(
        { error: 'Cliente já existe com este documento' },
        { status: 400 }
      )
    }

    const client = await prisma.client.create({
      data: {
        ...validatedData,
        outstandingBalance: validatedData.loanAmount,
        userId: session.user.id,
      },
      include: {
        payments: true,
        _count: {
          select: { payments: true }
        }
      }
    })

    // Log the action
    await logClientAction(
      session.user.id,
      'CREATE',
      client.id,
      undefined,
      client,
      request
    )

    logger.info(`Client created: ${client.id} by user: ${session.user.id}`)

    return NextResponse.json(client, { status: 201 })

  } catch (error) {
    logger.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}