const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { description } = require('../../../models/users-schema');

/**
 * Get list of users
 * @returns {Array}
 */

/* FUNGSI getUserrs sebelum dimodifikasi:
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}
*/
/**PENJELASAN PERUBAHAN
 * 1. penambahan parameter dan fitur Pagination
 *    - fungsi 'getUsers' menerima parameter tambahan yaitu pageNumber, pageSize, sortField, sortOrder, searchField, searchKey
 *      Penambahan ini dilakukan untuk mempermudah pagination(halaman berikutnya, sebelumya dan shorting berdasarkan kriteria tertentu.)
 * 2. Implementasi Pagination dan Sorting:
 *    - Parameter-parameter yang diterima digunakan untuk mengatur skip (melewati berapa data), sorting (pengurutan), dan filtering (pencarian) pada saat mengambil data pengguna (usersRepository.getUsers).
 *      Hasil data pengguna kemudian dimodifikasi dan disusun dalam format yang sesuai dengan struktur paginasi yang diinginkan, termasuk informasi jumlah total data dan halaman-halaman terkait.
 *
 * Get list of users
 * @param {number} [pageNumber=1] - Page number
 * @param {number} [pageSize=10] - Page size
 * @param {string} [sortField] - Sort field (email, name, or id)
 * @param {string} [sortOrder=asc] - Sort order (asc or desc)
 * @param {string} [searchField] - Search field (email or name)
 * @param {string} [searchKey] - Search key
 * @returns {Promise<PaginatedResults>} - Paginated results
 */

// Fungsi 'getUsers' setelah dimodifikasi (no1)
async function getUsers(
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
    const users = await usersRepository.getUsers(skip, pageSize, sort, filter);

    const results = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));

    const totalCount = await usersRepository.countUsers(filter);

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
    console.error('Error fetching users:', error);
    throw error; // Propagate the error to the caller
  }
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};