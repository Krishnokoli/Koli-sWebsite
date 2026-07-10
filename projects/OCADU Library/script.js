/* ============================================================
   OCAD U LIBRARY — interactions
   - scroll progress
   - reveal on enter
   - side rail active section
   - prototype: clone into devices + rebind interactions per instance
   ============================================================ */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll progress ---------- */
  const bar = document.querySelector('.progress-bar');
  const onScroll = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if (bar) bar.style.width = pct + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- transparent nav over hero, solid once scrolled ---------- */
  const topNav = document.querySelector('.top-nav');
  const heroEl = document.getElementById('hero');
  const onNavScroll = () => {
    if (!topNav) return;
    const threshold = heroEl ? heroEl.offsetHeight - 56 : 400;
    topNav.classList.toggle('is-scrolled', window.scrollY > threshold);
  };
  document.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  /* ---------- reveal on enter ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-inview');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-inview'));
  }

  /* ---------- side rail active section ---------- */
  const sections = [...document.querySelectorAll('section[id]')];
  const railLinks = [...document.querySelectorAll('.side-rail a')];
  const topNavLinks = [...document.querySelectorAll('.top-nav-links a')];
  const setActive = (id) => {
    railLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
    topNavLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
  };
  if (sections.length && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => io2.observe(s));
  }

  /* ---------- clone the prototype into the phone ---------- */
  const laptopLib = document.querySelector('[data-proto] .lib');
  const phoneTarget = document.querySelector('[data-proto-mobile]');
  if (laptopLib && phoneTarget) {
    const clone = laptopLib.cloneNode(true);
    // remove id collisions inside the clone if any
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    phoneTarget.appendChild(clone);
  }

  /* ---------- bind prototype interactions for ALL .lib instances ---------- */
  const tabPlaceholders = {
    everything: 'Search everything: books, articles, archives, course reserves…',
    catalogue:  'Search 480,000 books, journals & films…',
    articles:   'Search peer-reviewed articles across 320 databases…',
    archives:   'Search OCAD U special collections & student archives…',
    reserves:   'Search instructor-assigned course reserves…'
  };

  document.querySelectorAll('.lib').forEach(lib => {
    // search tabs
    const tabs = lib.querySelectorAll('.lib-search .tabs button');
    const input = lib.querySelector('.lib-search input');
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('is-active'));
        t.classList.add('is-active');
        if (input && tabPlaceholders[t.dataset.tab]) {
          input.placeholder = tabPlaceholders[t.dataset.tab];
          input.value = '';
          input.focus({ preventScroll: true });
        }
      });
    });

    // suggestion chips
    lib.querySelectorAll('.lib-search .suggestions button').forEach(b => {
      b.addEventListener('click', () => {
        if (input) {
          input.value = b.textContent.trim();
          input.focus({ preventScroll: true });
        }
      });
    });

    // nav links — switch views
    lib.querySelectorAll('.lib-nav .links a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        lib.querySelectorAll('.lib-nav .links a').forEach(x => x.classList.remove('is-active'));
        a.classList.add('is-active');
        const viewKey = a.dataset.view || 'search';
        lib.querySelectorAll('.lib-view').forEach(v => {
          v.classList.toggle('is-active', v.dataset.view === viewKey);
        });
      });
    });

    // FAQ accordion
    lib.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-a');
        const isOpen = item.classList.contains('is-open');
        lib.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('is-open');
          const a = i.querySelector('.faq-a');
          if (a) a.hidden = true;
        });
        if (!isOpen) {
          item.classList.add('is-open');
          if (answer) answer.hidden = false;
        }
      });
    });

    // submit
    const form = lib.querySelector('.lib-search .field');
    if (form) {
      const submit = form.querySelector('.submit');
      submit?.addEventListener('click', (e) => {
        e.preventDefault();
        const t = submit.textContent;
        submit.textContent = 'Searching…';
        setTimeout(() => { submit.textContent = t || 'Search'; }, 1100);
      });
      input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); submit?.click(); }
      });
    }
  });

  /* ---------- OCAD prototype: search button + mode pills ---------- */
  document.querySelectorAll('.lib .oc-search').forEach(box => {
    const input = box.querySelector('.oc-search-row input');
    const btn = box.querySelector('.oc-search-btn');
    const run = () => {
      if (!btn) return;
      const label = btn.textContent;
      btn.textContent = 'Searching\u2026';
      setTimeout(() => { btn.textContent = label || 'Search'; }, 1100);
    };
    btn?.addEventListener('click', (e) => { e.preventDefault(); run(); });
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); run(); }
    });

    /* mode pills */
    const defaultPh = input?.getAttribute('placeholder') || '';
    const placeholders = {
      advanced: 'Any field contains\u2026',
      journal: 'Search by journal title or ISSN\u2026',
      databases: 'Search for a database by title\u2026',
      guides: 'Enter search words \u2014 topic, subject, or guide title\u2026',
      reserves: 'Search by course code, instructor, or course title\u2026'
    };
    const pills = box.querySelectorAll('.oc-pill');
    const panels = box.querySelectorAll('.oc-mode-panel');
    const setMode = (mode) => {
      pills.forEach(p => {
        const on = p.dataset.mode === mode;
        p.classList.toggle('is-active', on);
        p.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      panels.forEach(p => p.classList.toggle('is-open', p.dataset.panel === mode));
      box.classList.toggle('is-expanded', !!mode);
      if (input) input.setAttribute('placeholder', mode ? placeholders[mode] : defaultPh);
    };
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        setMode(pill.classList.contains('is-active') ? null : pill.dataset.mode);
      });
    });

    /* advanced: add a new criteria line (max 5) */
    const advRows = box.querySelector('.oc-adv-rows');
    box.querySelector('.oc-adv-add')?.addEventListener('click', () => {
      if (!advRows || advRows.children.length >= 5) return;
      const row = advRows.children[0].cloneNode(true);
      row.querySelectorAll('select').forEach(s => { s.selectedIndex = 0; s.style.visibility = ''; });
      const term = row.querySelector('input');
      if (term) term.value = '';
      advRows.appendChild(row);
      term?.focus();
    });

    /* toggle chips, A\u2013Z letters, guide tabs */
    box.querySelectorAll('.oc-chipset button').forEach(c =>
      c.addEventListener('click', () => c.classList.toggle('is-on')));
    box.querySelectorAll('.oc-azstrip button').forEach(l =>
      l.addEventListener('click', () => {
        const on = l.classList.contains('is-on');
        l.closest('.oc-azstrip').querySelectorAll('button').forEach(x => x.classList.remove('is-on'));
        if (!on) l.classList.add('is-on');
      }));
    box.querySelectorAll('.oc-gtabs button').forEach(t =>
      t.addEventListener('click', () => {
        t.closest('.oc-gtabs').querySelectorAll('button').forEach(x => x.classList.remove('is-on'));
        t.classList.add('is-on');
      }));
    box.querySelector('.oc-clear')?.addEventListener('click', () => {
      const panel = box.querySelector('[data-panel="databases"]');
      panel?.querySelectorAll('select').forEach(s => { s.selectedIndex = 0; });
      panel?.querySelectorAll('.oc-azstrip button').forEach(x => x.classList.remove('is-on'));
    });
  });
  /* ---------- OCAD prototype: Ask — chat widget ---------- */
  document.querySelectorAll('.lib').forEach(lib => {
    const chat = lib.querySelector('.oc-chat');
    if (!chat) return;
    const msgs = chat.querySelector('.oc-chat-msgs');
    const form = chat.querySelector('.oc-chat-form');
    const field = form.querySelector('input');
    lib.querySelectorAll('.oc-ask').forEach(ask => {
      ask.addEventListener('click', (e) => {
        e.preventDefault();
        chat.hidden = false;
        field?.focus({ preventScroll: true });
      });
    });
    chat.querySelector('.oc-chat-close')?.addEventListener('click', () => { chat.hidden = true; });
    const replies = [
      'Thanks! A librarian will be right with you \u2014 meanwhile, the Research Guides pill above has curated sources by subject.',
      'Good question \u2014 have you tried Advanced Search? You can combine title, author, and subject fields.',
      'You can also email libraryhelp@ocadu.ca if you\u2019d rather not wait on chat.'
    ];
    let replyIdx = 0;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = field.value.trim();
      if (!text) return;
      const me = document.createElement('div');
      me.className = 'oc-msg oc-msg--me';
      me.textContent = text;
      msgs.appendChild(me);
      field.value = '';
      msgs.scrollTop = msgs.scrollHeight;
      setTimeout(() => {
        const bot = document.createElement('div');
        bot.className = 'oc-msg oc-msg--lib';
        bot.textContent = replies[replyIdx % replies.length];
        replyIdx += 1;
        msgs.appendChild(bot);
        msgs.scrollTop = msgs.scrollHeight;
      }, 900);
    });
  });

  /* ---------- OCAD prototype: explore accordion ---------- */
  document.querySelectorAll('.lib .oc-acc').forEach(acc => {
    acc.querySelectorAll('.oc-acc-head').forEach(head => {
      head.addEventListener('click', () => {
        const item = head.closest('.oc-acc-item');
        const open = item.classList.contains('is-open');
        acc.querySelectorAll('.oc-acc-item.is-open').forEach(x => {
          x.classList.remove('is-open');
          x.querySelector('.oc-acc-head')?.setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          item.classList.add('is-open');
          head.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });
  /* nested sub-accordions inside each section */
  document.querySelectorAll('.lib .oc-sacc').forEach(sacc => {
    const setX = (item, open) => {
      const x = item.querySelector('.oc-sacc-head .oc-acc-x');
      if (x) x.textContent = open ? '\u2212' : '+';
    };
    sacc.querySelectorAll('.oc-sacc-head').forEach(head => {
      head.addEventListener('click', () => {
        const item = head.closest('.oc-sacc-item');
        const open = item.classList.contains('is-open');
        sacc.querySelectorAll('.oc-sacc-item.is-open').forEach(x => {
          x.classList.remove('is-open');
          x.querySelector('.oc-sacc-head')?.setAttribute('aria-expanded', 'false');
          setX(x, false);
        });
        if (!open) {
          item.classList.add('is-open');
          head.setAttribute('aria-expanded', 'true');
          setX(item, true);
        }
      });
    });
  });

  /* ---------- strategy: book of principles ---------- */
  const pages = [...document.querySelectorAll('.book-page')];
  const tabs  = [...document.querySelectorAll('.book-tabs button')];
  const current = document.getElementById('p-current');
  const setPrinciple = (i) => {
    if (!pages.length) return;
    i = (i + pages.length) % pages.length;
    pages.forEach((p, idx) => p.classList.toggle('is-active', idx === i));
    tabs.forEach((b, idx) => {
      const on = idx === i;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (current) current.textContent = String(i + 1).padStart(2, '0');
  };
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => setPrinciple(i));
  });
  document.getElementById('p-prev')?.addEventListener('click', () => {
    const cur = pages.findIndex(p => p.classList.contains('is-active'));
    setPrinciple(cur - 1);
  });
  document.getElementById('p-next')?.addEventListener('click', () => {
    const cur = pages.findIndex(p => p.classList.contains('is-active'));
    setPrinciple(cur + 1);
  });

  // Auto-advance once when the section enters view
  const stratSection = document.getElementById('strategy');
  if (stratSection && pages.length && 'IntersectionObserver' in window && !reduceMotion) {
    let cycled = false;
    const ioS = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !cycled) {
          cycled = true;
          let i = 0, timer;
          const tick = () => {
            i++;
            if (i >= pages.length) return;
            setPrinciple(i);
            timer = setTimeout(tick, 2800);
          };
          timer = setTimeout(tick, 2400);
          const stop = () => { clearTimeout(timer); tabs.forEach(b => b.removeEventListener('click', stop)); };
          tabs.forEach(b => b.addEventListener('click', stop, { once: true }));
          ioS.unobserve(stratSection);
        }
      });
    }, { threshold: 0.3 });
    ioS.observe(stratSection);
  }

  if (!reduceMotion) {
    const noise = document.querySelector('.hero-noise');
    document.addEventListener('mousemove', (e) => {
      if (!noise) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      noise.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  /* ---------- problem: audit spread ---------- */
  const asItems  = [...document.querySelectorAll('.as-item')];
  const asPanels = [...document.querySelectorAll('.as-panel')];
  const asCount  = document.getElementById('as-count');
  if (asItems.length && asPanels.length) {
    let asTimer = null;
    const setAudit = (i) => {
      const n = (i + asItems.length) % asItems.length;
      asItems.forEach((el, j) => {
        el.classList.toggle('is-active', j === n);
        el.setAttribute('aria-selected', j === n ? 'true' : 'false');
      });
      asPanels.forEach((el, j) => el.classList.toggle('is-active', j === n));
      if (asCount) asCount.textContent = String(n + 1).padStart(2, '0') + ' / 06';
    };
    const stopAudit = () => { if (asTimer) { clearInterval(asTimer); asTimer = null; } };
    asItems.forEach((b, i) => {
      b.addEventListener('mouseenter', () => { stopAudit(); setAudit(i); });
      b.addEventListener('focus',      () => { stopAudit(); setAudit(i); });
      b.addEventListener('click',      () => { stopAudit(); setAudit(i); });
    });
    const spread = document.querySelector('.audit-spread');
    if (spread && 'IntersectionObserver' in window && !reduceMotion) {
      const ioA = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            if (!asTimer) {
              asTimer = setInterval(() => {
                const cur = asItems.findIndex(el => el.classList.contains('is-active'));
                setAudit(cur + 1);
              }, 3200);
            }
            ioA.unobserve(spread);
          }
        });
      }, { threshold: 0.35 });
      ioA.observe(spread);
      spread.addEventListener('pointerdown', stopAudit);
      spread.addEventListener('pointerenter', stopAudit);
    }
  }

  /* ---------- once devices section enters view, gently nudge each viewport so the user sees they're scrollable ---------- */
  const stage = document.querySelector('.devices-stage');
  const laptopView = document.getElementById('laptop-viewport');
  const phoneView  = document.getElementById('phone-viewport');
  const nudge = (el, distance, duration) => {
    if (!el || reduceMotion) return;
    const start = performance.now();
    const from = el.scrollTop;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      el.scrollTop = from + distance * easeOut(t);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (stage && 'IntersectionObserver' in window) {
    let done = false;
    const io3 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !done) {
          done = true;
          // small reveal scroll — shows that devices scroll independently
          setTimeout(() => nudge(laptopView, 90, 1200), 400);
          setTimeout(() => nudge(phoneView,  140, 1400), 700);
          io3.unobserve(stage);
        }
      });
    }, { threshold: 0.35 });
    io3.observe(stage);
  }
})();
