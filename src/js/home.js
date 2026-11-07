// Home page: live local time and the current month in the calendar.
(function () {
  var now = window.localNow();
  var timeEl = document.getElementById('home-time');
  if (timeEl) timeEl.textContent = window.localHHMM(now);

  var cell = document.querySelector('#home-months a[data-month="' + now.month + '"]');
  if (cell) { cell.classList.add('is-now'); cell.setAttribute('aria-label', cell.textContent + ' (this month)'); }
})();
