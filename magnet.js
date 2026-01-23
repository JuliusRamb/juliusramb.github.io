function setupMagnet(el, {
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out'
} = {}) {
  if (!el) return;

  el.style.position = 'relative';
  el.style.display = el.style.display || 'inline-block';
  el.style.willChange = 'transform';

  let isActive = false;

  const onMove = (e) => {
    if (disabled) {
      el.style.transform = 'translate3d(0px, 0px, 0)';
      return;
    }

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = Math.abs(centerX - e.clientX);
    const distY = Math.abs(centerY - e.clientY);

    if (distX < rect.width / 2 + padding && distY < rect.height / 2 + padding) {
      isActive = true;

      const offsetX = (e.clientX - centerX) / magnetStrength;
      const offsetY = (e.clientY - centerY) / magnetStrength;

      el.style.transition = activeTransition;
      el.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    } else {
      if (isActive) isActive = false;
      el.style.transition = inactiveTransition;
      el.style.transform = 'translate3d(0px, 0px, 0)';
    }
  };

  window.addEventListener('mousemove', onMove);
  return () => window.removeEventListener('mousemove', onMove);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.magnet').forEach(el => {
    setupMagnet(el, { padding: 80, magnetStrength: 2 });
  });
});
