const sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const db = new sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development'
    }
);
module.exports = db;