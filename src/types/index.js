// Type definitions converted to JSDoc comments for better IDE support

/**
 * @typedef {Object} NavItem
 * @property {string} title
 * @property {string} href
 * @property {React.ComponentType} icon
 * @property {boolean} [disabled]
 */

/**
 * @typedef {Object} Payment
 * @property {string} id
 * @property {string} clientId
 * @property {string} clientName
 * @property {Date} date
 * @property {number} amount
 * @property {'Cartão de Crédito' | 'Boleto' | 'PIX' | 'Dinheiro'} method
 * @property {'Pago' | 'Pendente' | 'Atrasado' | 'Falhou'} status
 */

/**
 * @typedef {Object} PaymentFormValues
 * @property {string} clientId
 * @property {number} amount
 * @property {string} date
 * @property {'Cartão de Crédito' | 'Boleto' | 'PIX' | 'Dinheiro'} method
 * @property {'Pago' | 'Pendente' | 'Atrasado' | 'Falhou'} status
 */

/**
 * @typedef {Object} Client
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} document
 * @property {number} loanAmount
 * @property {number} loanTerm
 * @property {number} interestRate
 * @property {number} outstandingBalance
 * @property {Payment[]} paymentHistory
 * @property {Date} registrationDate
 */

/**
 * @typedef {Object} ClientFormValues
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} document
 * @property {number} loanAmount
 * @property {number} loanTerm
 * @property {number} interestRate
 */

/**
 * @typedef {Object} DashboardMetrics
 * @property {number} totalClients
 * @property {number} totalLoanedAmount
 * @property {number} totalOutstandingAmount
 * @property {number} defaultRate
 */

/**
 * @typedef {Object} PaymentStatistics
 * @property {number} totalPaid
 * @property {number} totalPending
 * @property {number} totalOverdue
 * @property {number} paymentsLast30Days
 */

export {};