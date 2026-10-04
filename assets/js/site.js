/* Shared page chrome for event pages: header with home link and prev/next links in book order.
 * An event page declares <body data-event="<id>"> and includes this script. */
(function () {
  'use strict';
  const BASE = (document.currentScript && document.currentScript.src || '').replace(/assets\/js\/site\.js(\?.*)?$/, '');
  const id = document.body.dataset.event;
  if (!id) return;

  fetch(BASE + 'data/events.json').then(r => r.json()).then(events => {
    const i = events.findIndex(e => e.id === id);
    if (i < 0) { console.warn('site.js: event not in events.json:', id); return; }
    const prev = events[i - 1], next = events[i + 1];
    const link = (e, dir) => e
      ? `<a href="${BASE}events/${e.id}.html" rel="${dir}">${dir === 'prev' ? '‹ ' : ''}${e.title}${dir === 'next' ? ' ›' : ''}</a>`
      : '<span></span>';
    const pager = `<nav class="pager" aria-label="Previous and next event">${link(prev, 'prev')}${link(next, 'next')}</nav>`;

    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `<a class="home" href="${BASE}index.html">Overview map</a><span class="spacer"></span>${pager}`;
    document.body.prepend(header);

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `${pager}<div>A geographic companion to Ron Chernow's <i>Washington: A Life</i>. Map base data: US Census TIGER, Natural Earth, AWS Terrain Tiles.</div>`;
    document.body.append(footer);
  });
})();
