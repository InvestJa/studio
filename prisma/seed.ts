import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123!@#', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@investja.com' },
    update: {},
    create: {
      email: 'admin@investja.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123!@#', 12)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@investja.com' },
    update: {},
    create: {
      email: 'demo@investja.com',
      name: 'Usuário Demo',
      password: demoPassword,
      role: 'USER',
    },
  })

  console.log('✅ Demo user created:', demoUser.email)

  // Create sample clients for demo user
  const sampleClients = [
    {
      name: 'Ana Silva',
      email: 'ana.silva@example.com',
      phone: '(11) 98765-4321',
      document: '123.456.789-10',
      loanAmount: 5000,
      loanTerm: 12,
      interestRate: 2.5,
      outstandingBalance: 2500,
    },
    {
      name: 'Bruno Costa',
      email: 'bruno.costa@example.com',
      phone: '(21) 91234-5678',
      document: '987.654.321-00',
      loanAmount: 10000,
      loanTerm: 24,
      interestRate: 2.0,
      outstandingBalance: 8000,
    },
    {
      name: 'Carla Dias',
      email: 'carla.dias@example.com',
      phone: '(31) 95555-5555',
      document: '111.222.333-44',
      loanAmount: 7500,
      loanTerm: 18,
      interestRate: 2.2,
      outstandingBalance: 0,
    },
  ]

  for (const clientData of sampleClients) {
    const client = await prisma.client.upsert({
      where: { document: clientData.document },
      update: {},
      create: {
        ...clientData,
        userId: demoUser.id,
      },
    })

    // Create sample payments for each client
    if (clientData.name === 'Ana Silva') {
      await prisma.payment.create({
        data: {
          clientId: client.id,
          amount: 470,
          date: new Date('2024-02-15'),
          method: 'PIX',
          status: 'PAGO',
        },
      })
    }

    if (clientData.name === 'Bruno Costa') {
      await prisma.payment.create({
        data: {
          clientId: client.id,
          amount: 460,
          date: new Date('2024-04-10'),
          method: 'BOLETO',
          status: 'PENDENTE',
        },
      })
    }

    if (clientData.name === 'Carla Dias') {
      await prisma.payment.create({
        data: {
          clientId: client.id,
          amount: 450,
          date: new Date('2024-03-20'),
          method: 'CARTAO_CREDITO',
          status: 'PAGO',
        },
      })
    }

    console.log(`✅ Client created: ${client.name}`)
  }

  console.log('🎉 Database seed completed!')
  console.log('\n📋 Default accounts:')
  console.log('👤 Admin: admin@investja.com / admin123!@#')
  console.log('👤 Demo: demo@investja.com / demo123!@#')
  console.log('\n⚠️  IMPORTANT: Change these passwords in production!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })