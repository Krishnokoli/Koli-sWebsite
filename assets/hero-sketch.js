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
let ambientT    = 0;       // phase for the idle wander

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
  // gamma = left/right tilt (roll), beta = front/back tilt (pitch).
  // Narrow input ranges = high sensitivity: a small tilt sweeps the eyes
  // across the whole artwork.
  const g = constrain(e.gamma || 0, -14, 14);  // ~14° roll reaches the edge
  const b = constrain(e.beta  || 45, 32, 58);  // ~45 held upright = centre
  targetX = map(g, -14, 14, 0, SK_W);
  targetY = map(b, 32, 58, 0, SK_H);
}

// iOS 13+ requires a user gesture to request motion permission; other
// platforms just need the listener attached.
function enableMotion() {
  if (motionAsked || !isTouch) return;
  motionAsked = true;
  const DOE = window.DeviceOrientationEvent;
  const add = () => window.addEventListener("deviceorientation", onOrient, true);
  if (DOE && typeof DOE.requestPermission === "function") {
    DOE.requestPermission().then((s) => { if (s === "granted") add(); }).catch(() => {});
  } else if (DOE) {
    add();
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

  cnv.elt.addEventListener("pointerdown",  () => { targetColour = 1; touching = true; enableMotion(); });
  window.addEventListener("pointerup",     () => { targetColour = 0; touching = false; });
  window.addEventListener("pointercancel", () => { targetColour = 0; touching = false; });
}

function updateGaze() {
  if (!isTouch) {
    // Desktop: follow the cursor directly, exactly as before.
    gazeX = mouseX;
    gazeY = mouseY;
    return;
  }
  const now = millis();
  if (motionOn && now - lastOrient < 2000) {
    // targetX / targetY already set by onOrient() from device tilt.
  } else if (touching) {
    targetX = mouseX;
    targetY = mouseY;
  } else {
    // Ambient wander — eyes stay alive with no input / no motion permission.
    ambientT += 0.012;
    targetX = SK_W * (0.5 + 0.30 * Math.sin(ambientT));
    targetY = SK_H * (0.5 + 0.24 * Math.sin(ambientT * 1.6 + 1.1));
  }
  // Ease toward the target — near-instant so the eyes react immediately to tilt.
  gazeX += (targetX - gazeX) * 0.95;
  gazeY += (targetY - gazeY) * 0.95;
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

  // Exaggerate pupil travel around each eye's centre so the movement reads
  // clearly (especially on the big eyes). Higher AMP = more dramatic.
  const AMP = 2.2;
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
