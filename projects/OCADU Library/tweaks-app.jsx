/* tweaks-app.jsx — OCAD U Library case study tweaks panel.
   Mutates CSS custom properties on :root and toggles body classes
   so changes apply live across the page. */

const { useEffect } = React;

const ACCENTS = {
  '#e4002b': 'oklch(0.575 0.245 27)',   // OCAD red
  '#8c2a1e': 'oklch(0.52 0.18 28)',     // archival oxblood
  '#1f5a35': 'oklch(0.48 0.13 145)',    // forest
  '#1a3a78': 'oklch(0.42 0.16 250)',    // cobalt
  '#0a0a0a': 'oklch(0.34 0 0)',         // pure ink
};

const DISPLAY_FONTS = {
  serif: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
  sans:  '"Space Grotesk", "Helvetica Neue", Arial, sans-serif',
};

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  useEffect(() => {
    const r = document.documentElement.style;
    const accentOk = ACCENTS[t.accent] || ACCENTS['#e4002b'];
    r.setProperty('--accent', accentOk);
    r.setProperty('--accent-flat', t.accent);

    // Paper palette: [paper, paper-2, rule]
    if (Array.isArray(t.paper)) {
      r.setProperty('--paper',   t.paper[0]);
      r.setProperty('--paper-2', t.paper[1]);
      if (t.paper[2]) r.setProperty('--rule', t.paper[2]);
    }

    r.setProperty('--font-display', DISPLAY_FONTS[t.displayFont] || DISPLAY_FONTS.serif);

    document.body.classList.toggle('no-grain',  !t.grain);
    document.body.classList.toggle('no-pins',   !t.pins);
    document.body.classList.toggle('no-cursor', !t.cursor);
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Accent" />
      <TweakColor
        label="Colour"
        value={t.accent}
        options={['#e4002b', '#8c2a1e', '#1f5a35', '#0a0a0a']}
        onChange={(v) => setTweak('accent', v)}
      />

      <TweakSection label="Paper" />
      <TweakColor
        label="Tone"
        value={t.paper}
        options={[
          ['#f6f3ed', '#ece7dc', '#d6d3cd'],  // warm
          ['#f1f3f5', '#e3e6ea', '#cdd2d7'],  // cool
          ['#ffffff', '#f4f4f4', '#e0e0e0'],  // white
          ['#f0ead8', '#e3d9bf', '#cbbf9b'],  // bone
        ]}
        onChange={(v) => setTweak('paper', v)}
      />

      <TweakSection label="Display type" />
      <TweakRadio
        label="Family"
        value={t.displayFont}
        options={['serif', 'sans']}
        onChange={(v) => setTweak('displayFont', v)}
      />

      <TweakSection label="Texture" />
      <TweakToggle
        label="Hero grain"
        value={t.grain}
        onChange={(v) => setTweak('grain', v)}
      />
      <TweakToggle
        label="Audit pins"
        value={t.pins}
        onChange={(v) => setTweak('pins', v)}
      />
      <TweakToggle
        label="Use cursor"
        value={t.cursor}
        onChange={(v) => setTweak('cursor', v)}
      />
    </TweaksPanel>
  );
}

const mount = document.getElementById('tweaks-root');
if (mount) {
  ReactDOM.createRoot(mount).render(<App />);
}
