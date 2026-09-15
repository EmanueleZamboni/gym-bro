/* Gym Bro chiptune synth: 16-bit console style square/triangle/noise, rendered to short WAV clips (< 5 s so Android ducks music). */
(function (global) {
  'use strict';
  const RATE = 22050;
  const sq = (f, t, d = 0.5) => ((t * f) % 1) < d ? 1 : -1;
  const tri = (f, t) => 4 * Math.abs(((t * f) % 1) - 0.5) - 1;
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff * 2 - 1; };

  /* notes: {f, f1?, t0, dur, vol, duty, type:'sq'|'tri', dec (decay curve), vib} ; noises: {t0, dur, vol, hold, dec} */
  function render(total, notes, noises = []) {
    const n = Math.floor(total * RATE), out = new Float32Array(n);
    const nz = noises.map(z => ({ ...z, v: 0, c: 0 }));
    for (let i = 0; i < n; i++) {
      const t = i / RATE; let s = 0;
      for (const q of notes) {
        if (t < q.t0 || t >= q.t0 + q.dur) continue;
        const lt = t - q.t0, x = lt / q.dur;
        const e = Math.min(1, lt / 0.003) * Math.pow(1 - x, q.dec ?? 0.8);
        let f = q.f1 ? q.f + (q.f1 - q.f) * x : q.f;
        if (q.vib) f *= 1 + 0.012 * Math.sin(2 * Math.PI * 7 * lt);
        s += (q.type === 'tri' ? tri(f, lt) : sq(f, lt, q.duty ?? 0.5)) * (q.vol ?? 0.5) * e;
      }
      for (const z of nz) {
        if (t < z.t0 || t >= z.t0 + z.dur) continue;
        if (z.c++ % z.hold === 0) z.v = rnd();
        const x = (t - z.t0) / z.dur;
        s += z.v * z.vol * Math.pow(1 - x, z.dec ?? 1.2);
      }
      out[i] = Math.max(-1, Math.min(1, s));
    }
    return out;
  }
  function wav(samples) {
    const n = samples.length, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
    const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
    v.setUint16(22, 1, true); v.setUint32(24, RATE, true); v.setUint32(28, RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    w(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, samples[i] * 32767, true);
    return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  }
  const N = { C4: 262, E4: 330, G4: 392, A4: 440, B4: 494, C5: 523, D5: 587, E5: 659, G5: 784, A5: 880, B5: 988, C6: 1047, E6: 1319, G6: 1568 };
  const arp = (names, t0, step, dur, vol = 0.35, duty = 0.25) => names.map((k, i) => ({ f: N[k], t0: t0 + i * step, dur, vol, duty, dec: 0.6 }));

  const DEFS = {
    /* DONE press: punch + reward arpeggio */
    hit: () => render(0.45,
      [{ f: 180, f1: 40, t0: 0, dur: 0.13, vol: 0.5, dec: 1.2 }, ...arp(['C5', 'E5', 'G5', 'C6'], 0.07, 0.065, 0.09, 0.3)],
      [{ t0: 0, dur: 0.09, vol: 0.55, hold: 3, dec: 1.4 }]),
    /* final set: bigger fanfare */
    finish: () => render(1.1,
      [{ f: 180, f1: 40, t0: 0, dur: 0.13, vol: 0.5, dec: 1.2 }, ...arp(['C5', 'E5', 'G5', 'C6', 'E6', 'G6'], 0.06, 0.06, 0.09, 0.28),
        { f: N.G6, t0: 0.44, dur: 0.6, vol: 0.32, duty: 0.5, vib: 1, dec: 1.4 }, { f: N.C5, t0: 0.44, dur: 0.6, vol: 0.25, type: 'tri', dec: 1.4 }],
      [{ t0: 0, dur: 0.1, vol: 0.55, hold: 3, dec: 1.4 }]),
    tick3: () => render(0.09, [{ f: 494, t0: 0, dur: 0.08, vol: 0.45 }]),
    /* rest over: round bell */
    alarm: () => render(0.8, [
      { f: N.B5, t0: 0, dur: 0.11, vol: 0.45 }, { f: N.E6, t0: 0.12, dur: 0.11, vol: 0.45 },
      { f: N.B5, t0: 0.3, dur: 0.11, vol: 0.45 }, { f: N.E6, t0: 0.42, dur: 0.34, vol: 0.45, dec: 1.5 },
      { f: N.E4, t0: 0, dur: 0.23, vol: 0.3, type: 'tri' }, { f: N.E4, t0: 0.3, dur: 0.45, vol: 0.3, type: 'tri', dec: 1.5 }]),
    /* GO: crunch */
    go: () => render(0.4,
      [{ f: 90, f1: 28, t0: 0, dur: 0.3, vol: 0.55, dec: 1.1 }, { f: 520, f1: 260, t0: 0.02, dur: 0.09, vol: 0.3, duty: 0.25 }],
      [{ t0: 0, dur: 0.26, vol: 0.7, hold: 5, dec: 1.3 }, { t0: 0.05, dur: 0.12, vol: 0.35, hold: 2, dec: 1 }])
  };
  const urls = {};
  const url = name => urls[name] || (urls[name] = wav(DEFS[name]()));
  let enabled = true;
  function play(name) {
    if (!enabled || !DEFS[name]) return;
    try { const a = new Audio(url(name)); a.play().catch(() => {}); } catch (e) {}
  }
  global.Sfx = { play, url, setEnabled: v => { enabled = v; }, names: Object.keys(DEFS) };
})(typeof window !== 'undefined' ? window : globalThis);
