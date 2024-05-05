const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

// Objek untuk menyimpan jumlah percobaan gagal login dan waktu terakhir login
const loginAttempts = {};

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Inisialisasi jumlah percobaan gagal login jika belum ada
    if (!loginAttempts[email]) {
      loginAttempts[email] = {
        count: 0,
        lastAttempt: null,
      };
    }

    const attemptInfo = loginAttempts[email];

    // Cek apakah pengguna telah melewati batas percobaan gagal
    if (attemptInfo.count >= 5 && Date.now() - attemptInfo.lastAttempt < 1800000) {
      // Jika sudah melewati batas, kirim error 403 Forbidden
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts. Please try again later.'
      );
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(email, password);

    if (loginSuccess) {
      // Reset counter jika login berhasil
      attemptInfo.count = 0;
      attemptInfo.lastAttempt = null;
      return response.status(200).json(loginSuccess);
    }

    // Jika login gagal, tambahkan jumlah percobaan dan waktu terakhir percobaan
    attemptInfo.count++;
    attemptInfo.lastAttempt = Date.now();

    throw errorResponder(
      errorTypes.INVALID_CREDENTIALS,
      'Incorrect email or password. Please try again.'
    );
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};