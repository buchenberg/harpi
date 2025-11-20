'use strict';

// Local configuration variables that will not be committed to the repository.
// Use this file for API keys, passwords, and other sensitive or local-specific settings.

module.exports = {
  // Database configuration
  // If using Docker MongoDB: mongodb://localhost:27017/harpi-dev
  // If using local MongoDB: mongodb://localhost:27017/harpi-dev
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/harpi-dev',
    options: {
      user: '', // Leave empty if MongoDB doesn't require authentication
      pass: '' // Leave empty if MongoDB doesn't require authentication
    },
    // Enable mongoose debug mode to see database queries in console
    debug: process.env.MONGODB_DEBUG === 'true' || false
  },

  // Session secret - CHANGE THIS to a random string for security!
  // Generate a secure random string: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  sessionSecret: process.env.SESSION_SECRET || 'CHANGE_THIS_TO_A_RANDOM_SECRET_STRING_IN_PRODUCTION',

  // OAuth providers (optional - only configure if you need social login)
  // Uncomment and fill in if you want to use these authentication methods
  
  // facebook: {
  //   clientID: process.env.FACEBOOK_ID || 'YOUR_FACEBOOK_APP_ID',
  //   clientSecret: process.env.FACEBOOK_SECRET || 'YOUR_FACEBOOK_APP_SECRET',
  //   callbackURL: '/api/auth/facebook/callback'
  // },
  
  // google: {
  //   clientID: process.env.GOOGLE_ID || 'YOUR_GOOGLE_CLIENT_ID',
  //   clientSecret: process.env.GOOGLE_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
  //   callbackURL: '/api/auth/google/callback'
  // },
  
  // github: {
  //   clientID: process.env.GITHUB_ID || 'YOUR_GITHUB_CLIENT_ID',
  //   clientSecret: process.env.GITHUB_SECRET || 'YOUR_GITHUB_CLIENT_SECRET',
  //   callbackURL: '/api/auth/github/callback'
  // },

  // Email configuration (optional - only configure if you need email functionality)
  // mailer: {
  //   from: process.env.MAILER_FROM || 'noreply@harpi.local',
  //   options: {
  //     service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail', // Gmail, SendGrid, etc.
  //     auth: {
  //       user: process.env.MAILER_EMAIL_ID || 'your-email@gmail.com',
  //       pass: process.env.MAILER_PASSWORD || 'your-app-password'
  //     }
  //   }
  // },

  // Database seeding (optional - set to true to automatically create default users)
  // seedDB: {
  //   seed: process.env.MONGO_SEED === 'true' ? true : false,
  //   options: {
  //     logResults: true,
  //     seedUser: {
  //       username: 'user',
  //       provider: 'local',
  //       email: 'user@localhost.com',
  //       firstName: 'User',
  //       lastName: 'Local',
  //       displayName: 'User Local',
  //       roles: ['user']
  //     },
  //     seedAdmin: {
  //       username: 'admin',
  //       provider: 'local',
  //       email: 'admin@localhost.com',
  //       firstName: 'Admin',
  //       lastName: 'Local',
  //       displayName: 'Admin Local',
  //       roles: ['user', 'admin']
  //     }
  //   }
  // }
};
