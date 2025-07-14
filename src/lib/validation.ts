import { z } from 'zod'
import DOMPurify from 'dompurify'

// Sanitize HTML input to prevent XSS
export const sanitizeHtml = (input: string): string => {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(input)
  }
  // Server-side fallback
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

// Client validation schemas
export const clientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').max(20),
  document: z.string().min(11, 'Documento deve ter pelo menos 11 caracteres').max(20),
  loanAmount: z.number().positive('Valor deve ser positivo').max(1000000),
  loanTerm: z.number().int().positive('Prazo deve ser positivo').max(360),
  interestRate: z.number().min(0, 'Taxa não pode ser negativa').max(100),
})

export const paymentSchema = z.object({
  clientId: z.string().cuid('ID do cliente inválido'),
  amount: z.number().positive('Valor deve ser positivo').max(1000000),
  date: z.string().datetime('Data inválida'),
  method: z.enum(['PIX', 'BOLETO', 'CARTAO_CREDITO', 'DINHEIRO']),
  status: z.enum(['PENDENTE', 'PAGO', 'ATRASADO', 'FALHOU']),
})

export const userSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres').max(100),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

// Sanitize and validate input
export const validateAndSanitize = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  // Sanitize string fields
  if (typeof data === 'object' && data !== null) {
    const sanitized = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        typeof value === 'string' ? sanitizeHtml(value.trim()) : value
      ])
    )
    return schema.parse(sanitized)
  }
  
  return schema.parse(data)
}