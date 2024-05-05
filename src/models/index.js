const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
// Import skema untuk koleksi 'bank'
const bankSchema = require('./bank-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', mongoose.Schema(usersSchema));
// Membuat model Mongoose untuk koleksi 'bank' berdasarkan skema yang diimpor
const bank = mongoose.model('bank', mongoose.Schema(bankSchema));

module.exports = {
  mongoose,
  User,
  bank,// Eksport model bank untuk berinteraksi dengan koleksi 'bank'
};