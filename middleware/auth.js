const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// Check for required environment variables
const githubConfig = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
};

if (!githubConfig.clientID || !githubConfig.clientSecret || !githubConfig.callbackURL) {
  console.warn('GitHub OAuth configuration incomplete. GitHub authentication will not work.');
} else {
  passport.use(new GitHubStrategy(githubConfig,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = mongodb.getDatabase().db();
        let user = await db.collection('users').findOne({ githubId: profile.id });
        
        if (!user) {
          user = {
            githubId: profile.id,
            email: profile.emails ? profile.emails[0].value : null,
            username: profile.username,
            createdAt: new Date()
          };
          await db.collection('users').insertOne(user);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await mongodb.getDatabase().db()
      .collection('users')
      .findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

module.exports = {
  passport,
  generateToken,
  verifyToken
};