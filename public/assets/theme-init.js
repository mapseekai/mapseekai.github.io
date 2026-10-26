/* First-party, pre-paint theme preference. No network requests or tracking. */
(() => {
  let theme = 'light';
  try { if (localStorage.getItem('mapseek-theme') === 'dark') theme = 'dark'; } catch { /* Use the light reference design. */ }
  document.documentElement.dataset.craftTheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#141715' : '#f2f1ee');
})();
