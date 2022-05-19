const Sequelize = require('sequelize');

const db = new Sequelize('product', 'root', 'umaushan', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = db;
