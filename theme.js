const themeStorageKey = 'le-defi-francais-theme';
let theme = 'light';
try { theme = localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light'; }
catch (error) { if (error.name !== 'SecurityError') throw error; }

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  node('browser-theme-color').setAttribute('content', theme === 'dark' ? '#0b0b0d' : '#f7f7f2');
  node('theme-toggle').setAttribute('aria-pressed', String(theme === 'dark'));
  node('theme-toggle').setAttribute('aria-label', theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre');
  node('theme-toggle').textContent = theme === 'dark' ? '☀ Mode clair' : '☾ Mode sombre';
}
onClick('theme-toggle', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  try { localStorage.setItem(themeStorageKey, theme); }
  catch (error) { if (error.name !== 'SecurityError' && error.name !== 'QuotaExceededError') throw error; }
});
applyTheme();
