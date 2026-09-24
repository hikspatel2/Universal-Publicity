/* ==========================================================================
   main.js — all interactions. Classic script (no ES modules), relies on
   the globals defined in data.js and i18n.js.
   ========================================================================== */
(function () {
  'use strict';

  /* Endpoint for the quote form (Formspree / EmailJS / Google Apps Script).
     Leave empty to fall back to opening WhatsApp with the form details. */
  var FORM_ENDPOINT = '';

  var qs = function (s, ctx) { return (ctx || document).querySelector(s); };
  var qsa = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------ *
   * i18n
   * ------------------------------------------------------------------ */
  var currentLang = document.documentElement.lang === 'gu' ? 'gu' : 'en';

  function t(key) {
    var dict = I18N[currentLang] || I18N.en;
    return (dict && dict[key] != null) ? dict[key] : (I18N.en[key] != null ? I18N.en[key] : key);
  }

  function applyI18n() {
    document.documentElement.lang = currentLang;
    qsa('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = t(key);
      var span = el.querySelector(':scope > span:first-child');
      // Elements that wrap the text in a <span> (buttons with an icon) keep the icon.
      if (span && el.children.length && el.tagName !== 'SPAN') {
        span.textContent = val;
      } else {
        el.textContent = val;
      }
    });
    qsa('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    qsa('[data-i18n-aria-label]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
    });
    // Category / chip labels rendered dynamically need a re-render, handled by callers.
  }

  function setLang(lang) {
    currentLang = (lang === 'gu') ? 'gu' : 'en';
    try { localStorage.setItem('up_lang', currentLang); } catch (e) {}
    qsa('[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === currentLang ? 'true' : 'false');
    });
    applyI18n();
    renderFilters();
    renderWorks();
    renderFeaturedWorks();
    renderClientsMarquee();
    renderTestimonials();
    updateFooterYear();
  }

  /* ------------------------------------------------------------------ *
   * Header: scroll shadow, active link, mobile menu
   * ------------------------------------------------------------------ */
  var header = qs('#site-header');
  var nav = qs('#site-nav');
  var navBackdrop = qs('#nav-backdrop');
  var menuBtn = qs('#menu-btn');

  function openMenu() {
    nav.classList.add('is-open');
    navBackdrop.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }
  function closeMenu() {
    nav.classList.remove('is-open');
    navBackdrop.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      nav.classList.contains('is-open') ? closeMenu() : openMenu();
    });
  }
  if (navBackdrop) navBackdrop.addEventListener('click', closeMenu);
  qsa('.nav__link, .nav__quote').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('scroll', function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });

  // Active nav link: each page is its own file now, so just match the current filename.
  var navLinks = qsa('.nav__link[data-nav]');
  var currentPage = (location.pathname.split('/').pop() || 'index.html');
  navLinks.forEach(function (a) {
    var linkPage = a.getAttribute('href').split('/').pop();
    a.classList.toggle('is-active', linkPage === currentPage);
  });

  var progressBar = qs('#progress-bar');
  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (progressBar) progressBar.style.transform = 'scaleX(' + Math.min(Math.max(scrolled, 0), 1) + ')';
  }, { passive: true });

  /* ------------------------------------------------------------------ *
   * Back to top
   * ------------------------------------------------------------------ */
  var toTop = qs('#to-top');
  window.addEventListener('scroll', function () {
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 480);
  }, { passive: true });
  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------ *
   * Language toggle buttons
   * ------------------------------------------------------------------ */
  qsa('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang')); });
  });

  /* ------------------------------------------------------------------ *
   * Site info: phone / whatsapp / email / address / hours / socials / map
   * ------------------------------------------------------------------ */
  function applySiteInfo() {
    qsa('[data-site-link="tel"]').forEach(function (el) { el.setAttribute('href', 'tel:' + SITE.phoneTel); });
    qsa('[data-site-link="mail"]').forEach(function (el) { el.setAttribute('href', 'mailto:' + SITE.email); });
    qsa('[data-site-text="phoneDisplay"]').forEach(function (el) { el.textContent = SITE.phoneDisplay; });
    qsa('[data-site-text="email"]').forEach(function (el) { el.textContent = SITE.email; });
    qsa('[data-site-text="address"]').forEach(function (el) { el.textContent = SITE.address; });
    qsa('[data-site-text="hours"]').forEach(function (el) { el.textContent = SITE.hours; });

    var waMsg = encodeURIComponent('Hi Universal Publicity, I want to enquire about ___.');
    qsa('[data-wa]').forEach(function (el) {
      el.setAttribute('href', 'https://wa.me/' + SITE.whatsapp + '?text=' + waMsg);
    });

    qsa('[data-social]').forEach(function (el) {
      var key = el.getAttribute('data-social');
      if (SITE.social[key]) el.setAttribute('href', SITE.social[key]);
    });

    var mapWrap = qs('#map');
    if (mapWrap && SITE.mapEmbed) {
      var iframe = document.createElement('iframe');
      iframe.src = SITE.mapEmbed;
      iframe.loading = 'lazy';
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      iframe.setAttribute('title', t('contact.map'));
      mapWrap.appendChild(iframe);
    }
  }

  function updateFooterYear() {
    var rightsEls = qsa('[data-i18n="footer.rights"]');
    var year = new Date().getFullYear();
    rightsEls.forEach(function (el) {
      el.textContent = t('footer.rights').replace('{year}', year);
    });
  }

  /* ------------------------------------------------------------------ *
   * Hero: collage images + stat count-up
   * ------------------------------------------------------------------ */
  function fillCollage() {
    qsa('[data-collage]').forEach(function (img) {
      var slug = img.getAttribute('data-collage');
      var item = PORTFOLIO.find(function (p) { return p.category === slug; });
      if (item) {
        img.src = USE_REAL_IMAGES ? item.image : item.placeholder;
        img.loading = 'lazy';
        img.alt = item.title;
        img.onerror = function () { img.src = item.placeholder; };
      }
    });
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    var start = 0;
    var duration = 1200;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initStatCounters() {
    var stats = qsa('.stat__value[data-count]');
    if (!stats.length || !('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          o.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    stats.forEach(function (s) { obs.observe(s); });
  }

  /* ------------------------------------------------------------------ *
   * Scroll reveal
   * ------------------------------------------------------------------ */
  function initReveal() {
    var els = qsa('.reveal, .steps');
    if (!els.length || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          o.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * Works: filters, masonry grid, lightbox
   * ------------------------------------------------------------------ */
  var worksFiltersEl = qs('#works-filters');
  var worksGridEl = qs('#works-grid');
  var worksMoreBtn = qs('#works-more');
  var urlCat = new URLSearchParams(location.search).get('cat');
  var activeFilter = (urlCat && CATEGORIES.some(function (c) { return c.slug === urlCat; })) ? urlCat : 'all';
  var visibleCount = 12;
  var PAGE_SIZE = 12;

  function categoryLabel(slug) {
    return slug === 'all' ? t('cat.all') : t('cat.' + slug);
  }

  function renderFilters() {
    if (!worksFiltersEl) return;
    var slugs = ['all'].concat(CATEGORIES.map(function (c) { return c.slug; }));
    worksFiltersEl.innerHTML = slugs.map(function (slug) {
      return '<button type="button" class="chip" data-filter="' + slug + '" aria-pressed="' + (slug === activeFilter) + '">' +
        categoryLabel(slug) + '</button>';
    }).join('');
    qsa('[data-filter]', worksFiltersEl).forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeFilter = btn.getAttribute('data-filter');
        visibleCount = PAGE_SIZE;
        qsa('[data-filter]', worksFiltersEl).forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        renderWorks();
      });
    });
  }

  var currentList = []; // items currently shown, for the lightbox

  function renderWorks() {
    if (!worksGridEl) return;
    var filtered = activeFilter === 'all'
      ? PORTFOLIO.slice()
      : PORTFOLIO.filter(function (p) { return p.category === activeFilter; });

    worksGridEl.classList.add('is-switching');

    setTimeout(function () {
      currentList = filtered.slice(0, visibleCount);
      worksGridEl.innerHTML = currentList.map(function (item, i) {
        var src = USE_REAL_IMAGES ? item.image : item.placeholder;
        return (
          '<li class="work" style="--i:' + (i % PAGE_SIZE) + '">' +
            '<button type="button" class="work__btn" data-index="' + i + '">' +
              '<img src="' + src + '" data-fallback="' + item.placeholder + '" alt="' + item.title + '" loading="lazy" width="' + item.w + '" height="' + item.h + '" style="aspect-ratio:' + item.w + '/' + item.h + '">' +
              '<span class="work__overlay">' +
                '<span class="work__cat">' + categoryLabel(item.category) + '</span>' +
                '<span class="work__title">' + item.title + '</span>' +
              '</span>' +
            '</button>' +
          '</li>'
        );
      }).join('');

      qsa('.work img', worksGridEl).forEach(function (img) {
        img.addEventListener('load', function () { img.closest('.work').classList.add('is-loaded'); });
        img.addEventListener('error', function () {
          img.src = img.getAttribute('data-fallback');
        });
      });
      qsa('.work__btn', worksGridEl).forEach(function (btn) {
        btn.addEventListener('click', function () {
          openLightbox(parseInt(btn.getAttribute('data-index'), 10));
        });
      });

      if (worksMoreBtn) worksMoreBtn.hidden = visibleCount >= filtered.length;

      worksGridEl.classList.remove('is-switching');
    }, 160);
  }

  /* Home page only: a small static preview grid (one item per category), links to works.html */
  var featuredEl = qs('#featured-works');
  function renderFeaturedWorks() {
    if (!featuredEl) return;
    var featured = CATEGORIES.map(function (cat) {
      return PORTFOLIO.find(function (p) { return p.category === cat.slug; });
    }).filter(Boolean).slice(0, 8);
    featuredEl.innerHTML = featured.map(function (item, i) {
      var src = USE_REAL_IMAGES ? item.image : item.placeholder;
      return (
        '<li class="work" style="--i:' + i + '">' +
          '<a class="work__btn" href="works.html">' +
            '<img src="' + src + '" data-fallback="' + item.placeholder + '" alt="' + item.title + '" loading="lazy" width="' + item.w + '" height="' + item.h + '" style="aspect-ratio:' + item.w + '/' + item.h + '">' +
            '<span class="work__overlay">' +
              '<span class="work__cat">' + categoryLabel(item.category) + '</span>' +
              '<span class="work__title">' + item.title + '</span>' +
            '</span>' +
          '</a>' +
        '</li>'
      );
    }).join('');
    qsa('.work img', featuredEl).forEach(function (img) {
      img.addEventListener('error', function () { img.src = img.getAttribute('data-fallback'); });
    });
  }

  if (worksMoreBtn) {
    worksMoreBtn.addEventListener('click', function () {
      visibleCount += PAGE_SIZE;
      renderWorks();
    });
  }

  // Service chips (in the Services section) jump to Works and apply the filter
  qsa('[data-filter-link]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      activeFilter = chip.getAttribute('data-filter-link');
      visibleCount = PAGE_SIZE;
      renderFilters();
      renderWorks();
      var works = document.getElementById('works');
      if (works) works.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* Lightbox */
  var lightbox = qs('#lightbox');
  var lbImg = qs('#lb-img');
  var lbTitle = qs('#lb-title');
  var lbMeta = qs('#lb-meta');
  var lbCount = qs('#lb-count');
  var lbIndex = 0;
  var lastFocused = null;

  function openLightbox(index) {
    if (!lightbox || !currentList.length) return;
    lbIndex = index;
    showLightboxItem();
    lastFocused = document.activeElement;
    lightbox.hidden = false;
    requestAnimationFrame(function () { lightbox.classList.add('is-open'); });
    document.body.classList.add('no-scroll');
    qs('#lb-close').focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(function () { lightbox.hidden = true; }, 200);
    if (lastFocused) lastFocused.focus();
  }
  function showLightboxItem() {
    var item = currentList[lbIndex];
    if (!item) return;
    lbImg.src = USE_REAL_IMAGES ? item.image : item.placeholder;
    lbImg.onerror = function () { lbImg.src = item.placeholder; };
    lbImg.alt = item.title;
    lbTitle.textContent = item.title;
    lbMeta.textContent = categoryLabel(item.category);
    lbCount.textContent = (lbIndex + 1) + ' / ' + currentList.length;
  }
  function lbPrev() { lbIndex = (lbIndex - 1 + currentList.length) % currentList.length; showLightboxItem(); }
  function lbNext() { lbIndex = (lbIndex + 1) % currentList.length; showLightboxItem(); }

  if (lightbox) {
    qs('#lb-close').addEventListener('click', closeLightbox);
    qs('#lb-prev').addEventListener('click', lbPrev);
    qs('#lb-next').addEventListener('click', lbNext);
    qs('.lightbox__backdrop', lightbox).addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbPrev();
      if (e.key === 'ArrowRight') lbNext();
      if (e.key === 'Tab') {
        // simple focus trap
        var focusables = qsa('button', lightbox);
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Touch swipe
    var touchStartX = null;
    lightbox.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (touchStartX == null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx > 0 ? lbPrev() : lbNext(); }
      touchStartX = null;
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * Clients marquee
   * ------------------------------------------------------------------ */
  function renderClientsMarquee() {
    var tracks = qsa('.marquee__track');
    if (!tracks.length) return;
    var half = Math.ceil(CLIENTS.length / 2);
    var groupsSource = [CLIENTS.slice(0, half), CLIENTS.slice(half)];

    tracks.forEach(function (track, i) {
      var list = groupsSource[i] || groupsSource[0];
      var htmlGroup = list.map(function (c, idx) {
        var content = c.image
          ? '<img src="' + c.image + '" alt="' + c.name + '" loading="lazy">'
          : c.name;
        return '<span class="wordmark wordmark--' + (idx % 4) + '">' + content + '</span>';
      }).join('');
      // Duplicate the group so the CSS animation (translateX(-50%)) loops seamlessly.
      track.innerHTML =
        '<span class="marquee__group">' + htmlGroup + '</span>' +
        '<span class="marquee__group" aria-hidden="true">' + htmlGroup + '</span>';
    });
  }

  /* ------------------------------------------------------------------ *
   * Testimonials carousel
   * ------------------------------------------------------------------ */
  var testiTrack = qs('#carousel .carousel__track');
  var testiDots = qs('#testi-dots');
  var testiIndex = 0;
  var testiTimer = null;

  function renderTestimonials() {
    if (!testiTrack) return;
    testiTrack.innerHTML = TESTIMONIALS.map(function (item) {
      return (
        '<div class="slide">' +
          '<p class="slide__quote">' + item.quote + '</p>' +
          '<p class="slide__author"><strong>' + item.name + '</strong><span>' + item.business + '</span></p>' +
        '</div>'
      );
    }).join('');
    if (testiDots) {
      testiDots.innerHTML = TESTIMONIALS.map(function (_, i) {
        return '<button type="button" class="carousel__dot" data-dot="' + i + '" aria-current="' + (i === 0) + '"></button>';
      }).join('');
      qsa('[data-dot]', testiDots).forEach(function (dot) {
        dot.addEventListener('click', function () {
          testiIndex = parseInt(dot.getAttribute('data-dot'), 10);
          updateTestimonial();
          restartTestiAutoplay();
        });
      });
    }
    testiIndex = 0;
    updateTestimonial();
  }

  function updateTestimonial() {
    if (!testiTrack) return;
    testiTrack.style.transform = 'translateX(-' + (testiIndex * 100) + '%)';
    qsa('[data-dot]', testiDots).forEach(function (dot, i) {
      dot.setAttribute('aria-current', String(i === testiIndex));
    });
  }
  function testiNext() { testiIndex = (testiIndex + 1) % TESTIMONIALS.length; updateTestimonial(); }
  function testiPrev() { testiIndex = (testiIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length; updateTestimonial(); }

  function startTestiAutoplay() {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || TESTIMONIALS.length < 2) return;
    testiTimer = setInterval(testiNext, 6000);
  }
  function stopTestiAutoplay() { if (testiTimer) clearInterval(testiTimer); }
  function restartTestiAutoplay() { stopTestiAutoplay(); startTestiAutoplay(); }

  var carousel = qs('#carousel');
  if (carousel) {
    qs('#testi-prev').addEventListener('click', function () { testiPrev(); restartTestiAutoplay(); });
    qs('#testi-next').addEventListener('click', function () { testiNext(); restartTestiAutoplay(); });
    carousel.addEventListener('mouseenter', stopTestiAutoplay);
    carousel.addEventListener('mouseleave', startTestiAutoplay);

    var tStartX = null;
    carousel.addEventListener('touchstart', function (e) { tStartX = e.changedTouches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (tStartX == null) return;
      var dx = e.changedTouches[0].clientX - tStartX;
      if (Math.abs(dx) > 40) { dx > 0 ? testiPrev() : testiNext(); restartTestiAutoplay(); }
      tStartX = null;
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * Quote form: validation, submit, WhatsApp fallback
   * ------------------------------------------------------------------ */
  var form = qs('#quote-form');
  if (form) {
    var submitBtn = qs('#form-submit', form);
    var statusEl = qs('#form-status', form);

    function setError(fieldId, msg) {
      var el = qs('#err-' + fieldId, form);
      if (el) el.textContent = msg || '';
      var input = qs('#f-' + fieldId, form);
      if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }

    function validate() {
      var ok = true;
      var name = qs('#f-name', form).value.trim();
      var phone = qs('#f-phone', form).value.replace(/\D/g, '');
      var email = qs('#f-email', form).value.trim();
      var file = qs('#f-file', form).files[0];

      if (!name) { setError('name', t('f.errName')); ok = false; } else { setError('name', ''); }

      if (!/^[6-9]\d{9}$/.test(phone)) { setError('phone', t('f.errPhone')); ok = false; } else { setError('phone', ''); }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email', t('f.errEmail')); ok = false; } else { setError('email', ''); }

      if (file && file.size > 5 * 1024 * 1024) { setError('file', t('f.errFile')); ok = false; } else { setError('file', ''); }

      return ok;
    }

    function showStatus(kind, msg) {
      statusEl.textContent = msg;
      statusEl.className = 'form__status ' + (kind === 'ok' ? 'is-success' : 'is-error');
    }

    function openWhatsAppFallback(data) {
      var lines = [
        'Hi Universal Publicity, I want to enquire about my project.',
        'Name: ' + data.name,
        'Phone: ' + data.phone,
        data.email ? 'Email: ' + data.email : null,
        data.service ? 'Service: ' + data.service : null,
        data.message ? 'Message: ' + data.message : null
      ].filter(Boolean);
      var url = 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: if filled, silently drop (likely a bot)
      var honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) return;

      if (!validate()) return;

      var data = {
        name: qs('#f-name', form).value.trim(),
        phone: '+91' + qs('#f-phone', form).value.replace(/\D/g, ''),
        email: qs('#f-email', form).value.trim(),
        service: qs('#f-service', form).value,
        message: qs('#f-message', form).value.trim()
      };

      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      showStatus('ok', '');
      statusEl.className = 'form__status';

      if (!FORM_ENDPOINT) {
        openWhatsAppFallback(data);
        showStatus('ok', t('f.successWa'));
        form.reset();
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
        return;
      }

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          showStatus('ok', t('f.success'));
          form.reset();
        })
        .catch(function () {
          showStatus('err', t('f.error'));
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
        });
    });
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    try {
      var saved = localStorage.getItem('up_lang');
      if (saved === 'gu' || saved === 'en') currentLang = saved;
    } catch (e) {}

    qsa('[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === currentLang ? 'true' : 'false');
    });

    applyI18n();
    applySiteInfo();
    fillCollage();
    renderFilters();
    renderWorks();
    renderFeaturedWorks();
    renderClientsMarquee();
    renderTestimonials();
    startTestiAutoplay();
    initStatCounters();
    initReveal();
    updateFooterYear();
  });
})();
