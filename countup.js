function formatNumber(value) {
  // heltal räcker för dina siffror
  return Math.round(value).toString();
}

function animateCountUp(el, { from, to, durationSec }) {
  const start = performance.now();
  const durationMs = Math.max(0.2, durationSec) * 1000;

  function frame(now) {
    const t = Math.min(1, (now - start) / durationMs);
    // easeOutCubic (nära "power3.out"-känsla)
    const eased = 1 - Math.pow(1 - t, 3);

    const current = from + (to - from) * eased;
    el.textContent = formatNumber(current);

    if (t < 1) requestAnimationFrame(frame);
  }

  el.textContent = formatNumber(from);
  requestAnimationFrame(frame);
}

function setupCountUps() {
  const els = document.querySelectorAll('.countup');
  if (!els.length) return;

  const seen = new WeakSet();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (seen.has(el)) return;

      seen.add(el);

      const to = Number(el.dataset.to ?? 0);
      const from = Number(el.dataset.from ?? 0);
      const durationSec = Number(el.dataset.duration ?? 2);

      animateCountUp(el, { from, to, durationSec });
    });
  }, { threshold: 0.3 });

  els.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', setupCountUps);
