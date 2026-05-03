/**
 * Theme controller. The initial theme is set by an inline boot script in
 * index.html (so there is no flash). This module wires the toggle button
 * and broadcasts theme changes via a custom event so the 3D scenes can
 * re-skin themselves.
 */
const STORAGE_KEY = 'theme';

export function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

export function setTheme(theme, { persist = true } = {}) {
  const next = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  if (persist) {
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
  }
  // Sync the toggle button if present
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.setAttribute('aria-pressed', String(next === 'light'));
    btn.setAttribute('aria-label', next === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  }
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
}

export function initTheme() {
  setTheme(getTheme(), { persist: false });
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
}
