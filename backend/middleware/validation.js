// backend/middleware/validation.js

// Validate quiz result submission
exports.validateQuizResult = (req, res, next) => {
  const { category, score, totalQuestions, timeTaken, level } = req.body;

  // Check required fields
  if (!category || score === undefined || !totalQuestions) {
    return res.status(400).json({ 
      error: 'Missing required fields: category, score, totalQuestions' 
    });
  }

  // Validate score range
  if (score < 0 || score > totalQuestions) {
    return res.status(400).json({ 
      error: 'Invalid score: must be between 0 and totalQuestions' 
    });
  }

  // Validate totalQuestions
  if (totalQuestions < 1 || totalQuestions > 50) {
    return res.status(400).json({ 
      error: 'Invalid totalQuestions: must be between 1 and 50' 
    });
  }

  // Validate time taken (at least 2 seconds per question, max 10 minutes per question)
  const minTime = totalQuestions * 2;
  const maxTime = totalQuestions * 600;
  
  if (timeTaken && (timeTaken < minTime || timeTaken > maxTime)) {
    return res.status(400).json({ 
      error: 'Suspicious completion time detected' 
    });
  }

  // Validate level
  if (level && (level < 1 || level > 5)) {
    return res.status(400).json({ 
      error: 'Invalid level: must be between 1 and 5' 
    });
  }

  // Validate category format
  const validCategories = ['road-signs', 'dashboard', 'car-knowledge'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ 
      error: 'Invalid category' 
    });
  }

  next();
};

// Validate registration input
exports.validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  // Check required fields
  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: 'All fields are required: name, email, password' 
    });
  }

  // Validate name length
  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({ 
      error: 'Name must be between 2 and 50 characters' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format' 
    });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Password must be at least 6 characters' 
    });
  }

  if (password.length > 100) {
    return res.status(400).json({ 
      error: 'Password too long' 
    });
  }

  next();
};

// Validate login input
exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required' 
    });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format' 
    });
  }

  next();
};