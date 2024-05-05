/*bank-schema=  berfungsi sebagai skema untuk menyatakan tipe data dari setiap properti yang dimiliki oleh data transaks*/
const bankSchema = {
  amount: Number, // Properti 'amount' dengan tipe data Number
  recipientAccountId: String, // Properti 'recipientAccountId' dengan tipe data String
  description: String, // Properti 'description' dengan tipe data String
};

module.exports = bankSchema; 
// Eksport skema transaksi bank agar dapat digunakan di bagian lain dari aplikasi