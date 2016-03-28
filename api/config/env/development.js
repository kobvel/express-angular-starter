import logger from '../logger.js';

module.exports = {
  database: 'mean_relational',
  username: '',
  password: '',
  params: {
    dialect: 'sqlite',
    storage: 'mean_relational.sqlite',
    logging: (sql) => {
      logger.info(`[${new Date()}] ${sql}`);
    },
    define: {
      underscored: true,
    },
  },
  jwtSecret: 'Mean-relational-AP1',
  jwtSession: { session: false },
  emailService: 'Gmail',
  auth: {
    user: '',
    pass: '',
  },
  verifyEmail: false,
  urlBaseClient: 'https://localhost:9000',
  urlBaseApi: 'https://localhost:3000',
  FACEBOOK_SECRET: '', // Facebook secret API
  TWITTER_KEY: '',
  TWITTER_SECRET: '',
  INSTAGRAM_SECRET: '',
  GOOGLE_SECRET: '',
};
