// backend/middleware/rateLimiter.js

// Simple in-memory rate limiter (for production, use Redis)
const rateLimitStore = new Map();

// Clean up old entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.resetTime > 15 * 60 * 1000) {
      rateLimitStore.delete(key);
    }
  }
}, 15 * 60 * 1000);

/**
 * Rate limiter middleware
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @param {string} message - Error message to send
 */
function createRateLimiter(maxRequests = 10, windowMs = 15 * 60 * 1000, message = 'Too many requests') {
  return (req, res, next) => {
    // Use IP address or authenticated user ID as key
    const key = req.user ? `user_${req.user.userId}` : `ip_${req.ip}`;
    const now = Date.now();

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    const userLimit = rateLimitStore.get(key);

    // Reset if window has passed
    if (now > userLimit.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    // Check if limit exceeded
    if (userLimit.count >= maxRequests) {
      const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);
      res.set('Retry-After', retryAfter);
      return res.status(429).json({ 
        error: message,
        retryAfter: retryAfter
      });
    }

    // Increment count
    userLimit.count++;
    next();
  };
}

// Export different rate limiters for different routes
module.exports = {
  // Quiz submission: 10 per 15 minutes
  quizLimiter: createRateLimiter(
    10, 
    15 * 60 * 1000, 
    'Too many quiz attempts. Please try again later.'
  ),

  // Auth routes: 5 per 15 minutes
  authLimiter: createRateLimiter(
    5, 
    15 * 60 * 1000, 
    'Too many authentication attempts. Please try again later.'
  ),

  // API routes: 100 per 15 minutes
  apiLimiter: createRateLimiter(
    100, 
    15 * 60 * 1000, 
    'Too many requests. Please slow down.'
  )
};