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
};
