import { RateLimiterMemory } from 'rate-limiter-flexible'

// Different rate limiters for different endpoints
export const authLimiter = new RateLimiterMemory({
  keyPrefix: 'auth',
  points: 5, // Number of attempts
  duration: 900, // Per 15 minutes
  blockDuration: 900, // Block for 15 minutes
})

export const apiLimiter = new RateLimiterMemory({
  keyPrefix: 'api',
  points: 100, // Number of requests
  duration: 900, // Per 15 minutes
  blockDuration: 60, // Block for 1 minute
})

export const uploadLimiter = new RateLimiterMemory({
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