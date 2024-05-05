/*bank-route= berfungsi sebagai end-point yang nantinya akan di gunakan untuk pemanggilan pada bruno/postman*/
const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const bankController = require('./bank-controller');
const bankValidator = require('./bank-validator');

// Membuat objek Router dari Express
const route = express.Router();

module.exports = (app) => {
  app.use('/banks', route); // Mounting route di /banks pada aplikasi Express

  // Get list of bank
  route.get('/', authenticationMiddleware, bankController.getTransactionForAccount);
  
  // Create bank  
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(bankValidator.createTransactionValidation),
    bankController.createTransaction
  );

  // Get user detail
  route.get(
    '/:id',
    authenticationMiddleware,
    bankController.getTransactionForAccount
  );

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(bankValidator.updateTransactionValidation),
    bankController.updateTransactionDetails
  );
  
  // Delete transaction by ID
  route.delete(
    '/:id',
    authenticationMiddleware,
    bankController.deleteTransactionById
  );  
};
