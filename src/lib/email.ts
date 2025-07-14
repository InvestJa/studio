import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })
    return true
  } catch (error) {
    console.error('Email sending failed:', error)
    return false
  }
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3498db;">Bem-vindo ao InvestJá!</h1>
      <p>Olá ${name},</p>
      <p>Sua conta foi criada com sucesso. Agora você pode gerenciar seus clientes e pagamentos de forma eficiente.</p>
      <p>Acesse sua conta em: <a href="${process.env.APP_URL}/login">InvestJá</a></p>
      <p>Atenciosamente,<br>Equipe InvestJá</p>
    </div>
  `
  
  return sendEmail({
    to: email,
    subject: 'Bem-vindo ao InvestJá!',
    html,
    text: `Bem-vindo ao InvestJá! Sua conta foi criada com sucesso.`
  })
}

export const sendPaymentReminderEmail = async (
  clientEmail: string, 
  clientName: string, 
  amount: number, 
  dueDate: Date
) => {
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
  
  const formattedDate = dueDate.toLocaleDateString('pt-BR')
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #f39c12;">Lembrete de Pagamento</h1>
      <p>Olá ${clientName},</p>
      <p>Este é um lembrete de que você tem um pagamento pendente:</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Valor:</strong> ${formattedAmount}</p>
        <p><strong>Data de Vencimento:</strong> ${formattedDate}</p>
      </div>
      <p>Por favor, efetue o pagamento até a data de vencimento para evitar juros.</p>
      <p>Em caso de dúvidas, entre em contato conosco.</p>
      <p>Atenciosamente,<br>Equipe InvestJá</p>
    </div>
  `
  
  return sendEmail({
    to: clientEmail,
    subject: 'Lembrete de Pagamento - InvestJá',
    html,
    text: `Lembrete: Pagamento de ${formattedAmount} vence em ${formattedDate}`
  })
}