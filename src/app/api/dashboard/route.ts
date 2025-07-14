import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getRateLimiter } from '@/lib/rate-limiter'
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

    // Get dashboard metrics
    const [
      totalClients,
      totalLoanedAmount,
      totalOutstandingAmount,
      paymentStats,
      recentPayments,
      monthlyData
    ] = await Promise.all([
      // Total clients
      prisma.client.count({
        where: { userId: session.user.id }
      }),
      
      // Total loaned amount
      prisma.client.aggregate({
        where: { userId: session.user.id },
        _sum: { loanAmount: true }
      }),
      
      // Total outstanding amount
      prisma.client.aggregate({
        where: { userId: session.user.id },
        _sum: { outstandingBalance: true }
      }),
      
      // Payment statistics
      prisma.payment.groupBy({
        by: ['status'],
        where: {
          client: { userId: session.user.id }
        },
        _sum: { amount: true },
        _count: true
      }),
      
      // Recent payments (last 30 days)
      prisma.payment.count({
        where: {
          client: { userId: session.user.id },
          date: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Monthly loan data (last 6 months)
      prisma.client.groupBy({
        by: ['registrationDate'],
        where: {
          userId: session.user.id,
          registrationDate: {
            gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
          }
        },
        _count: true,
        _sum: { loanAmount: true }
      })
    ])

    // Calculate default rate
    const clientsWithDebt = await prisma.client.count({
      where: {
        userId: session.user.id,
        outstandingBalance: { gt: 0 }
      }
    })
    
    const defaultRate = totalClients > 0 ? (clientsWithDebt / totalClients) * 100 : 0

    // Process payment statistics
    const processedPaymentStats = {
      totalPaid: paymentStats.find(p => p.status === 'PAGO')?._sum.amount || 0,
      totalPending: paymentStats.find(p => p.status === 'PENDENTE')?._sum.amount || 0,
      totalOverdue: paymentStats.find(p => p.status === 'ATRASADO')?._sum.amount || 0,
      paymentsLast30Days: recentPayments
    }

    const dashboardData = {
      totalClients,
      totalLoanedAmount: totalLoanedAmount._sum.loanAmount || 0,
      totalOutstandingAmount: totalOutstandingAmount._sum.outstandingBalance || 0,
      defaultRate,
      paymentStatistics: processedPaymentStats,
      monthlyData: monthlyData.map(item => ({
        month: item.registrationDate.toLocaleDateString('pt-BR', { month: 'short' }),
        totalLoans: item._count,
        totalAmount: item._sum.loanAmount || 0
      }))
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    logger.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}