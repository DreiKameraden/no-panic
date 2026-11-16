/* =========================================
   theme.js — переключение тёмной/светлой темы
   Подключать в <head> БЕЗ defer, чтобы не было вспышки
   ========================================= */
(function () {
  const saved = localStorage.getItem('theme');
  const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const theme = saved || (systemLight ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
})();

// Вызывается после DOMContentLoaded, когда кнопка уже есть
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  updateThemeIcon(btn, current);

  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(btn, next);
  });
}

function updateThemeIcon(btn, theme) {
  btn.textContent = theme === 'light' ? '☀️' : '🌙';
  btn.setAttribute('aria-label', theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему');
}