// Koli — hero generative layer
// Passes HTMLImageElement directly to p5 image() — works on file:// AND
// as a self-contained standalone (data URI srcs). No loadImage / XHR needed.

let greyImg   = null;   // p5.Image
let colourImg = null;   // p5.Image
let colourAmt    = 0;
let targetColour = 0;

const SK_W = 1366;
const SK_H = 768;

// --- Gaze control -----------------------------------------------------------
// Desktop follows the cursor (unchanged). Touch devices have no hover, so the
// eyes are driven by device tilt (gyroscope). If motion is unsupported or the
// iOS permission is denied, they gently wander on their own. While a finger is
// down, the touch position takes over.
let gazeX, gazeY;          // smoothed gaze, in sketch space
let targetX, targetY;      // desired gaze, in sketch space
let isTouch     = false;   // touch / coarse-pointer device
let motionOn    = false;   // deviceorientation is delivering data
let motionAsked = false;   // permission/listener already requested
let lastOrient  = 0;       // millis() of last orientation event
let touching    = false;   // finger currently down
let baseGamma = null, baseBeta = null; // neutral tilt captured on first reading
const RANGE    = 16;       // degrees of tilt from neutral to reach the eye edge
const DEADZONE = 2.5;      // degrees; below this the phone counts as "still"
let tiltGate = null;       // iOS "Enable tilt" intro overlay (iOS needs an explicit gesture)
let introEl  = null;       // desktop intro overlay (auto-dismisses)
let loaderEl = null;       // "loading the artwork" overlay
let loaderTimer = null;    // delays the loader so fast/cached loads never flash it

// The hero art is a few MB, so on a slow connection p5 sits in preload() with a
// black screen. Show a loader if that wait is long enough to notice. setup()
// only runs once the images are decoded, so that is where it gets torn down.
function showLoader() {
  const st = document.createElement("style");
  st.textContent = "@keyframes koliPulse{0%,100%{opacity:.25;transform:scale(.8)}"
    + "50%{opacity:1;transform:scale(1.15)}}";
  document.head.appendChild(st);

  loaderEl = document.createElement("div");
  loaderEl.style.cssText =
    "position:fixed;inset:0;z-index:2147483645;display:flex;align-items:center;justify-content:center;"
    + "background:#0a0a0a;transition:opacity .5s ease;";
  loaderEl.innerHTML =
    '<div style="display:flex;align-items:center;gap:11px;">'
    + '<span style="width:7px;height:7px;border-radius:50%;background:#E85F2A;'
      + 'animation:koliPulse 1.4s ease-in-out infinite;"></span>'
    + '<span style="font-family:\'Space Grotesk\',system-ui,sans-serif;font-size:.7rem;'
      + 'letter-spacing:.3em;text-transform:uppercase;color:rgba(242,240,236,.6);">'
      + 'Loading the artwork</span>'
    + '</div>';
  document.body.appendChild(loaderEl);
}

function hideLoader() {
  clearTimeout(loaderTimer);
  if (!loaderEl) return;
  const el = loaderEl;
  loaderEl = null;
  el.style.opacity = "0";
  setTimeout(() => el.remove(), 550);
}

// Only surface the loader if the art is actually slow to arrive.
loaderTimer = setTimeout(showLoader, 250);

// p5 preload runs after the DOM is ready, so the <img> tags exist.
function preload() {
  const gEl = document.getElementById("hero-grey");
  const cEl = document.getElementById("hero-colour");
  if (gEl && gEl.src) greyImg   = loadImage(gEl.src);
  if (cEl && cEl.src) colourImg = loadImage(cEl.src);
}

function onOrient(e) {
  if (e == null || (e.gamma == null && e.beta == null)) return;
  motionOn   = true;
  lastOrient = millis();
  const g = e.gamma || 0;   // left/right tilt (roll)
  const b = e.beta  || 0;   // front/back tilt (pitch)
  // Calibrate to however the phone is being held on the first reading, so
  // "not tilted" always means eyes centred regardless of the resting angle.
  if (baseGamma === null) { baseGamma = g; baseBeta = b; }
  let dg = g - baseGamma;
  let db = b - baseBeta;
  // Deadzone: ignore tiny sensor noise so the eyes are still when the phone is.
  if (Math.abs(dg) < DEADZONE) dg = 0;
  if (Math.abs(db) < DEADZONE) db = 0;
  // Map tilt-from-neutral onto the artwork; ~RANGE° reaches the eye edge.
  targetX = map(constrain(dg, -RANGE, RANGE), -RANGE, RANGE, 0, SK_W);
  targetY = map(constrain(db, -RANGE, RANGE), -RANGE, RANGE, 0, SK_H);
}

