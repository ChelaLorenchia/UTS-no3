const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
/** PENJELASAN PERUBAHAN
 * 1. Penambahan Parameter
 *    - Kode kedua menambahkan parameter skip, limit, sort, dan filter ke dalam fungsi getUsers. 
 *      Hal ini memungkinkan untuk melakukan pagination (melompati sejumlah data dan membatasi jumlah data yang diambil), pengurutan, dan filter berdasarkan kriteria tertentu saat mengambil daftar pengguna dari database.
 * 2. Implementasi Penggunaan Parameter
 *    - Parameter skip digunakan untuk menentukan berapa data yang akan dilewati sebelum mengambil data pengguna.
 *    - Parameter limit digunakan untuk membatasi jumlah data pengguna yang diambil.
 *    - Parameter sort digunakan untuk menentukan kriteria pengurutan (ascending atau descending) pada data pengguna.
 *    - Parameter filter digunakan untuk menyaring data pengguna berdasarkan kriteria tertentu.
 * 
 * @param {number} skip - Number of users to be skipped.
 * @param {number} limit - Limit number of users to be returned.
 * @param {object} sort - Sort object.
 * @param {object} filter - Filter object.
 * @returns {Promise}
*/
// Pada bagian get users ada beberapa code yang dimodifikasi untuk no 1 
async function getUsers(skip, limit, sort, filter) {
  return User.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .exec();
}

/** PENJELASAN PENAMBAHAN FUNGSI 'countUsers'
 * - Fungsi 'countUsers' digunakan untuk menghitung jumlah pengguna yang sesuai dengan kriteria tertentu.
 * - Penggunaan parameter tambahan pada fungsi getUsers pada kode kedua memberikan fleksibilitas yang lebih dalam pengambilan data pengguna dari database.
 * - Saat memanggil fungsi getUsers(skip, limit, sort, filter) pada kode kedua, fungsi ini akan mengembalikan daftar pengguna yang sudah difilter, diurutkan, dan dipaginasi sesuai dengan parameter yang diberikan.
 * 
 * @param {object} filter - Filter object.
 * @returns {Promise}
 *  */
// Menambahkan fungsi countUsers
async function countUsers(filter) {
  return User.countDocuments(filter).exec();
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  countUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
