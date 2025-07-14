// Simple in-memory rate limiter for deployment compatibility
interface RateLimiterOptions {
  keyPrefix: string
  points: number
  duration: number
  blockDuration: number
}

class SimpleRateLimiter {
  private requests: Map<string, { count: number; resetTime: number; blockedUntil?: number }> = new Map()
  private options: RateLimiterOptions

  constructor(options: RateLimiterOptions) {
    this.options = options
  }

  async consume(key: string): Promise<void> {
    const now = Date.now()
    const fullKey = `${this.options.keyPrefix}:${key}`
    const record = this.requests.get(fullKey)

    // Check if blocked
    if (record?.blockedUntil && now < record.blockedUntil) {
      throw new Error('Rate limit exceeded')
    }

    // Reset if duration passed
    if (!record || now > record.resetTime) {
      this.requests.set(fullKey, {
        count: 1,
        resetTime: now + (this.options.duration * 1000)
      })
      return
    }

    // Increment count
    record.count++
    
    // Check if limit exceeded
    if (record.count > this.options.points) {
      record.blockedUntil = now + (this.options.blockDuration * 1000)
      throw new Error('Rate limit exceeded')
    }
  }
}

// Different rate limiters for different endpoints
export const authLimiter = new SimpleRateLimiter({
  keyPrefix: 'auth',
  points: 5, // Number of attempts
  duration: 900, // Per 15 minutes
  blockDuration: 900, // Block for 15 minutes
})

export const apiLimiter = new SimpleRateLimiter({
  keyPrefix: 'api',
  points: 100, // Number of requests
  duration: 900, // Per 15 minutes
  blockDuration: 60, // Block for 1 minute
})

export const uploadLimiter = new SimpleRateLimiter({
  keyPrefix: 'upload',
  points: 10, // Number of uploads
  duration: 3600, // Per hour
  blockDuration: 3600, // Block for 1 hour
})

export const getRateLimiter = (type: 'auth' | 'api' | 'upload') => {
  switch (type) {
    case 'auth':
      return authLimiter
    case 'api':
      return apiLimiter
    case 'upload':
      return uploadLimiter
    default:
      return apiLimiter
  }
}