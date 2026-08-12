export const resetScrollPosition = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

export const scrollToTopSmooth = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  document.documentElement.scrollTo({ top: 0, left: 0, behavior: "smooth" });
};

export const getScrollY = () =>
  window.pageYOffset ||
  document.documentElement.scrollTop ||
  document.body.scrollTop ||
  0;
