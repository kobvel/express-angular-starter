import logger from '../logger.js';

module.exports = {
  database: 'mean_relational_prod',
  username: '',
  password: '',
  params: {
    dialect: 'sqlite',
    storage: 'mean_relational_prod.sqlite',
    logging: (sql) => {
      logger.info(`[${new Date()}] ${sql}`);
    },
    define: {
      underscored: true,
    },
  },
  jwtSecret: 'Mean-relational-AP1-prod',
  jwtSession: { session: false },
  emailService: 'Gmail',
  auth: {
    user: '',
    pass: '',
  },
  urlBaseClient: '',
  urlBaseApi: '',
};
