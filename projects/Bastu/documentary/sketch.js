let sceneNum = 1;   // start at the entrance — no title screen

let entrance1;
let entrance2;
let entrance3;
let balcony;
let tobecontinued;

let washing;
let water;
let kitchen
let television;
let radio;
let music;
let traffic;
let meow;
let milk;
let bird;
let children;
let pencil;
let giggle;

let started = false;
let titleReady = false;
let videosReady = false;


function preload() {
  // Intentionally empty. Sounds are loaded in setup() (below) so that a slow
  // or stalled audio fetch can never block the sketch from starting — the
  // house should always paint, with or without sound ready yet.
}

function loadSounds() {
  // loadSound() called OUTSIDE preload() loads asynchronously and does not
  // gate first paint. Sound isn't needed until the first click anyway.
  water = loadSound("water.mp3");
  washing = loadSound("washing.mp3");
  kitchen = loadSound("kitchen.mp3");
  radio = loadSound("Indian Classical.mp3");
  television = loadSound("Television.mp3");
  meow = loadSound("Meow.mp3");
  traffic = loadSound("Traffic.mp3");
  music = loadSound("Shehnai.mp3");
  milk = loadSound("Milk.mp3");
  bird = loadSound("bird.mp3");
  children = loadSound("children.mp3");
  pencil = loadSound("Pencil.mp3");
  giggle = loadSound("Giggle.mp3");
}

// The preview/serving environment here cannot decode MP4 (media error 4,
// SRC_NOT_SUPPORTED), so the rooms are animated GIFs — p5 plays them natively
// via loadImage(). GIFs are already inter-frame optimized, so re-encoding only
// makes them larger; these are the smallest reliable form for this runtime.
// We load the entrance first so the opening frame appears quickly, then load
// the remaining rooms in the background. draw() guards the brief gap.
function loadRooms() {
  entrance1 = loadImage('entrance 1.gif', () => {
    titleReady = true;
    // background-load the rest once the entrance is in
    entrance2 = loadImage('entrance 2.gif');
    entrance3 = loadImage('entrance 3.gif');
    balcony   = loadImage('balcony.gif');
    tobecontinued = loadImage('Ending.gif', () => { videosReady = true; });
  });
}


function setup() {
  createCanvas(725, 1000);
  pixelDensity(1);
  loadSounds();
  loadRooms();
  // Audio is started on the first click (startAudio). Browsers suspend the
  // AudioContext until a user gesture, so looping here would throw inside an
  // iframe and halt the sketch — and the house is meant to be silent until
  // the visitor steps in anyway.
}

let audioLoopsStarted = false;

// Resume + start audio. Called on EVERY user gesture (not one-shot): the
// AudioContext only resumes inside a genuine gesture, and sounds may still be
// loading on the first gesture, so we keep (re)starting any loop that isn't
// playing yet until they're all going.
function unlockAudio() {
  try {
    if (typeof getAudioContext === 'function') {
      const ctx = getAudioContext();
      if (ctx && ctx.state !== 'running') ctx.resume();
    }
  } catch (e) {}
  try { if (typeof userStartAudio === 'function') userStartAudio(); } catch (e) {}

  const all = [water, washing, kitchen, radio, television, music,
               meow, traffic, milk, children, bird, pencil, giggle];
  let allGoing = true;
  for (let i = 0; i < all.length; i++) {
    const s = all[i];
    try {
      if (s && s.isLoaded && s.isLoaded()) {
        if (!s.isPlaying()) { s.loop(); s.setVolume(0); }
      } else {
        allGoing = false;          // not loaded yet — retry on next gesture
      }
    } catch (e) { allGoing = false; }
  }
  try { if (traffic && traffic.isLoaded && traffic.isLoaded()) traffic.setVolume(0.2); } catch (e) {}
  audioLoopsStarted = allGoing;
}

// Backwards-compatible alias used elsewhere in the sketch.
function startAudio() { unlockAudio(); }

// Real gesture listeners — these reliably carry the user activation the
// AudioContext needs. Registered as early as the script loads so any tap,
// click, key, or touch unlocks sound, even before p5's mousePressed fires.
['pointerdown', 'mousedown', 'touchstart', 'click', 'keydown'].forEach(function (ev) {
  window.addEventListener(ev, unlockAudio, { passive: true });
});
// Let the parent page forward its own gestures in (same-origin embed).
try { window.__bastuUnlock = unlockAudio; } catch (e) {}



