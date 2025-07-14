import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateAndSanitize, clientSchema } from '@/lib/validation'
import { getRateLimiter } from '@/lib/rate-limiter'
import { logClientAction } from '@/lib/audit-logger'
import logger from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        payments: {
          orderBy: { date: 'desc' }
        },
        documents: true,
        _count: {
          select: { payments: true }
        }
      }
    })

    if (!client) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    return NextResponse.json(client)

  } catch (error) {
    logger.error('Error fetching client:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get existing client
    const existingClient = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      }
    })

    if (!existingClient) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = validateAndSanitize(clientSchema, body)

    // Check if document already exists (excluding current client)
    if (validatedData.document !== existingClient.document) {
      const duplicateClient = await prisma.client.findUnique({
        where: { document: validatedData.document }
      })

      if (duplicateClient) {
        return NextResponse.json(
          { error: 'Cliente já existe com este documento' },
          { status: 400 }
        )
      }
    }

    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        payments: {
          orderBy: { date: 'desc' }
        },
        _count: {
          select: { payments: true }
        }
      }
    })

    // Log the action
    await logClientAction(
      session.user.id,
      'UPDATE',
      updatedClient.id,
      existingClient,
      updatedClient,
      request
    )

    logger.info(`Client updated: ${updatedClient.id} by user: ${session.user.id}`)

    return NextResponse.json(updatedClient)

  } catch (error) {
    logger.error('Error updating client:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const existingClient = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      }
    })

    if (!existingClient) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    await prisma.client.delete({
      where: { id: params.id }
    })

    // Log the action
    await logClientAction(
      session.user.id,
      'DELETE',
      params.id,
      existingClient,
      undefined,
      request
    )

    logger.info(`Client deleted: ${params.id} by user: ${session.user.id}`)

    return NextResponse.json({ message: 'Cliente excluído com sucesso' })

  } catch (error) {
    logger.error('Error deleting client:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}