function attachOrientation() {
  window.addEventListener("deviceorientation", onOrient, true);
}

function closeTiltGate() {
  if (tiltGate) { tiltGate.remove(); tiltGate = null; }
  document.body.style.overflow = "";
}

// Desktop needs no permission, so it just gets a brief nudge over the blurred
// artwork. No buttons: it fades itself out after a few seconds, or as soon as
// the visitor starts scrolling.
function showDesktopIntro() {
  const BODY = "font-family:'Space Grotesk',system-ui,sans-serif;";

  introEl = document.createElement("div");
  introEl.style.cssText =
    "position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;" +
    "padding:26px;background:rgba(10,10,10,.5);" +
    "backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);" +
    "opacity:0;transition:opacity .55s ease;pointer-events:none;";
  introEl.innerHTML =
    '<div style="width:min(440px,90vw);text-align:center;">'
    + '<h2 style="font-family:\'Syne\',system-ui,sans-serif;font-weight:700;font-size:1.6rem;'
      + 'color:#F2F0EC;margin:0 0 12px;letter-spacing:-.01em;">They’re watching you 👀</h2>'
    + '<p style="' + BODY + 'font-weight:400;font-size:.98rem;line-height:1.6;'
      + 'color:#F2F0EC;margin:0;">Move your cursor around and the eyes will follow you. '
      + 'Play with it, enjoy the artwork, then scroll on 🎨✨</p>'
    + '</div>';
  document.body.appendChild(introEl);
  requestAnimationFrame(() => { if (introEl) introEl.style.opacity = "1"; });

  const hide = () => {
    if (!introEl) return;
    const el = introEl;
    introEl = null;
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 700);
    window.removeEventListener("wheel", hide);
    window.removeEventListener("scroll", hide);
  };
  setTimeout(hide, 5000);
  window.addEventListener("wheel", hide, { passive: true });
  window.addEventListener("scroll", hide, { passive: true });
}

// iOS will only surface its permission dialog from a real user gesture, so give
// people an explicit thing to tap. Presented as a centred overlay that blurs the
// hero behind it, so tilting happens before they scroll on.
function showTiltGate() {
  const BODY = "font-family:'Space Grotesk',system-ui,sans-serif;";

  tiltGate = document.createElement("div");
  tiltGate.id = "tilt-gate";
  tiltGate.style.cssText =
    "position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;" +
    "padding:26px;background:rgba(10,10,10,.55);" +
    "backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);";

  tiltGate.innerHTML =
    '<div id="tg-card" style="width:min(360px,90vw);text-align:center;">'
    + '<h2 style="font-family:\'Syne\',system-ui,sans-serif;font-weight:700;font-size:1.5rem;'
      + 'color:#F2F0EC;margin:0 0 12px;letter-spacing:-.01em;">They’re watching you 👀</h2>'
    + '<p style="' + BODY + 'font-weight:400;font-size:.95rem;line-height:1.6;'
      + 'color:#F2F0EC;margin:0 0 14px;">Give your phone a little tilt and the eyes will follow you '
      + 'around. Play with it, enjoy the artwork, then scroll on 🎨✨</p>'
    + '<p style="' + BODY + 'font-weight:300;font-size:.82rem;line-height:1.6;'
      + 'color:rgba(242,240,236,.6);margin:0 0 26px;">This only reads your phone’s motion sensor. '
      + 'It does not affect your privacy, and nothing is collected, stored, or shared.</p>'
    + '<button id="tg-btn" style="appearance:none;border:none;cursor:pointer;width:100%;'
      + 'background:#E85F2A;color:#fff;' + BODY + 'font-weight:500;font-size:.74rem;'
      + 'letter-spacing:.14em;text-transform:uppercase;padding:1em 1.6em;border-radius:999px;'
      + 'box-shadow:0 14px 34px -12px rgba(232,95,42,.7);">Enable tilt</button>'
    + '<button id="tg-skip" style="appearance:none;border:none;background:transparent;cursor:pointer;'
      + 'margin-top:16px;' + BODY + 'font-weight:400;font-size:.7rem;letter-spacing:.1em;'
      + 'text-transform:uppercase;color:rgba(242,240,236,.5);">Maybe later</button>'
    + '</div>';

  document.body.appendChild(tiltGate);
  document.body.style.overflow = "hidden"; // encourage tilting before scrolling on

  tiltGate.querySelector("#tg-btn").addEventListener("click", (ev) => {
    ev.stopPropagation();
    enableMotion();
  });
  const skip = tiltGate.querySelector("#tg-skip");
  // Stop pointerdown too, or the window-level listener would fire the iOS
  // permission request even though they chose to skip.
  skip.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  skip.addEventListener("click", (ev) => {
    ev.stopPropagation();
    closeTiltGate();
  });
}