function draw() {
  background(18, 17, 24);
  rectMode (CENTER);

  // hold on a quiet loading state until the entrance room is ready
  if (!titleReady) {
    drawLoading();
    return;
  }

  // expose current scene for the host page (debug/verification + future hooks)
  try { window.currentScene = sceneNum; } catch (e) {}

  //scene 0 Music Vol
  if(sceneNum==0){
        music.setVolume(0.5);
      }
      else {
        music.setVolume(0);
      }
  //scene 1 Radio Vol
  if(sceneNum==1){
        radio.setVolume(0.08);
      }
      else {
        radio.setVolume(0);
      }

  //scene 2 milk and television
  if(sceneNum==2){
    milk.setVolume(0.5);
    traffic.setVolume(0.4);
    television.setVolume(0.3);
  }
      else {
        milk.setVolume(0);
        television.setVolume(0);
      }

  //scene 3 Children talking
  if(sceneNum==3){
    children.setVolume(1);
    traffic.setVolume(0.7);
    music.setVolume(0.5);
  }
  else {
    children.setVolume(0);
    //traffic.setVolume(0);
      }

  //scene 4 balcony
  if(sceneNum==4){
    traffic.setVolume(1.5);
    music.setVolume(1);
  }
  // else {
  //   music.setVolume(0);
  //     }

  //scene 5 ending
  if(sceneNum==5){
        music.setVolume(0.5);
      }


  //SWITCHES

  switch(sceneNum){

    //ENTRANCE1
    case 1:
      image(entrance1, -300, 0, 1300, 1000);


      //water
      if (mouseX>500 && mouseX<600 && mouseY>550 && mouseY<600) {
        traffic.setVolume(0.1);
        water.setVolume(10);
      }
      else {
        water.setVolume(0);
      }

      //kitchen
      if (mouseX>600 && mouseX<750 && mouseY>400 && mouseY<1000) {
        traffic.setVolume(0.1);
        kitchen.setVolume(3);
      }
      else {
        kitchen.setVolume(0);
      }

      //radio
      if (mouseX>100 && mouseX<200 && mouseY>400 && mouseY<600) {
        traffic.setVolume(0.1);
        radio.setVolume(0.8);
      }
      else {
        radio.setVolume(0.08);
      }

      //cat
      if (mouseX>100 && mouseX<200 && mouseY>750 && mouseY<900) {
        traffic.setVolume(0.1);
        meow.setVolume(0.5);
      }
      else {
        meow.setVolume(0);
      }
      break;

    //ENTRANCE2
    case 2:
      image(entrance2, -300, 0, 1300, 1000);

      //cat
      if (mouseX>300 && mouseX<550 && mouseY>700 && mouseY<900) {
        traffic.setVolume(0.1);
        meow.setVolume(0.5);
      }
      else {
        meow.setVolume(0);
      }

      //milk
      if (mouseX>500 && mouseX<650 && mouseY>700 && mouseY<780) {
        traffic.setVolume(0.1);
        milk.setVolume(0.5);
      }
      else {
        milk.setVolume(0);
      }

      //washing
      if (mouseX>0 && mouseX<200 && mouseY>100 && mouseY<900) {
        traffic.setVolume(0.1);
        washing.setVolume(1);
      }
      else {
        washing.setVolume(0);
      }

      //bird
      if (mouseX>300 && mouseX<500 && mouseY>200 && mouseY<300) {
        traffic.setVolume(0.1);
        bird.setVolume(1);
      }
      else {
        bird.setVolume(0);
      }

      break;

    case 3:
      image(entrance3, -300, 0, 1300, 1000);

      //cat
      if (mouseX>500 && mouseX<700 && mouseY>700 && mouseY<900) {
        traffic.setVolume(0.1);
        meow.setVolume(0.5);
      }
      else {
        meow.setVolume(0);
      }

      //pencil
      if (mouseX>200 && mouseX<300 && mouseY>100 && mouseY<900) {
        traffic.setVolume(0.5);
        pencil.setVolume(10);
      }
      else {
        pencil.setVolume(0);
      }
      break;

    case 4:
      image(balcony, -300, 0, 1300, 1000);

      //woman laughing
     if (mouseX>400 && mouseX<700 && mouseY>100 && mouseY<900) {
        traffic.setVolume(0.5);
        giggle.setVolume(1);
      }
      else {
        giggle.setVolume(0);
      }
      break;

    case 5:
      image(tobecontinued, 0, 0, 750,1000);

      break;
  }

}

function drawLoading() {
  push();
  noStroke();
  textAlign(CENTER, CENTER);
  textFont('monospace');
  textSize(13);
  let a = 90 + 70 * sin(frameCount * 0.06);
  fill(231, 220, 193, a);
  text('entering the house…', width / 2, height / 2);
  pop();
}

function drawEnterHint() {
  push();
  noStroke();
  textAlign(CENTER, CENTER);
  textFont('monospace');
  textSize(13);
  let a = 120 + 90 * sin(frameCount * 0.05);
  fill(231, 220, 193, a);
  text('click to enter', width / 2, height - 70);
  pop();
}

function mousePressed() {
  // ignore clicks until the entrance room is ready
  if (!titleReady) return;
  // first gesture unlocks + starts every loop (silent), then we advance
  startAudio();
  started = true;
  try { window.__interacted = true; } catch (e) {}

  sceneNum++;

  if (sceneNum == 6) {

    sceneNum = 1;
  }
}

// Any hover over the house counts as engagement (used by the host page to
// retire the onboarding cursor cue once the visitor starts exploring).
function mouseMoved() {
  if (titleReady && (mouseX !== pmouseX || mouseY !== pmouseY)) {
    try { window.__interacted = true; } catch (e) {}
  }
}
