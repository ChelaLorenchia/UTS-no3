const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
// Import router untuk fitur bank (transaksi)
const bank = require('./components/bank/bank-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  /*Menggunakan router untuk fitur bank (transaksi) 
    ini nantinya akan menambahkan endpoint terkait transaksi ke dalam route Express'app*/ 
  bank(app);

  return app;
};
