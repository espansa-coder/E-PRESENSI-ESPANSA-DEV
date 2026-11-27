/* =====================================================
 * E-PRESENSI ESPANSA
 * DASHBOARD ADMIN UTAMA - DEV
 * Informasi akun dan pemeriksaan koneksi backend.
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

    var statusNode = document.getElementById('backendStatus');
    var detailNode = document.getElementById('backendDetail');
    var checkedAtNode = document.getElementById('backendCheckedAt');
    var checkButton = document.getElementById('checkBackendButton');

    document.getElementById('welcomeName').textContent = 'Selamat datang, ' + name;
    document.getElementById('accountName').textContent = name;
    document.getElementById('accountUsername').textContent = 'Username: ' + username;

    function setBackendState_(state, detail) {
      statusNode.textContent = state;
      detailNode.textContent = detail;
      statusNode.classList.remove(
        'admin-status-pending',
        'admin-status-online',
        'admin-status-offline'
      );

      if (state === 'Terhubung') {
        statusNode.classList.add('admin-status-online');
      } else if (state === 'Tidak terhubung') {
        statusNode.classList.add('admin-status-offline');
      } else {
        statusNode.classList.add('admin-status-pending');
      }

      checkedAtNode.textContent = 'Diperiksa: ' +
        new Date().toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });
    }

    function checkBackend_() {
      if (typeof window.EP.testPing !== 'function') {
        setBackendState_('Tidak tersedia', 'Fungsi pemeriksaan backend belum dimuat.');
        return;
      }

      checkButton.disabled = true;
      checkButton.textContent = 'Memeriksa...';
      statusNode.textContent = 'Memeriksa...';
      statusNode.classList.remove('admin-status-online', 'admin-status-offline');
      statusNode.classList.add('admin-status-pending');
      detailNode.textContent = 'Menghubungi layanan E-PRESENSI.';

      window.EP.testPing()
        .then(function () {
          setBackendState_('Terhubung', 'Backend merespons permintaan PING.');
        })
        .catch(function () {
          setBackendState_(
            'Tidak terhubung',
            'Backend belum dapat dihubungi. Periksa koneksi internet atau layanan Apps Script.'
          );
        })
        .finally(function () {
          checkButton.disabled = false;
          checkButton.textContent = 'Periksa ulang';
        });
    }

    checkButton.addEventListener('click', checkBackend_);
    document.getElementById('logoutButton').addEventListener('click', function () {
      window.EP.logout('Anda telah keluar dari aplikasi.');
    });

    checkBackend_();
  });
})();