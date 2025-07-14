# InvestJá - Credit Management System

This is a production-ready NextJS credit management application for managing clients, loans, and payments with enterprise-level security and features.

## Features

### 🏢 **Core Business Features**
- **Client Management** - Complete client profiles with loan tracking
- **Payment Processing** - Real-time payment tracking and history
- **Dashboard Analytics** - Comprehensive business metrics and insights
- **Document Management** - Secure file upload and storage
- **Email Notifications** - Automated payment reminders and alerts

### 🔐 **Security Features**
- **NextAuth.js Authentication** - Secure JWT-based sessions
- **Rate Limiting** - Protection against API abuse
- **Input Validation** - Server-side validation with Zod
- **XSS Protection** - Input sanitization with DOMPurify
- **CSRF Protection** - Security headers and middleware
- **Audit Logging** - Complete activity tracking

### 🚀 **Performance Features**
- **PostgreSQL Database** - Persistent data storage with Prisma ORM
- **Error Boundaries** - Graceful error handling
- **File Processing** - Image optimization with Sharp
- **Caching Strategy** - Optimized database queries
- **Bundle Optimization** - Minimal dependencies and lazy loading

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- SMTP server for emails (optional)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd investja
npm install
```

### 2. Database Setup

**Create PostgreSQL database:**
```sql
CREATE DATABASE investja_db;
CREATE USER investja_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE investja_db TO investja_user;
```

**Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your database credentials and other settings
```

**Initialize database:**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

## 🔑 **Default Accounts**

### Admin Account
- **Email:** admin@investja.com
- **Password:** admin123!@#
- **Role:** Administrator with full access

### Demo Account  
- **Email:** demo@investja.com
- **Password:** demo123!@#
- **Role:** Regular user with sample data

**⚠️ CRITICAL: Change these passwords immediately in production!**

## 📊 **API Endpoints**

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/[id]` - Get client details
- `PUT /api/clients/[id]` - Update client
- `DELETE /api/clients/[id]` - Delete client

### Payments
- `GET /api/payments` - List all payments
- `POST /api/payments` - Create new payment
- `PUT /api/payments/[id]` - Update payment

### Dashboard
- `GET /api/dashboard` - Get dashboard metrics

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/[filename]` - Serve file

## 🗄️ **Database Schema**

### Core Tables
- **users** - User accounts and authentication
- **clients** - Client information and loan details
- **payments** - Payment records and history
- **documents** - File uploads and metadata
- **audit_logs** - Activity tracking and compliance
- **sessions** - NextAuth.js session management

### Key Relationships
- Users → Clients (one-to-many)
- Clients → Payments (one-to-many)
- Clients → Documents (one-to-many)
- Users → AuditLogs (one-to-many)

## 🚀 **Production Deployment**

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="https://yourdomain.com"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Security
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="900000"
```

### Build and Deploy
```bash
npm run build
npm start
```

### Supported Platforms
- ✅ **Shared Hosting** (with PostgreSQL support)
- ✅ **VPS/Cloud Servers** (DigitalOcean, AWS, etc.)
- ✅ **Vercel** (with external database)
- ✅ **Railway** (with PostgreSQL addon)
- ✅ **Docker** containers

## 🛡️ **Security Features**

### Authentication & Authorization
- JWT-based sessions with NextAuth.js
- Bcrypt password hashing (12 rounds)
- Role-based access control
- Session management with database storage

### API Security
- Rate limiting (100 requests/15 minutes)
- Input validation with Zod schemas
- XSS protection with DOMPurify
- CSRF protection with security headers
- SQL injection prevention with Prisma

### Data Protection
- Server-side data processing only
- Secure file upload with type validation
- Audit logging for compliance
- Error handling without data exposure

## 📧 **Email Features**

### Automated Notifications
- Welcome emails for new users
- Payment reminder emails
- Overdue payment alerts
- System notifications

### SMTP Configuration
Supports any SMTP provider:
- Gmail (with app passwords)
- SendGrid
- Mailgun
- Amazon SES
- Custom SMTP servers

## 📁 **File Management**

### Upload Features
- Secure file upload with validation
- Image processing and optimization
- File type restrictions
- Size limits (5MB default)
- Virus scanning ready

### Supported File Types
- Images: JPEG, PNG, GIF
- Documents: PDF, DOC, DOCX
- Configurable file type restrictions

## 📈 **Monitoring & Logging**

### Audit Trail
- Complete user activity tracking
- Before/after value comparison
- IP address and user agent logging
- Compliance-ready audit logs

### Error Handling
- Winston logging system
- Error boundaries for React components
- Graceful error recovery
- Production error tracking ready

## 🔧 **Development**

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

### Tech Stack
- **Frontend:** Next.js 15, React 18, TypeScript
- **Styling:** Tailwind CSS, Radix UI, Shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js
- **Validation:** Zod
- **File Processing:** Sharp, Multer
- **Email:** Nodemailer
- **Logging:** Winston

## 📝 **License**

This project is proprietary software. All rights reserved.

## 🆘 **Support**

For technical support or business inquiries:
- Email: support@investja.com
- Documentation: [docs.investja.com](https://docs.investja.com)
- Issues: Create an issue in this repository

---

**InvestJá** - Professional Credit Management System
*Built with enterprise-grade security and scalability in mind.*