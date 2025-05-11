const sequelize = require('sequelize');
const db = new sequelize(
    'superr',
    'root',
    'drago1234', {
        dialect: 'mysql',
        logging: false
    }
);
module.exports = db;