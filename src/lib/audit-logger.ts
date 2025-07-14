import { prisma } from './prisma'

export interface AuditLogData {
  userId: string
  action: string
  entityType: string
  entityId?: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export const createAuditLog = async (data: AuditLogData) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        oldValues: data.oldValues,
        newValues: data.newValues,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      }
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}

export const logClientAction = async (
  userId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  clientId: string,
  oldValues?: any,
  newValues?: any,
  request?: Request
) => {
  const ipAddress = request?.headers.get('x-forwarded-for') || 
                   request?.headers.get('x-real-ip') || 
                   'unknown'
  const userAgent = request?.headers.get('user-agent') || 'unknown'

  await createAuditLog({
    userId,
    action: `CLIENT_${action}`,
    entityType: 'CLIENT',
    entityId: clientId,
    oldValues,
    newValues,
    ipAddress,
    userAgent,
  })
}

export const logPaymentAction = async (
  userId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  paymentId: string,
  oldValues?: any,
  newValues?: any,
  request?: Request
) => {
  const ipAddress = request?.headers.get('x-forwarded-for') || 
                   request?.headers.get('x-real-ip') || 
                   'unknown'
  const userAgent = request?.headers.get('user-agent') || 'unknown'

  await createAuditLog({
    userId,
    action: `PAYMENT_${action}`,
    entityType: 'PAYMENT',
    entityId: paymentId,
    oldValues,
    newValues,
    ipAddress,
    userAgent,
  })
}

export const logUserAction = async (
  userId: string,
  action: string,
  request?: Request
) => {
  const ipAddress = request?.headers.get('x-forwarded-for') || 
                   request?.headers.get('x-real-ip') || 
                   'unknown'
  const userAgent = request?.headers.get('user-agent') || 'unknown'

  await createAuditLog({
    userId,
    action,
    entityType: 'USER',
    entityId: userId,
    ipAddress,
    userAgent,
  })
}