function setTiltState(state) {
  if (!tiltGate) return;
  if (state === "granted") {
    closeTiltGate();
  } else if (state === "denied") {
    // iOS won't re-prompt once denied (or if the OS switch is off) — explain how to fix.
    const card = tiltGate.querySelector("#tg-card");
    card.innerHTML =
      '<h2 style="font-family:\'Syne\',system-ui,sans-serif;font-weight:700;font-size:1.35rem;'
        + 'color:#F2F0EC;margin:0 0 12px;">Motion access is blocked</h2>'
      + '<p style="font-family:\'Space Grotesk\',system-ui,sans-serif;font-weight:300;font-size:.9rem;'
        + 'line-height:1.6;color:rgba(242,240,236,.72);margin:0 0 22px;">Turn on '
        + '<b style="color:#F2F0EC;font-weight:500;">Settings → Safari → Motion &amp; '
        + 'Orientation Access</b>, then reload this page.</p>'
      + '<button id="tg-skip2" style="appearance:none;border:none;cursor:pointer;width:100%;'
        + 'background:#E85F2A;color:#fff;font-family:\'Space Grotesk\',system-ui,sans-serif;'
        + 'font-weight:500;font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;'
        + 'padding:1em 1.6em;border-radius:999px;">Continue to site</button>';
    card.querySelector("#tg-skip2").addEventListener("click", closeTiltGate);
  }
}

// iOS 13+ requires a user gesture to request motion permission. Android and
// other platforms don't prompt — their listener is attached immediately in
// setup(), so this only needs to handle the iOS permission request on a tap.
function enableMotion() {
  if (motionAsked) return;
  const DOE = window.DeviceOrientationEvent;
  if (DOE && typeof DOE.requestPermission === "function") {
    motionAsked = true;
    DOE.requestPermission()
      .then((s) => {
        if (s === "granted") attachOrientation();
        setTiltState(s);
      })
      .catch(() => {
        // Let them try again rather than dead-ending on a transient failure.
        motionAsked = false;
      });
  }
}

function setup() {
  const holder = document.getElementById("hero-canvas");
  const cnv    = createCanvas(SK_W, SK_H);
  cnv.parent(holder);
  cnv.elt.classList.add("sketch-canvas");
  frameRate(30);

  isTouch = (window.matchMedia && matchMedia("(hover: none) and (pointer: coarse)").matches)
            || ("ontouchstart" in window);

  gazeX = targetX = SK_W / 2;
  gazeY = targetY = SK_H / 2;

  hideLoader();   // images are decoded by the time setup() runs

  if (isTouch) {
    // On Android / anything without a permission prompt, attach the orientation
    // listener right away so tilt works with no tap. On iOS we must wait for a
    // user gesture, so show the tappable intro gate instead.
    const DOE = window.DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission === "function") {
      showTiltGate();
    } else if (DOE) {
      attachOrientation();
    }
  } else {
    showDesktopIntro();   // no permission needed, so just a brief nudge
  }

  // Listen on the window, not the canvas: the .hero-scrim / .hero-name overlays
  // sit on top of the canvas and would otherwise swallow the tap that both
  // reveals the colour AND requests iOS motion permission. Multiple gesture
  // types are covered so the iOS prompt reliably fires on first interaction.
  window.addEventListener("pointerdown",   () => { targetColour = 1; touching = true; enableMotion(); });
  window.addEventListener("pointerup",     () => { targetColour = 0; touching = false; });
  window.addEventListener("pointercancel", () => { targetColour = 0; touching = false; });
  window.addEventListener("touchend", enableMotion, { passive: true });
  window.addEventListener("click", enableMotion);
}

