const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
  dataTask: Object,
});

module.exports = { name: 'DataTask', schema: dataSchema, dbname: 'dataTask' };
