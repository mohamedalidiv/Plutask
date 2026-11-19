window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));
window.confirm = () => true;

beforeEach(() => {
  localStorage.clear();
  window.location.hash = "";
  document.documentElement.className = "";
});
