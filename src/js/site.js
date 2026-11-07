// Header state, mobile menu and scroll reveals.
(function () {
  var header = document.getElementById('site-header');
  var btn = document.querySelector('.menu-btn');
  var label = btn && btn.querySelector('.menu-label');

  function setMenu(open) {
    header.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (btn) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); btn.focus(); }
    });
    document.querySelectorAll('#menu a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    window.matchMedia('(min-width: 72rem)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }
})();

// Shared helper: current time at the destination (time zone comes from site.config.mjs).
window.localNow = function () {
  var tz = document.documentElement.getAttribute('data-tz') || undefined;
  var parts;
  try {
    parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', month: 'numeric', weekday: 'short', hourCycle: 'h23' }).formatToParts(new Date());
  } catch (e) {
    parts = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', month: 'numeric', weekday: 'short', hourCycle: 'h23' }).formatToParts(new Date());
  }
  var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
  return { minutes: Number(get('hour')) * 60 + Number(get('minute')), month: Number(get('month')), weekday: get('weekday') };
};
window.localHHMM = function (n) {
  return String(Math.floor(n.minutes / 60)).padStart(2, '0') + ':' + String(n.minutes % 60).padStart(2, '0');
};

// Footer: live local time at the destination.
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('foot-time');
  if (el) el.textContent = window.localHHMM(window.localNow());
});