function updateGaze() {
  if (!isTouch) {
    // Desktop: follow the cursor directly, exactly as before.
    gazeX = mouseX;
    gazeY = mouseY;
    return;
  }
  const now = millis();
  if (!(motionOn && now - lastOrient < 2000)) {
    // No tilt data → rest at centre. The eyes only move when the phone tilts;
    // they hold still when it's still (no ambient wandering).
    targetX = SK_W / 2;
    targetY = SK_H / 2;
  }
  // Ease toward the target so the movement is smooth but responsive.
  gazeX += (targetX - gazeX) * 0.85;
  gazeY += (targetY - gazeY) * 0.85;
}

function draw() {
  background(10);
  colourAmt += (targetColour - colourAmt) * 0.12;

  if (greyImg && greyImg.width) {
    image(greyImg, 0, 0, SK_W, SK_H);
  }
  if (colourImg && colourImg.width && colourAmt > 0.01) {
    push();
    tint(255, 255 * colourAmt);
    image(colourImg, 0, 0, SK_W, SK_H);
    pop();
  }

  updateGaze();

  noStroke();
  fill(0);

  // Pupil travel amplification. 1 = the artwork's calibrated range, which keeps
  // every pupil inside its eye. Raise cautiously — too high and they escape.
  const AMP = 1;
  const gx = (a, b) => { const m = (a + b) / 2, h = (b - a) / 2 * AMP; return map(gazeX, 0, SK_W, m - h, m + h, true); };
  const gy = (a, b) => { const m = (a + b) / 2, h = (b - a) / 2 * AMP; return map(gazeY, 0, SK_H, m - h, m + h, true); };
  const e = (x1, x2, y1, y2, d) => { ellipse(gx(x1, x2), gy(y1, y2), d); };

  // COLUMN 1
  e(200, 223, 100, 110, 34);
  e(60,  83,  292, 302, 34);
  e(225, 240, 233, 253, 25);
  e(70,  97,  465, 476, 34);
  e(224, 240, 421, 429, 25);
  e(39,  50,  616, 630, 17);
  e(50,  80,  720, 730, 25);
  e(200, 222, 692, 720, 34);

  // COLUMN 2
  e(340, 347, 72,  75,  25);
  ellipse(gx(364,384), gy(425,445), 34);
  ellipse(gx(500,520), gy(435,445), 25);
  e(500, 520, 55,  62,  29);
  e(660, 677, 50,  65,  17);
  ellipse(gx(510,540), gy(149,153), 24);
  ellipse(gx(650,680), gy(149,153), 24);
  ellipse(gx(495,510), gy(287,291), 17);
  ellipse(gx(570,595), gy(287,291), 17);
  e(670, 690, 282, 292, 34);
  e(640, 670, 409, 417, 24);
  ellipse(gx(610,626), gy(515,520), 17);
  ellipse(gx(685,704), gy(515,520), 17);
  ellipse(gx(339,358), gy(605,613), 17);
  ellipse(gx(420,435), gy(610,620), 17);
  e(510, 515, 614, 625, 27);
  e(640, 670, 604, 608, 27);
  ellipse(gx(503,513), gy(724,733), 17);
  ellipse(gx(568,580), gy(724,733), 17);
  e(680, 690, 718, 730, 34);

  // COLUMN 3
  ellipse(gx(760,772),  gy(52,60),   10);
  ellipse(gx(830,870),  gy(45,57),   17);
  e(940,  955,  44,  50,  24);
  e(960,  985,  200, 220, 34);
  e(785,  835,  445, 465, 27);
  e(972,  988,  582, 599, 17);
  e(800,  830,  612, 625, 24);
  ellipse(gx(788,830),  gy(714,725), 17);
  ellipse(gx(930,970),  gy(714,725), 17);
  ellipse(gx(1090,1110),gy(56,66),   17);
  ellipse(gx(1170,1190),gy(56,66),   17);
  e(1145, 1180, 168, 172, 24);
  e(1193, 1223, 285, 295, 24);
  e(1126, 1152, 479, 503, 34);
  e(1305, 1319, 80,  85,  17);
  e(1318, 1329, 302, 313, 24);
  e(1286, 1322, 425, 448, 17);
  ellipse(gx(1238,1251),gy(617,624), 17);
  ellipse(gx(1312,1327),gy(617,624), 17);
  e(1235, 1250, 706, 720, 17);
  e(1318, 1328, 720, 726, 24);
}
