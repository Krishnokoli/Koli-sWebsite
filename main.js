/* =========================================================
   KOLI — interaction layer
   ========================================================= */
(function () {
  "use strict";
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = (x, a, b) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  const coarse = window.matchMedia("(pointer:coarse)").matches;

  const hero   = document.querySelector(".hero");
  const stage  = document.querySelector(".hero-stage");
  const nameEl = document.querySelector(".hero-name");
  const scrim  = document.querySelector(".hero-scrim");
  const hint   = document.querySelector(".hero-hint");

  /* hero hint: alternate between a playful nudge and the real instruction */
  const hintTxt = document.getElementById("hero-hint-txt");
  if (hintTxt) {
    const hintMsgs = [
      "move your cursor around",
      "press &amp; hold the art &middot; scroll to enter",
    ];
    let hintI = 0;
    setInterval(() => {
      hintTxt.classList.add("swapping");
      setTimeout(() => {
        hintI = (hintI + 1) % hintMsgs.length;
        hintTxt.innerHTML = hintMsgs[hintI];
        hintTxt.classList.remove("swapping");
      }, 450);
    }, 3200);
  }
  const topbar = document.querySelector(".topbar");
  const strips = Array.from(document.querySelectorAll(".pstrip"));
  const contact = document.querySelector(".contact");

  function onScroll() {
    const vh = window.innerHeight, vw = window.innerWidth;

    // ---- hero reveal ----
    const span = Math.max(1, hero.offsetHeight - vh);
    const p = clamp(window.scrollY / span, 0, 1);
    stage.style.setProperty("--art-blur", (p * 15).toFixed(2) + "px");
    stage.style.setProperty("--art-scale", (1 + p * 0.09).toFixed(3));
    const nop = smooth(p, 0.16, 0.6);
    nameEl.style.setProperty("--name-op", nop.toFixed(3));
    nameEl.style.setProperty("--name-y", ((1 - nop) * 34).toFixed(2) + "px");
    scrim.style.setProperty("--scrim-op", (nop * 0.92).toFixed(3));
    hint.style.setProperty("--hint-op", (1 - smooth(p, 0.02, 0.18)).toFixed(3));

    topbar.classList.toggle("show", window.scrollY > vh * 0.85);

    if (!reduce) {
      // ---- horizontal parallax lines ----
      strips.forEach((s) => {
        const track = s.querySelector(".track");
        const speed = parseFloat(s.dataset.speed || "0.1");
        const r = s.getBoundingClientRect();
        const prog = (vh - r.top) / (vh + r.height);      // 0 enter -> 1 leave
        const base = -0.16 * vw;
        const delta = (prog - 0.5) * vw * speed * 3;
        track.style.transform = "translateX(" + (base + delta).toFixed(1) + "px)";
      });
    }
  }
  window.addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- FIGMA multiplayer cursors (whole page) ---------- */
  const cursors = document.querySelector(".cursors");
  if (cursors && !coarse) {
    const you  = cursors.querySelector(".fcursor.you");
    const koli = cursors.querySelector(".fcursor.koli");
    const darkSecs = Array.from(document.querySelectorAll(".hero, .hscroll"));
    const TIPX = 3, TIPY = 2;                 // arrow-tip offset -> aligns hotspot to mouse
    let mx = innerWidth / 2, my = innerHeight / 2;   // real pointer
    let kx = innerWidth * 0.5, ky = innerHeight * 0.42;   // Koli's eased position (autonomous)
    let shown = false, t = 0;

    const show = () => {
      if (!shown) {
        shown = true;
        document.documentElement.classList.add("figcursor");
      }
      cursors.classList.add("on");
    };

    window.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      mx = e.clientX; my = e.clientY; show();
    }, { passive: true });
    window.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") return;
      show();
    });
    document.addEventListener("mouseleave", () => cursors.classList.remove("on"));
    document.addEventListener("mouseenter", () => { if (shown) cursors.classList.add("on"); });

    /* ---- Koli moves like a real person on a Figma canvas ----
       Purposeful eased hops from point to point (quick to leave, soft to
       land), short dwells where it idles with a hair of jitter and the odd
       click, and now and then it slips off the edge of the screen entirely
       and wanders back in from a random side a moment later. */
    const rand  = (a, b) => a + Math.random() * (b - a);
    const ease  = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const now   = () => performance.now();

    const pickInside = () => {
      const m = 80;
      return [rand(m, innerWidth - m), rand(m, innerHeight - m)];
    };
    const pickNudge = () => {              // a small adjustment near current spot
      const m = 60, r = rand(40, 160), a = rand(0, Math.PI * 2);
      return [clamp(kx + Math.cos(a) * r, m, innerWidth - m),
              clamp(ky + Math.sin(a) * r, m, innerHeight - m)];
    };
    const pickOff = () => {                // a point safely beyond an edge
      const pad = 140, e = Math.floor(rand(0, 4));
      if (e === 0) return [rand(-pad, innerWidth + pad), -pad];
      if (e === 1) return [innerWidth + pad, rand(-pad, innerHeight + pad)];
      if (e === 2) return [rand(-pad, innerWidth + pad), innerHeight + pad];
      return [-pad, rand(-pad, innerHeight + pad)];
    };

    let sx = kx, sy = ky, ex = kx, ey = ky;       // move start / end
    let moveStart = now(), moveDur = 600;
    let state = "dwell", stateUntil = now() + 500;
    let targetOff = false, pressUntil = 0;

    const startMove = (tx, ty, off) => {
      sx = kx; sy = ky; ex = tx; ey = ty; targetOff = off;
      const dist = Math.hypot(ex - sx, ey - sy);
      // Fitts-ish: longer hops take longer, but speed isn't linear
      moveDur = clamp(200 + dist * 0.62, 260, 1150) * rand(0.85, 1.18);
      moveStart = now();
      state = "move";
    };

    (function tick() {
      const tn = now();

      if (state === "move") {
        const p = clamp((tn - moveStart) / moveDur, 0, 1);
        const e = ease(p);
        kx = sx + (ex - sx) * e;
        ky = sy + (ey - sy) * e;
        if (p >= 1) {
          kx = ex; ky = ey;
          if (targetOff) {
            state = "offscreen";
            stateUntil = tn + rand(7000, 18000);   // stay gone a good while
          } else {
            state = "dwell";
            stateUntil = tn + rand(650, 2400);
            if (Math.random() < 0.4) pressUntil = tn + rand(170, 340);  // a click
          }
        }
      } else if (state === "dwell") {
        if (tn >= stateUntil) {
          const roll = Math.random();
          if (roll < 0.32) startMove(...pickOff(), true);       // sometimes: duck back out
          else if (roll < 0.62) startMove(...pickNudge(), false); // small nudge
          else startMove(...pickInside(), false);              // keep working on-screen
        }
      } else if (state === "offscreen") {
        if (tn >= stateUntil) {
          [kx, ky] = pickOff();          // re-enter from a (possibly new) edge
          startMove(...pickInside(), false);
        }
      }

      // a touch of idle life while parked, plus the click squash
      let rx = kx, ry = ky;
      if (state === "dwell") {
        rx += Math.sin(tn * 0.012) * 1.1;
        ry += Math.cos(tn * 0.0094) * 1.0;
      }
      koli.classList.toggle("fc-press", tn < pressUntil);

      you.style.transform  = "translate(" + (mx - TIPX) + "px," + (my - TIPY) + "px)";
      koli.style.transform = "translate(" + (rx - TIPX) + "px," + (ry - TIPY) + "px)";
      // white halo when the K rides over a dark section (hero / timeline)
      let onDark = false;
      for (const sec of darkSecs) {
        const r = sec.getBoundingClientRect();
        if (rx >= r.left && rx <= r.right && ry >= r.top && ry <= r.bottom) { onDark = true; break; }
      }
      koli.classList.toggle("on-dark", onDark);
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- PLAY floating tiles · parallax + scroll-driven tilt ---------- */
  if (!reduce) {
    const tiles = Array.from(document.querySelectorAll(".pfloat"));
    if (tiles.length) {
      const onTiles = () => {
        const vh = window.innerHeight;
        for (const el of tiles) {
          const speed = parseFloat(el.dataset.speed || "0");
          const rot = parseFloat(el.dataset.rot || "0");
          const tilt = parseFloat(el.dataset.tilt || "0");
          // offset geometry is unaffected by our own transform → no feedback loop
          const center = el.offsetTop + el.offsetHeight / 2 - window.scrollY;
          const fromMid = center - vh / 2;
          const prog = clamp(fromMid / vh, -1, 1);
          // stronger parallax: cards lag the scroll so they drift past at a slower pace.
          // bound the drift so cards stay inside the Play section. The downward bound
          // is kept tighter than the upward one so the bottom row never spills onto
          // the closing rule below the cluster.
          const py = clamp(-fromMid * speed * 1.6, -55, 60).toFixed(1);
          const deg = (rot + prog * tilt).toFixed(2);
          el.style.transform = "translateY(" + py + "px) rotate(" + deg + "deg)";
        }
      };
      window.addEventListener("scroll", () => requestAnimationFrame(onTiles), { passive: true });
      window.addEventListener("resize", onTiles);
      onTiles();
    }
  }

  /* ---------- PATH · horizontal scroll timeline (pinned) ---------- */
  {
    const sec = document.querySelector(".hscroll");
    const track = document.getElementById("hscroll-track");
    const fill = document.getElementById("hs-progress");
    const idxEl = document.getElementById("hs-idx");
    if (sec && track) {
      const stops = Array.from(track.querySelectorAll(".hs-stop"));
      let maxX = 0;
      const measure = () => { maxX = Math.max(0, track.scrollWidth - window.innerWidth); };
      const onHS = () => {
        const vh = window.innerHeight, vw = window.innerWidth;
        const total = Math.max(1, sec.offsetHeight - vh);
        const scrolled = clamp(-sec.getBoundingClientRect().top, 0, total);
        const p = scrolled / total;
        track.style.transform = "translate3d(" + (-p * maxX).toFixed(1) + "px,0,0)";
        if (fill) fill.style.transform = "scaleY(" + p.toFixed(3) + ")";
        // active = stop whose centre is nearest the viewport centre
        const cx = vw / 2;
        let best = 0, bestD = Infinity;
        stops.forEach((s, i) => {
          const r = s.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - cx);
          if (d < bestD) { bestD = d; best = i; }
        });
        stops.forEach((s, i) => s.classList.toggle("is-active", i === best));
        if (idxEl) idxEl.textContent = String(best + 1).padStart(2, "0");
      };
      const onResize = () => { measure(); onHS(); };
      measure();
      window.addEventListener("scroll", () => requestAnimationFrame(onHS), { passive: true });
      window.addEventListener("resize", onResize);
      window.addEventListener("load", onResize);
      onHS();
    }
  }

  /* ---------- Contact form -> mailto ---------- */
  const form = document.querySelector("#tea-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const to = form.dataset.email || "hello@koli.design";
      const from = (form.querySelector("[name=from]").value || "").trim();
      const subject = encodeURIComponent("Tea? A note via your portfolio");
      const body = encodeURIComponent((from ? "From: " + from + "\n\n" : "") + "Hi Koli,\n\n");
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
    });
  }

  /* ---------- Letter (envelope) -> mailto ---------- */
  const letter = document.querySelector("#letter-form");
  if (letter) {
    letter.addEventListener("submit", (e) => {
      e.preventDefault();
      const to = letter.dataset.email || "hello@koli.design";
      const from = (letter.querySelector("[name=from]").value || "").trim();
      const msg = (letter.querySelector("[name=msg]").value || "").trim();
      const subject = encodeURIComponent("A letter via koli.design");
      const body = encodeURIComponent((msg ? msg + "\n\n" : "Hi Koli,\n\n") + (from ? "— " + from : ""));
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
    });
  }
})();
