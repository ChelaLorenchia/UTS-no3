// mengimport file bankRepository untuk mengakses bank-repository.js
const bankRepository = require('./bank-repository');

// Fungsi untuk mendapatkan daftar transaksi dengan filter dan paging (sesuai dengan soal nomor 1)
async function getTransactionForAccounts(
  pageNumber = 1,
  pageSize = 10,
  sortField = 'email',
  sortOrder = 'asc',
  searchField,
  searchKey
) {
  const skip = (pageNumber - 1) * pageSize;

  // Prepare sorting order based on sortOrder
  const sort = {};
  sort[sortField] = sortOrder === 'asc' ? 1 : -1;

  // Prepare filter based on searchField and searchKey
  const filter = {};
  if (searchField && searchKey) {
    filter[searchField] = { $regex: new RegExp(searchKey, 'i') }; // Case-insensitive regex search
  }

  try {
    const bank = await bankRepository.getTransactionForAccounts(skip, pageSize, sort, filter);

    const results = bank.map((bank) => ({      
      id: bank.id,
      amount: bank.amount,
      recipientAccountId: bank.recipientAccountId,
      description: bank.description,
    }));

    const totalCount = await bankRepository.countbank(filter);

    const total_pages = Math.ceil(totalCount / pageSize);

    const responseObj = {
      page_number: pageNumber,
      page_size: pageSize,
      count: results.length,
      total_pages,
      has_previous_page: pageNumber > 1,
      has_next_page: pageNumber < total_pages,
      data: results,
    };

    return responseObj;
  } catch (error) {
    console.error('Error fetching bank:', error);
    throw error; // Propagate the error to the caller
  }
}

// Fungsi untuk mendapatkan detail transaksi berdasarkan ID
async function getTransactionForAccount(id) {
  const bank = await bankRepository.getTransactionForAccounts(id);
  if (!bank) {
    return null;
  }

  // Format hasil detail transaksi
  return{
    id: bank.id,
    amount: bank.amount,
    recipientAccountId: bank.recipientAccountId,
    description: bank.description,
  };
}

// Fungsi untuk membuat transaksi baru
async function createTransaction(amount, recipientAccountId, description) {
  try {
    // data transaksi
    const transactionData = {
      recipientAccountId, // ID akun penerima transaksi
      amount, // Jumlah dana yang akan ditransfer
      description, // Deskripsi atau keterangan transaksi
    };

    // memanggil file bankRepository untuk membuat transaksi baru
    const newTransaction = await bankRepository.createTransaction(transactionData.recipientAccountId, transactionData.amount, transactionData.description);
    return newTransaction;
  } catch (error) {
    throw new Error('Gagal membuat transaksi. ' + error.message);
  }
}

// Fungsi untuk memperbarui detail transaksi
async function updateTransactionDetails(id, amount, recipientAccountId, description) {
  const bank = await bankRepository.getTransactionForAccounts(id);

  if (!bank) {
    return null;
  }

  try {
    await bankRepository.updateTransactionDetails(id, amount, recipientAccountId, description);
    
    } catch (error) {
      return null;
    }
      return true;
  }

// Fungsi untuk menghapus transaksi berdasarkan ID
async function deleteTransactionById(id) {
  const bank = await bankRepository.getTransactionForAccounts(id);

  // User not found
  if (!bank) {
    return null;
  }

  try {
    await bankRepository.deleteTransactionById(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  createTransaction,
  getTransactionForAccounts,
  getTransactionForAccount,
  updateTransactionDetails,
  deleteTransactionById, 
};