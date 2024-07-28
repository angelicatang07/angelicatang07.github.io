function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar.style.display === 'block') {
    sidebar.style.display = 'none';
  } else {
    sidebar.style.display = 'block';
  }
}
