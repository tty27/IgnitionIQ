const rateLimitStore = new Map();

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
 * @param {number} maxRequests 
 * @param {number} windowMs 
 * @param {string} message 
 */
function createRateLimiter(maxRequests = 10, windowMs = 15 * 60 * 1000, message = 'Too many requests') {
  return (req, res, next) => {
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

    if (now > userLimit.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (userLimit.count >= maxRequests) {
      const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);
      res.set('Retry-After', retryAfter);
      return res.status(429).json({ 
        error: message,
        retryAfter: retryAfter
      });
    }

    userLimit.count++;
    next();
  };
}

module.exports = {
  quizLimiter: createRateLimiter(
    10, 
    15 * 60 * 1000, 
    'Too many quiz attempts. Please try again later.'
  ),

  authLimiter: createRateLimiter(
    50, 
    5 * 60 * 1000, 
    'Too many authentication attempts. Please try again in a few minutes.'
  ),

  apiLimiter: createRateLimiter(
    100, 
    15 * 60 * 1000, 
    'Too many requests. Please slow down.'
  )
};