exports.validateQuizResult = (req, res, next) => {
  const { category, score, totalQuestions, timeTaken, level } = req.body;

  if (!category || score === undefined || !totalQuestions) {
    return res.status(400).json({ 
      error: 'Missing required fields: category, score, totalQuestions' 
    });
  }

  if (score < 0 || score > totalQuestions) {
    return res.status(400).json({ 
      error: 'Invalid score: must be between 0 and totalQuestions' 
    });
  }

  if (totalQuestions < 1 || totalQuestions > 100) { 
    return res.status(400).json({ 
      error: 'Invalid totalQuestions: must be between 1 and 100' 
    });
  }

  const minTime = category === 'mixed' ? 1 : totalQuestions * 2;
  const maxTime = totalQuestions * 600;
  
  if (timeTaken && (timeTaken < minTime || timeTaken > maxTime)) {
    return res.status(400).json({ 
      error: 'Suspicious completion time detected' 
    });
  }

  if (level && (level < 1 || level > 5)) {
    return res.status(400).json({ 
      error: 'Invalid level: must be between 1 and 5' 
    });
  }

  const validCategories = ['road-signs', 'dashboard', 'car-knowledge', 'mixed'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ 
      error: 'Invalid category' 
    });
  }

  next();
};

exports.validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: 'All fields are required: name, email, password' 
    });
  }

  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({ 
      error: 'Name must be between 2 and 50 characters' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format' 
    });
  }

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

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format' 
    });
  }

  next();
};