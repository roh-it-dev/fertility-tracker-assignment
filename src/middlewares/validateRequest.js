function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = {};
  if (!email || !email.trim()) errors.email = 'Email is required';
  if (!password || !password.trim()) errors.password = 'Password is required';
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  next();
}

function validateSignUp(req, res, next) {
  const { username, email, password } = req.body;
  const errors = {};
  if (!username || !username.trim()) errors.username = 'Name is required';
  if (!email || !email.trim()) errors.email = 'Email is required';
  if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  next();
}

module.exports = { validateLogin, validateSignUp };
