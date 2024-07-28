document.addEventListener('DOMContentLoaded', () => {
  const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');

  themeToggleCheckbox.addEventListener('change', () => {
    if (themeToggleCheckbox.checked) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  });

  // Load theme preference if available
  if (localStorage.getItem('theme') === 'dark') {
    themeToggleCheckbox.checked = true;
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.add('light-theme');
  }
  
  themeToggleCheckbox.addEventListener('change', () => {
    if (themeToggleCheckbox.checked) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
});
