/*bank-validator= berfungsi sebagai validasi/body yang nantinya akan ditulis pada postman atau bruno*/
const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  // Validasi untuk membuat transaksi baru
  createTransactionValidation: {
    body: {
      recipientAccountId: joi.string().min(1).max(100).required().label('IdPenerima'),
      amount: joi.number().min(1).required().label('amount'),
      description: joi.string().required().label('Description'),
    },
  },

  // Validasi untuk memperbarui transaksi
  updateTransactionValidation: {
    body: {
      amount: joi.number().required().label('Jumlah'),
      recipientAccountId: joi.string().required().label('Receiver ID'),
      description: joi.string().required().label('Description'),
    },
  },
};