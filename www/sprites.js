/* Gym Bro pixel sprites: 32x32, two frames each, drawn from primitives with an auto outline. */
(function (global) {
  'use strict';
  const PAL = {
    K: '#14102b', S: '#ffc39a', s: '#d98a5c', H: '#2a1d3d', R: '#ff3b5c', r: '#b3203f',
    B: '#2f6bff', b: '#1c3fb0', W: '#f4f1ff', M: '#3d3a63', m: '#7b78a8', n: '#a5a2cf',
    Y: '#ffd23f', y: '#c99b12', G: '#5c5a85', C: '#3ef2ff', O: '#ff8c1a', Z: '#6c6a93'
  };

  function Canvas(w, h) {
    const g = Array.from({ length: h }, () => new Array(w).fill(null));
    const set = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && x < w && y >= 0 && y < h) g[y][x] = c; };
    const api = { g, w, h, set,
      rect(x, y, rw, rh, c) { for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) set(x + i, y + j, c); },
      dot(x, y, c, t) { const o = Math.floor((t - 1) / 2); api.rect(x - o, y - o, t, t, c); },
      line(x0, y0, x1, y1, c, t = 1) {
        x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
        const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
        let err = dx + dy;
        for (;;) { api.dot(x0, y0, c, t); if (x0 === x1 && y0 === y1) break; const e2 = 2 * err; if (e2 >= dy) { err += dy; x0 += sx; } if (e2 <= dx) { err += dx; y0 += sy; } }
      },
      disc(cx, cy, r, c, clip) { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.6) { if (!clip || clip(cx + x, cy + y)) set(cx + x, cy + y, c); } },
      outline(c) {
        const src = g.map(r => r.slice());
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!src[y][x]) {
          if ((y > 0 && src[y - 1][x]) || (y < h - 1 && src[y + 1][x]) || (x > 0 && src[y][x - 1]) || (x < w - 1 && src[y][x + 1])) g[y][x] = c;
        }
      }
    };
    return api;
  }

  /* athlete: side view facing right. pose = {head:[x,y], neck:[x,y], hip:[x,y], knee, ankle, shoulder, elbow, hand, back?:{elbow,hand,knee,ankle}} */
  function athlete(p, q) {
    const [hx, hy] = q.head; p.head = q.head;
    // back limbs (shadow tones) drawn first for depth
    if (q.back) {
      if (q.back.knee) { p.line(q.hip[0] + 1, q.hip[1], q.back.knee[0], q.back.knee[1], 'b', 3); p.line(q.back.knee[0], q.back.knee[1], q.back.ankle[0], q.back.ankle[1], 's', 2); p.dot(q.back.ankle[0] + 1, q.back.ankle[1] + 1, 'Z', 2); }
      if (q.back.elbow) { p.line(q.shoulder[0], q.shoulder[1] + 1, q.back.elbow[0], q.back.elbow[1], 's', 2); p.line(q.back.elbow[0], q.back.elbow[1], q.back.hand[0], q.back.hand[1], 's', 2); }
    }
    // torso
    p.line(q.neck[0], q.neck[1], q.hip[0], q.hip[1], 'R', 4);
    p.line(q.neck[0] - 2, q.neck[1], q.hip[0] - 2, q.hip[1], 'r', 1);
    // front leg
    p.line(q.hip[0], q.hip[1], q.knee[0], q.knee[1], 'B', 3);
    p.line(q.knee[0], q.knee[1], q.ankle[0], q.ankle[1], 'S', 2);
    p.dot(q.ankle[0], q.ankle[1] + 1, 'W', 2);
    // front arm
    p.line(q.shoulder[0], q.shoulder[1], q.elbow[0], q.elbow[1], 'S', 2);
    p.line(q.elbow[0], q.elbow[1], q.hand[0], q.hand[1], 'S', 2);
    p.dot(q.shoulder[0], q.shoulder[1], 'R', 3);
    p.dot(q.hand[0], q.hand[1], 's', 2);
    // head
    p.disc(hx, hy, 3, 'S');
    p.disc(hx, hy, 3, 'H', (x, y) => y <= hy - 1 && !(x >= hx + 2 && y === hy - 1));
    p.line(hx - 3, hy, hx + 1, hy, 'R', 1); // headband
    p.set(hx + 2, hy + 1, 'K'); // eye
    if (q.sweat) { p.set(hx + 5, hy - 1, 'C'); p.set(hx + 5, hy, 'C'); p.set(hx + 4, hy, 'C'); }
  }

  const seat = (p, x, y, w) => { p.rect(x, y, w, 2, 'M'); p.rect(x, y, w, 1, 'm'); };
  const post = (p, x, y, h) => { p.rect(x, y, 2, h, 'M'); p.rect(x, y, 1, h, 'm'); };
  const base = (p, x, y, w) => { p.rect(x, y, w, 2, 'M'); p.rect(x, y, w, 1, 'm'); };
  const backrest = (p, x, y, h) => { p.rect(x, y, 3, h, 'M'); p.rect(x + 1, y, 1, h, 'm'); };
  const pad = (p, x, y, w, h) => { p.rect(x, y, w, h, 'Y'); p.rect(x, y + h - 1, w, 1, 'y'); };
  const stack = (p, x, y) => { for (let i = 0; i < 5; i++) { p.rect(x, y + i * 2, 5, 1, i % 2 ? 'G' : 'M'); p.rect(x, y + i * 2 + 1, 5, 1, 'K'); } p.rect(x + 2, y - 4, 1, 4, 'n'); };

  const SPRITES = {
    chestpress: [
      p => { backrest(p, 6, 8, 16); seat(p, 6, 22, 10); post(p, 10, 24, 6); base(p, 6, 30, 10); stack(p, 25, 18);
        athlete(p, { head: [11, 8], neck: [11, 12], hip: [11, 21], knee: [17, 21], ankle: [17, 28], shoulder: [11, 14], elbow: [15, 18], hand: [18, 14] });
        p.rect(19, 11, 2, 7, 'Y'); p.rect(21, 14, 4, 1, 'n'); },
      p => { backrest(p, 6, 8, 16); seat(p, 6, 22, 10); post(p, 10, 24, 6); base(p, 6, 30, 10); stack(p, 25, 18);
        athlete(p, { head: [11, 8], neck: [11, 12], hip: [11, 21], knee: [17, 21], ankle: [17, 28], shoulder: [11, 14], elbow: [17, 15], hand: [23, 14] });
        p.rect(24, 11, 2, 7, 'Y'); p.rect(26, 14, 2, 1, 'n'); }
    ],
    legext: [
      p => { backrest(p, 5, 7, 16); seat(p, 5, 21, 12); post(p, 9, 23, 7); base(p, 5, 30, 10); stack(p, 25, 22);
        athlete(p, { head: [10, 8], neck: [10, 12], hip: [10, 20], knee: [17, 20], ankle: [18, 28], shoulder: [10, 14], elbow: [13, 19], hand: [14, 22] });
        p.line(18, 22, 19, 28, 'm', 1); pad(p, 17, 28, 4, 2); },
      p => { backrest(p, 5, 7, 16); seat(p, 5, 21, 12); post(p, 9, 23, 7); base(p, 5, 30, 10); stack(p, 25, 22);
        athlete(p, { head: [10, 8], neck: [10, 12], hip: [10, 20], knee: [17, 20], ankle: [25, 21], shoulder: [10, 14], elbow: [13, 19], hand: [14, 22] });
        p.line(19, 22, 25, 22, 'm', 1); pad(p, 24, 22, 3, 4); }
    ],
    latpull: [
      p => { seat(p, 6, 22, 12); post(p, 10, 24, 6); base(p, 6, 30, 12); p.rect(19, 0, 2, 32, 'M'); p.rect(19, 0, 1, 32, 'm'); stack(p, 24, 22);
        p.rect(14, 2, 1, 2, 'n'); p.rect(6, 4, 16, 2, 'n'); p.rect(6, 4, 16, 1, 'W');
        athlete(p, { head: [11, 10], neck: [11, 14], hip: [11, 22], knee: [17, 22], ankle: [17, 29], shoulder: [11, 16], elbow: [8, 10], hand: [9, 5] });
        pad(p, 13, 19, 6, 2); },
      p => { seat(p, 6, 22, 12); post(p, 10, 24, 6); base(p, 6, 30, 12); p.rect(19, 0, 2, 32, 'M'); p.rect(19, 0, 1, 32, 'm'); stack(p, 24, 16);
        p.rect(14, 2, 1, 12, 'n'); p.rect(6, 14, 16, 2, 'n'); p.rect(6, 14, 16, 1, 'W');
        athlete(p, { head: [11, 9], neck: [11, 13], hip: [11, 22], knee: [17, 22], ankle: [17, 29], shoulder: [11, 15], elbow: [6, 17], hand: [8, 15] });
        pad(p, 13, 19, 6, 2); }
    ],
    row: [
      p => { seat(p, 4, 22, 10); post(p, 7, 24, 6); base(p, 3, 30, 12); p.rect(24, 8, 2, 22, 'M'); p.rect(24, 8, 1, 22, 'm'); stack(p, 26, 20);
        p.rect(26, 8, 2, 2, 'n'); p.rect(19, 24, 4, 6, 'G');
        athlete(p, { head: [9, 9], neck: [9, 13], hip: [9, 21], knee: [16, 20], ankle: [20, 26], shoulder: [9, 15], elbow: [14, 18], hand: [19, 15] });
        p.rect(20, 15, 4, 1, 'n'); p.rect(19, 13, 2, 5, 'Y'); },
      p => { seat(p, 4, 22, 10); post(p, 7, 24, 6); base(p, 3, 30, 12); p.rect(24, 8, 2, 22, 'M'); p.rect(24, 8, 1, 22, 'm'); stack(p, 26, 14);
        p.rect(26, 8, 2, 2, 'n'); p.rect(19, 24, 4, 6, 'G');
        athlete(p, { head: [9, 9], neck: [9, 13], hip: [9, 21], knee: [16, 20], ankle: [20, 26], shoulder: [9, 15], elbow: [5, 18], hand: [11, 16] });
        p.rect(12, 16, 12, 1, 'n'); p.rect(11, 14, 2, 5, 'Y'); }
    ],
    abs: [
      p => { backrest(p, 4, 8, 15); seat(p, 4, 22, 12); post(p, 8, 24, 6); base(p, 4, 30, 12); stack(p, 25, 20);
        p.rect(20, 4, 2, 20, 'M'); p.rect(20, 4, 1, 20, 'm'); p.rect(15, 8, 6, 1, 'n');
        athlete(p, { head: [10, 9], neck: [10, 13], hip: [10, 21], knee: [16, 21], ankle: [16, 28], shoulder: [10, 15], elbow: [14, 12], hand: [15, 9] });
        pad(p, 14, 14, 3, 5); },
      p => { backrest(p, 4, 8, 15); seat(p, 4, 22, 12); post(p, 8, 24, 6); base(p, 4, 30, 12); stack(p, 25, 14);
        p.rect(20, 4, 2, 20, 'M'); p.rect(20, 4, 1, 20, 'm'); p.rect(16, 13, 5, 1, 'n');
        athlete(p, { head: [14, 13], neck: [13, 16], hip: [10, 21], knee: [16, 21], ankle: [16, 28], shoulder: [13, 17], elbow: [16, 15], hand: [16, 13] });
        pad(p, 16, 18, 3, 4); }
    ],
    legcurl: [
      p => { backrest(p, 5, 7, 16); seat(p, 5, 21, 12); post(p, 9, 23, 7); base(p, 5, 30, 10); stack(p, 25, 22);
        athlete(p, { head: [10, 8], neck: [10, 12], hip: [10, 20], knee: [17, 20], ankle: [24, 23], shoulder: [10, 14], elbow: [13, 19], hand: [15, 18] });
        pad(p, 11, 17, 6, 2); pad(p, 23, 24, 4, 2); p.line(18, 23, 24, 26, 'm', 1); },
      p => { backrest(p, 5, 7, 16); seat(p, 5, 21, 12); post(p, 9, 23, 7); base(p, 5, 30, 10); stack(p, 25, 16);
        athlete(p, { head: [10, 8], neck: [10, 12], hip: [10, 20], knee: [17, 20], ankle: [19, 27], shoulder: [10, 14], elbow: [13, 19], hand: [15, 18] });
        pad(p, 11, 17, 6, 2); pad(p, 17, 28, 4, 2); p.line(18, 23, 19, 29, 'm', 1); }
    ],
    legpress: [
      p => { base(p, 1, 30, 30); p.line(2, 27, 11, 11, 'M', 3); p.line(3, 26, 10, 13, 'm', 1); p.rect(1, 27, 9, 2, 'M'); p.rect(1, 26, 9, 1, 'm');
        p.line(9, 1, 31, 23, 'n', 1); p.rect(24, 22, 6, 6, 'G'); p.rect(24, 22, 6, 1, 'n');
        athlete(p, { head: [6, 9], neck: [7, 13], hip: [11, 22], knee: [15, 17], ankle: [19, 14], shoulder: [7, 15], elbow: [9, 20], hand: [13, 22] });
        p.line(17, 8, 25, 16, 'Y', 3); p.line(18, 10, 26, 18, 'y', 1); },
      p => { base(p, 1, 30, 30); p.line(2, 27, 11, 11, 'M', 3); p.line(3, 26, 10, 13, 'm', 1); p.rect(1, 27, 9, 2, 'M'); p.rect(1, 26, 9, 1, 'm');
        p.line(9, 1, 31, 23, 'n', 1); p.rect(24, 22, 6, 6, 'G'); p.rect(24, 22, 6, 1, 'n');
        athlete(p, { head: [6, 9], neck: [7, 13], hip: [11, 22], knee: [18, 15], ankle: [24, 9], shoulder: [7, 15], elbow: [9, 20], hand: [13, 22] });
        p.line(22, 3, 30, 11, 'Y', 3); p.line(23, 5, 31, 13, 'y', 1); }
    ],
    dumbbell: [
      p => { base(p, 4, 30, 24);
        athlete(p, { head: [14, 5], neck: [14, 9], hip: [14, 18], knee: [15, 24], ankle: [15, 29], shoulder: [14, 11], elbow: [17, 16], hand: [19, 20],
          back: { knee: [13, 24], ankle: [12, 29] } });
        p.rect(17, 20, 6, 1, 'n'); p.rect(16, 18, 2, 5, 'G'); p.rect(22, 18, 2, 5, 'G'); },
      p => { base(p, 4, 30, 24);
        athlete(p, { head: [14, 5], neck: [14, 9], hip: [14, 18], knee: [15, 24], ankle: [15, 29], shoulder: [14, 11], elbow: [17, 16], hand: [17, 10],
          back: { knee: [13, 24], ankle: [12, 29] } });
        p.rect(15, 10, 6, 1, 'n'); p.rect(14, 8, 2, 5, 'G'); p.rect(20, 8, 2, 5, 'G'); }
    ],
    barbell: [
      p => { base(p, 4, 30, 24);
        athlete(p, { head: [14, 6], neck: [14, 10], hip: [13, 19], knee: [15, 25], ankle: [15, 29], shoulder: [14, 12], elbow: [17, 10], hand: [17, 8],
          back: { knee: [12, 25], ankle: [11, 29] } });
        p.rect(3, 8, 26, 1, 'n'); p.rect(4, 4, 3, 9, 'G'); p.rect(25, 4, 3, 9, 'G'); },
      p => { base(p, 4, 30, 24);
        athlete(p, { head: [15, 12], neck: [15, 16], hip: [12, 23], knee: [18, 24], ankle: [16, 29], shoulder: [15, 18], elbow: [18, 16], hand: [18, 14],
          back: { knee: [17, 25], ankle: [13, 29] } });
        p.rect(4, 14, 26, 1, 'n'); p.rect(5, 10, 3, 9, 'G'); p.rect(26, 10, 3, 9, 'G'); }
    ],
    body: [
      p => { base(p, 4, 30, 24);
        athlete(p, { head: [15, 5], neck: [15, 9], hip: [15, 18], knee: [16, 24], ankle: [16, 29], shoulder: [15, 11], elbow: [17, 16], hand: [18, 20],
          back: { knee: [13, 24], ankle: [12, 29], elbow: [13, 16], hand: [12, 20] } }); },
      p => { base(p, 4, 30, 24);
        athlete(p, { head: [15, 4], neck: [15, 8], hip: [15, 17], knee: [20, 22], ankle: [21, 28], shoulder: [15, 10], elbow: [19, 6], hand: [21, 1],
          back: { knee: [10, 22], ankle: [9, 28], elbow: [11, 6], hand: [9, 1] } }); }
    ]
  };
  const cache = {};
  function draw(key, frame, opts = {}) {
    const ck = key + ':' + frame + ':' + (opts.sweat ? 1 : 0);
    if (cache[ck]) return cache[ck];
    const fns = SPRITES[key] || SPRITES.body;
    const p = Canvas(32, 32);
    fns[Math.min(frame, fns.length - 1)](p);
    if (opts.sweat && p.head) { const [hx, hy] = p.head; p.set(hx + 5, hy - 2, 'C'); p.rect(hx + 4, hy - 1, 3, 1, 'C'); p.set(hx + 5, hy, 'C'); }
    p.outline('K');
    // to svg rects with horizontal run merging
    let out = '';
    for (let y = 0; y < 32; y++) { let x = 0; while (x < 32) { const c = p.g[y][x]; if (!c) { x++; continue; } let x2 = x; while (x2 + 1 < 32 && p.g[y][x2 + 1] === c) x2++; out += `<rect x="${x}" y="${y}" width="${x2 - x + 1}" height="1" fill="${PAL[c]}"/>`; x = x2 + 1; } }
    cache[ck] = out; return out;
  }
  function svg(key, frame = 0, cls = '', opts) { return `<svg viewBox="0 0 32 32" shape-rendering="crispEdges" class="${cls}">${draw(key, frame, opts)}</svg>`; }
  global.GymSprites = { keys: Object.keys(SPRITES), draw, svg, PAL };
})(typeof window !== 'undefined' ? window : globalThis);
