// Simple logger for deployment compatibility
interface LogLevel {
  error: (message: string, meta?: any) => void
  warn: (message: string, meta?: any) => void
  info: (message: string, meta?: any) => void
  debug: (message: string, meta?: any) => void
}

const createLogger = (): LogLevel => {
  const log = (level: string, message: string, meta?: any) => {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`
    
    if (meta) {
      console.log(logMessage, meta)
    } else {
      console.log(logMessage)
    }
  }

  return {
    error: (message: string, meta?: any) => log('error', message, meta),
    warn: (message: string, meta?: any) => log('warn', message, meta),
    info: (message: string, meta?: any) => log('info', message, meta),
    debug: (message: string, meta?: any) => log('debug', message, meta),
  }
}

const logger = createLogger()

export default logger