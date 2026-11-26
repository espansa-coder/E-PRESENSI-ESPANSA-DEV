/* =====================================================
 * E-PRESENSI ESPANSA
 * DASHBOARD ADMIN UTAMA - DEV
 * ===================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.EP || typeof window.EP.requireLogin !== 'function') {
      window.location.replace('login.html');
      return;
    }

    if (!window.EP.requireLogin(['ADMIN_UTAMA'])) return;

    var session = window.EP.session();
    var user = session && session.user ? session.user : {};
    var name = user.namaLengkap || user.nama_lengkap ||
      user.NAMA_LENGKAP || user.username || user.USERNAME || 'Admin Utama';
    var username = user.username || user.USERNAME || '—';

    document.getElementById('welcomeName').textContent = 'Selamat datang, ' + name;
    document.getElementById('accountName').textContent = name;
    document.getElementById('accountUsername').textContent = 'Username: ' + username;

    document.getElementById('logoutButton').addEventListener('click', function () {
      window.EP.logout('Anda telah keluar dari aplikasi.');
    });
  });
})();
