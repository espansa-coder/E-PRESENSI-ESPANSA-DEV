/* =====================================================
 * E-PRESENSI ESPANSA
 * LOGIN PAGE
 * Versi 1.1.0 - DEV
 * ===================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('loginForm');
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');
    var loginButton = document.getElementById('loginButton');
    var message = document.getElementById('loginMessage');
    var togglePassword = document.getElementById('togglePassword');
    var successPanel = document.getElementById('loginSuccess');
    var welcomeMessage = document.getElementById('welcomeMessage');
    var nextStepMessage = document.getElementById('nextStepMessage');
    var logoutButton = document.getElementById('logoutButton');

    function showMessage_(text) {
      message.textContent = text;
      message.hidden = false;
    }

    function clearMessage_() {
      message.textContent = '';
      message.hidden = true;
    }

    function setLoading_(loading) {
      loginButton.disabled = loading;
      loginButton.textContent = loading ? 'Memeriksa akun...' : 'Masuk';
      form.setAttribute('aria-busy', loading ? 'true' : 'false');
    }

    function getUserName_(user) {
      return user.namaLengkap ||
        user.nama_lengkap ||
        user.NAMA_LENGKAP ||
        user.username ||
        user.USERNAME ||
        'Pengguna';
    }

    function getRole_(user) {
      return String(user.role || user.ROLE || '').trim().toUpperCase();
    }

    function continueByRole_(user, fromExistingSession) {
      var role = getRole_(user);

      if (role === 'ADMIN_UTAMA') {
        window.location.replace('dashboard-admin-utama.html');
        return true;
      }

      form.hidden = true;
      successPanel.hidden = false;
      welcomeMessage.textContent = fromExistingSession
        ? 'Sesi aktif: ' + getUserName_(user) + (role ? ' (' + role + ').' : '.')
        : 'Selamat datang, ' + getUserName_(user) + (role ? ' (' + role + ').' : '.');

      nextStepMessage.textContent =
        'Autentikasi berhasil dan sesi login tersimpan. Dashboard untuk peran ini belum diintegrasikan pada tahap DEV saat ini.';
      return false;
    }

    togglePassword.addEventListener('click', function () {
      var show = passwordInput.type === 'password';
      passwordInput.type = show ? 'text' : 'password';
      togglePassword.textContent = show ? 'Sembunyikan' : 'Lihat';
      togglePassword.setAttribute('aria-pressed', show ? 'true' : 'false');
      togglePassword.setAttribute(
        'aria-label',
        show ? 'Sembunyikan password' : 'Tampilkan password'
      );
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearMessage_();

      var username = usernameInput.value.trim();
      var password = passwordInput.value;

      if (!username) {
        showMessage_('Username harus diisi.');
        usernameInput.focus();
        return;
      }

      if (!password) {
        showMessage_('Password harus diisi.');
        passwordInput.focus();
        return;
      }

      if (!window.EP || typeof window.EP.login !== 'function') {
        showMessage_('Modul login belum berhasil dimuat. Muat ulang halaman.');
        return;
      }

      setLoading_(true);

      window.EP.login(username, password, { source: 'WEB' })
        .then(function (result) {
          var user = result.user || {};

          if (result.mustChange) {
            window.location.replace('ganti-password.html');
            return;
          }

          continueByRole_(user, false);
        })
        .catch(function (error) {
          showMessage_(
            error && error.message
              ? error.message
              : 'Login belum berhasil. Periksa username dan password.'
          );
          passwordInput.value = '';
          passwordInput.focus();
        })
        .finally(function () {
          setLoading_(false);
        });
    });

    logoutButton.addEventListener('click', function () {
      if (window.EP && typeof window.EP.logout === 'function') {
        window.EP.logout('Anda telah keluar dari aplikasi.');
      } else {
        window.location.replace('login.html');
      }
    });

    // Sesi aktif diarahkan sesuai peran; perubahan password wajib tetap didahulukan.
    var existingSession = window.EP && window.EP.session
      ? window.EP.session()
      : null;

    if (existingSession && existingSession.token && existingSession.mustChange) {
      window.location.replace('ganti-password.html');
      return;
    }

    if (existingSession && existingSession.token && existingSession.user) {
      continueByRole_(existingSession.user, true);
    } else {
      var flashMessage = sessionStorage.getItem('ep.msg');
      if (flashMessage) {
        sessionStorage.removeItem('ep.msg');
        showMessage_(flashMessage);
      }
      usernameInput.focus();
    }
  });
})();
