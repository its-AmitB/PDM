// Sidebar toggle for mobile
const toggleBtn = document.getElementById('sidebarToggle');
const sidebar   = document.getElementById('sidebar');
if (toggleBtn && sidebar) {
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// Auto-dismiss alerts after 4 seconds
document.querySelectorAll('.alert').forEach(alert => {
  setTimeout(() => {
    // Only attempt to close if bootstrap is available
    if (typeof bootstrap !== 'undefined') {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
      if (bsAlert) bsAlert.close();
    } else {
      alert.style.display = 'none';
    }
  }, 4000);
});
