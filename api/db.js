import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import mongoose from 'mongoose';

let db = null;

mongoose.connect('mongodb://localhost/playsport-dev');

module.exports = app => {
  if (!db) {
    const config = app.config.config;
    const sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config.params
    );
    db = {
      sequelize,
      Sequelize,
      models: {},
    };
    const dirSQL = path.join(__dirname, '/models/sql');

    fs.readdirSync(dirSQL).forEach(file => {
      const modelDir = path.join(dirSQL, file);
      const model = sequelize.import(modelDir);
      db.models[model.name] = model;
    });
    Object.keys(db.models).forEach(key => {
      db.models[key].associate(db.models);
    });

    // mongo-attemp
    const dirMongo = path.join(__dirname, '/models/mongo');

    fs.readdirSync(dirMongo).forEach(file => {
      const modelDir = path.join(dirMongo, file);
      const modelFile = require(modelDir);
      const model = mongoose.model(modelFile.dbname, modelFile.schema);
      db.models[modelFile.name] = model;
    });

    // endMongo-attemp
  }
  return db;
};
