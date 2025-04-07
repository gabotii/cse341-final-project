const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const passport = require('../middleware/auth').passport;
const { generateToken } = require('../middleware/auth');
const usersController = require('../controllers/users');
const { validateRegister, validateLogin } = require('../middleware/validation');
const fs = require('fs');
const path = require('path');

// Serve the full Swagger UI for /api-docs
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

// Serve the login status page for /api-docs/login
router.get('/api-docs/login', (req, res) => {
  const filePath = path.join(__dirname, '../views/loginStatus.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading loginStatus.html:', err);
      return res.status(500).json({ message: 'Error loading login status page' });
    }
    res.send(data);
  });
});

router.post('/register', validateRegister, usersController.register);
router.post('/login', validateLogin, usersController.login);
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.json({ token });
  }
);
router.get('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully (token should be discarded client-side)' });
});

router.use('/clients', require('./clients'));
router.use('/swimmingTools', require('./swimmingTools'));
router.use('/orders', require('./orders'));
router.use('/deliveries', require('./deliveries'));

router.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = router;