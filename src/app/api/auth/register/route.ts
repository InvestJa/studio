import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { validateAndSanitize, userSchema } from '@/lib/validation'
import { getRateLimiter } from '@/lib/rate-limiter'
import { sendWelcomeEmail } from '@/lib/email'
import logger from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const limiter = getRateLimiter('auth')
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    
    try {
      await limiter.consume(ip)
    } catch {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validatedData = validateAndSanitize(userSchema, body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já existe com este email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    })

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name || 'Usuário')
    } catch (emailError) {
      logger.error('Failed to send welcome email:', emailError)
      // Don't fail registration if email fails
    }

    logger.info(`New user registered: ${user.email}`)

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user
    })

  } catch (error) {
    logger.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}