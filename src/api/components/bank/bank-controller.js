// mengimport file bankService untuk mengakses bank-service.js
const bankService = require('./bank-service');
// mengimport errorResponder dan errorTypes untuk menangani kesalahan
const { errorResponder, errorTypes } = require('../../../core/errors');

// Fungsi untuk mendapatkan daftar transaksi dengan filter dan paging
async function getTransactionForAccounts(request, response, next) {
  try {
    const bank = await bankService.getTransactionForAccount();
    return response.status(200).json(bank);
  } catch (error) {
    return next(error);
  }
}

// Fungsi untuk mendapatkan detail transaksi berdasarkan ID
async function getTransactionForAccount(request, response, next) {
  try {
    const bank = await bankService.getTransactionForAccounts(request.params.id);

    if (!bank || bank.length === 0) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Transaksi tidak ditemukan');
    }

    return response.status(200).json(bank);
  } catch (error) {
    return next(error);
  }
}
// Fungsi untuk membuat transaksi baru
async function createTransaction(request, response, next) {
  try {
    const id = request.params.id;// ID transaksi
    const amount = request.body.amount;// Jumlah dana yang akan ditransfer
    const recipientAccountId = request.body.recipientAccountId;// ID akun penerima transaksi
    const description = request.body.description;// Deskripsi atau keterangan transaksi

    const success = await bankService.createTransaction(id, amount, recipientAccountId, description);
    if (!success) {
      // Jika pembuatan transaksi gagal, lemparkan error UNPROCESSABLE_ENTITY
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create transaction'
      );
    }

    return response.status(200).json({ id, amount, recipientAccountId, description });
  } catch (error) {
    return next(error);
  }
}
// Fungsi untuk memperbarui detail transaksi berdasarkan ID transaksi
async function updateTransactionDetails(request, response, next) {
  try {
    const id = request.params.id; // ID transaksi yang akan diperbarui
    const amount = request.body.amount; // Jumlah dana yang akan diperbarui
    const recipientAccountId = request.body.receiver_id; // ID akun penerima transaksi (harusnya recipientAccountId)
    const description = request.body.description; // Deskripsi atau keterangan transaksi yang akan diperbarui

    const success = await bankService.updateTransactionDetails(
      id,
      amount,
      recipientAccountId,
      description
    );

    if (!success) {
      // Jika pembuatan transaksi gagal, lemparkan error UNPROCESSABLE_ENTITY
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update transaction details'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

// Fungsi untuk menghapus transaksi berdasarkan ID transaksi
async function deleteTransactionById(request, response, next) {
  try {
    const id = request.params.id;// ID transaksi yang akan dihapus

    const success = await bankService.deleteTransactionById(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete transaction'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}
// melakukan exports fungsi-fungsi yang dibutuhkan sebagai modul
module.exports = {
  createTransaction,
  getTransactionForAccounts,
  getTransactionForAccount,
  updateTransactionDetails,
  deleteTransactionById,
};