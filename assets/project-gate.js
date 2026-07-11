/* ============================================================
   Lightweight client-side password gate for private projects.
   Blurs the page and floats a password card (in Koli's design
   language) on top until the correct password is entered.

   NOTE: This is casual protection only. The page content still
   ships to the browser, so a determined visitor can read it via
   dev tools. For real protection, gate at the hosting level
   (e.g. Netlify/Cloudflare Access, or HTTP basic auth).
   ============================================================ */
(function () {
  // SHA-256 of the password. Change the password by replacing this hash.
  var EXPECTED = 'a28e87a7bd75ee135d94a36c5eb490cd8cb563b9b22b68e6a38555b914e7abf1';
  var HOME = '../../index.html';  // back-to-site target (both gated projects live at projects/<name>/)

  // No session persistence: the gate is shown on every visit to a private
  // project, so landing on Health Connect or LifeLabs always prompts.

  var head = document.head || document.documentElement;

  // --- Compact SHA-256 (ASCII), returns lowercase hex. ---
  function sha256(ascii) {
    function ror(v, a) { return (v >>> a) | (v << (32 - a)); }
    var mp = Math.pow, maxWord = mp(2, 32), result = '';
    var words = [], bitLen = ascii.length * 8;
    var hash = sha256.h = sha256.h || [], k = sha256.k = sha256.k || [], pc = k.length;
    var composite = {};
    for (var cand = 2; pc < 64; cand++) {
      if (!composite[cand]) {
        for (var i = 0; i < 313; i += cand) composite[i] = cand;
        hash[pc] = (mp(cand, 0.5) * maxWord) | 0;
        k[pc++] = (mp(cand, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += '\x80';
    while (ascii.length % 64 - 56) ascii += '\x00';
    for (var i = 0; i < ascii.length; i++) {
      var j = ascii.charCodeAt(i);
      if (j >> 8) return '';
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words.length] = (bitLen / maxWord) | 0;
    words[words.length] = bitLen;
    for (var j = 0; j < words.length;) {
      var w = words.slice(j, j += 16);
      var oldHash = hash;
      hash = hash.slice(0, 8);
      for (var i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2];
        var a = hash[0], e = hash[4];
        var t1 = hash[7]
          + (ror(e, 6) ^ ror(e, 11) ^ ror(e, 25))
          + ((e & hash[5]) ^ (~e & hash[6]))
          + k[i]
          + (w[i] = i < 16 ? w[i] : (
              w[i - 16]
              + (ror(w15, 7) ^ ror(w15, 18) ^ (w15 >>> 3))
              + w[i - 7]
              + (ror(w2, 17) ^ ror(w2, 19) ^ (w2 >>> 10))
            ) | 0);
        var t2 = (ror(a, 2) ^ ror(a, 13) ^ ror(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(t1 + t2) | 0].concat(hash);
        hash[4] = (hash[4] + t1) | 0;
      }
      for (var i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (var i = 0; i < 8; i++) {
      for (var j = 3; j + 1; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  // --- Load the site's brand fonts (Syne + Space Grotesk). ---
  var fonts = document.createElement('link');
  fonts.rel = 'stylesheet';
  fonts.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Grotesk:wght@300;400;500&display=swap';
  head.appendChild(fonts);

  // --- Styles: blur the page + card in Koli's design language. ---
  var style = document.createElement('style');
  style.id = 'koli-gate-style';
  style.textContent = [
    /* blur + lock the underlying page (the card lives outside <body>, so it stays sharp) */
    'html.koli-gated{overflow:hidden!important;}',
    'html.koli-gated>body{filter:blur(15px)!important;-webkit-filter:blur(15px)!important;',
      'pointer-events:none!important;user-select:none!important;overflow:hidden!important;}',
    '#koli-gate-wrap{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;',
      'justify-content:center;padding:24px;animation:kgFade .35s ease both;}',
    '#koli-gate-wrap *{box-sizing:border-box;}',
    '@keyframes kgFade{from{opacity:0}to{opacity:1}}',
    '@keyframes kgRise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',
    '.kg-scrim{position:absolute;inset:0;background:rgba(236,236,234,.5);}',
    '.kg-card{position:relative;width:min(400px,92vw);background:#ECECEA;',
      'border:1px solid rgba(20,19,15,.14);border-radius:22px;padding:40px 34px 30px;text-align:center;',
      'box-shadow:0 30px 80px -26px rgba(20,19,15,.45),inset 0 1px 0 rgba(255,255,255,.7);',
      'animation:kgRise .45s cubic-bezier(.2,.7,.2,1) both;}',
    '.kg-mark{width:54px;height:54px;margin:0 auto 22px;display:block;}',
    '.kg-title{font-family:"Syne",system-ui,sans-serif;font-weight:700;font-size:1.42rem;',
      'letter-spacing:-.01em;color:#14130F;margin:0 0 9px;}',
    '.kg-sub{font-family:"Space Grotesk",system-ui,sans-serif;font-weight:300;font-size:.92rem;',
      'line-height:1.55;color:#6a6862;margin:0 0 26px;}',
    '.kg-input{width:100%;border:none;background:transparent;border-bottom:1.5px solid rgba(20,19,15,.14);',
      'font-family:"Space Grotesk",system-ui,sans-serif;font-weight:300;font-size:1rem;color:#14130F;',
      'padding:.6rem 0;transition:border-color .3s;}',
    '.kg-input:focus{outline:none;border-color:#E85F2A;}',
    '.kg-input::placeholder{color:#6a6862;opacity:.6;}',
    '.kg-err{font-family:"Space Grotesk",system-ui,sans-serif;font-size:.76rem;color:#E85F2A;',
      'text-align:left;min-height:1.1em;margin:.6rem 0 0;}',
    '.kg-btn{appearance:none;border:none;cursor:pointer;width:100%;margin-top:1.3rem;',
      'background:#14130F;color:#ECECEA;font-family:"Space Grotesk",system-ui,sans-serif;font-weight:500;',
      'font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;padding:1em 1.6em;border-radius:999px;',
      'display:inline-flex;align-items:center;justify-content:center;gap:.5em;',
      'transition:background .3s,gap .3s,transform .3s;}',
    '.kg-btn:hover{background:#E85F2A;gap:.8em;transform:translateY(-2px);}',
    '.kg-back{display:inline-flex;align-items:center;gap:.45em;margin-top:1.4rem;',
      'font-family:"Space Grotesk",system-ui,sans-serif;font-weight:400;font-size:.72rem;',
      'letter-spacing:.1em;text-transform:uppercase;color:#6a6862;text-decoration:none;',
      'transition:color .3s,gap .3s;}',
    '.kg-back:hover{color:#E85F2A;gap:.7em;}'
  ].join('');
  head.appendChild(style);

  document.documentElement.classList.add('koli-gated');

  // --- Build the card. ---
  var logo = '<svg class="kg-mark" viewBox="0 0 512 512" aria-hidden="true">'
    + '<mask id="kg-k"><circle cx="256" cy="256" r="256" fill="#fff"/>'
    + '<path fill="#000" d="M214.71 535.85Q209.74 537.27 204.07 535.85Q198.4 534.43 193.08 531.24Q187.77 528.05 183.34 523.62Q178.9 519.19 176.07 514.93Q172.52 509.97 170.93 503.95Q169.33 497.92 167.92 491.89Q164.37 475.59 162.78 459.11Q161.18 442.62 159.76 425.96Q158.35 408.6 157.28 391.4Q156.22 374.21 155.16 356.84Q144.88 352.24 136.72 343.02Q133.89 339.48 132.65 334.87Q131.41 330.26 132.12 325.65Q133.89 313.6 139.74 302.43Q145.59 291.27 151.97 280.99Q149.84 218.25 148.42 156.57Q147 94.9 145.94 32.16Q145.94 29.68 145.59 22.41Q145.23 15.14 145.05 6.81Q144.88 -1.52 144.7 -8.96Q144.52 -16.4 144.52 -18.88Q144.88 -19.95 145.76 -21.19Q146.65 -22.43 148.07 -23.14Q154.09 -25.27 161.18 -22.61Q168.27 -19.95 173.59 -16.05Q176.07 -13.92 178.2 -11.44Q180.32 -8.96 181.74 -5.77Q182.09 -4.71 182.27 -2.23Q182.45 0.26 182.45 3.09Q182.45 5.93 182.45 8.41Q182.45 10.89 182.45 11.95Q184.22 65.83 185.28 119Q186.35 172.17 187.77 226.05Q197.69 211.52 207.44 197.51Q217.19 183.51 227.11 169.33Q254.4 129.63 279.22 89.23Q304.03 48.82 329.2 8.05Q329.91 6.64 331.85 3.45Q333.8 0.26 336.11 -3.47Q338.41 -7.19 340.54 -10.38Q342.67 -13.57 343.73 -14.63Q347.98 -18.53 354.72 -16.76Q360.03 -15.34 365.17 -12.68Q370.31 -10.02 374.21 -5.77Q375.99 -4 378.29 0.08Q380.59 4.16 379.53 6.99Q378.82 8.41 377.76 12.48Q376.69 16.56 375.28 21.17Q373.86 25.78 372.44 29.85Q371.02 33.93 370.31 35.35Q369.25 37.47 365.71 38.01Q362.16 38.54 359.68 38.18Q335.58 77.53 311.47 115.99Q287.37 154.45 261.85 192.37Q243.77 218.96 225.52 245.19Q207.26 271.42 190.25 299.07L191.31 323.52Q219.31 313.25 245.9 300.13Q272.48 287.02 299.07 273.19Q302.26 271.42 306.51 271.6Q310.76 271.77 315.02 273.37Q319.27 274.96 323.17 277.62Q327.07 280.28 329.91 283.12Q332.03 285.24 333.8 288.26Q335.58 291.27 334.87 294.46Q334.87 295.52 333.27 296.94Q331.68 298.36 330.61 299.07Q313.6 308.28 296.59 316.61Q279.57 324.94 262.2 333.1Q245.19 340.54 228.17 347.63Q211.16 354.72 193.08 358.62Q194.15 382.01 195.56 404.7Q196.98 427.38 199.11 450.42Q200.17 461.76 201.41 473.11Q202.65 484.45 204.43 495.79Q206.2 506.78 209.74 516.71Q212.22 518.83 214.53 521.67Q216.83 524.5 217.9 527.34Q218.96 530.18 218.43 532.48Q217.9 534.78 214.71 535.85Z"/></mask>'
    + '<circle cx="256" cy="256" r="256" fill="#E85F2A" mask="url(#kg-k)"/></svg>';

  var wrap = document.createElement('div');
  wrap.id = 'koli-gate-wrap';
  wrap.innerHTML =
    '<div class="kg-scrim"></div>'
    + '<form class="kg-card" id="kg-form" role="dialog" aria-modal="true" aria-label="Password required">'
    + logo
    + '<h1 class="kg-title">This project is private</h1>'
    + '<p class="kg-sub">Enter the password to view this case study.</p>'
    + '<input class="kg-input" id="kg-input" type="password" placeholder="Password" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" />'
    + '<div class="kg-err" id="kg-err"></div>'
    + '<button class="kg-btn" type="submit">Unlock <span aria-hidden="true">→</span></button>'
    + '<a class="kg-back" href="' + HOME + '"><span aria-hidden="true">←</span> Back to site</a>'
    + '</form>';
  document.documentElement.appendChild(wrap);

  var form = wrap.querySelector('#kg-form');
  var input = wrap.querySelector('#kg-input');
  var err = wrap.querySelector('#kg-err');
  setTimeout(function () { try { input.focus(); } catch (e) {} }, 40);
  input.addEventListener('input', function () { err.textContent = ''; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sha256(input.value) === EXPECTED) {
      document.documentElement.classList.remove('koli-gated'); // remove the blur → page becomes visible
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      if (style.parentNode) style.parentNode.removeChild(style);
    } else {
      err.textContent = 'Incorrect password. Please try again.';
      input.select();
    }
  });
})();
