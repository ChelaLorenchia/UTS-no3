// mengimport model 'bank' dari folder models
const { bank } = require('../../../models');

// Fungsi untuk menghitung jumlah transaksi berdasarkan filter
async function countbank(filter) {
  return bank.countDocuments(filter).exec(); 
}// Menghitung jumlah dokumen transaksi yang sesuai dengan filter

// Fungsi untuk mendapatkan semua transaksi
async function getTransactionForAccounts() {
  return bank.find({}); 
} // Mengembalikan semua dokumen transaksi dari koleksi 'bank'

// Fungsi untuk mendapatkan detail transaksi berdasarkan ID
async function getTransactionForAccount(id) {
  return bank.findById(id);
}// Mengembalikan dokumen transaksi dengan ID yang cocok

// Fungsi untuk membuat transaksi baru
async function createTransaction(amount, recipientAccountId, description){
  return bank.create({
    amount,
    recipientAccountId,
    description
  });
}// Membuat transaksi baru dengan properti amount, recipientAccountId, dan description

// Fungsi untuk memperbarui detail transaksi berdasarkan ID
async function updateTransactionDetails(id, amount, recipientAccountId, description) {
  return bank.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        amount,
        recipientAccountId,
        description,
      },
    }
  ); // Memperbarui dokumen transaksi dengan ID yang cocok dengan nilai baru
}

// Fungsi untuk menghapus transaksi berdasarkan ID
async function deleteTransactionById(id) {
  return bank.deleteOne({_id: id})
}// Menghapus dokumen transaksi dengan ID yang cocok

module.exports = {
  createTransaction,
  countbank,
  getTransactionForAccounts,
  getTransactionForAccount,
  updateTransactionDetails,
  deleteTransactionById,
};
