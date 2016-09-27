import Sequelize from 'sequelize';

import config from './config';

const db = {
  sequelize: null,
  Sequelize,
};

if (!db.sequelize) {
  db.sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config.params
  );
}

module.exports = db;
