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
  const lever = (p, x0, y0, x1, y1) => { p.line(x0, y0, x1, y1, 'n', 1); p.dot(x0, y0, 'W', 2); };
  const grip = (p, x, y) => p.rect(x, y - 2, 2, 5, 'Y');
  /* gym80 Sygnum style: rear tower with the weight stack behind the seat (lifted = moving frame) */
  const rearTower = (p, lifted) => { post(p, 5, 6, 24); p.rect(0, 6, 7, 2, 'M'); p.rect(0, 6, 7, 1, 'm'); stack(p, 0, lifted ? 16 : 20); base(p, 0, 30, 8); };
  const chair = (p, bx, by, bh, sx, sw) => { backrest(p, bx, by, bh); seat(p, sx, by + bh, sw); post(p, sx + 4, by + bh + 2, 30 - (by + bh + 2)); base(p, sx - 2, 30, sw + 6); };

  /* front / rear view athlete, seated. q = {head:[x,y], sh:y, hip:y, L:{elbow,hand,knee,ankle}, R:{...}, rear} */
  function athleteFront(p, q) {
    const [hx, hy] = q.head; p.head = q.head;
    const cx = hx, sh = q.sh, hp = q.hip;
    // legs (thighs toward the viewer, so short), shorts, shoes
    for (const side of [q.L, q.R]) {
      if (!side.knee) continue;
      const hx0 = side === q.L ? cx - 2 : cx + 2;
      p.line(hx0, hp, side.knee[0], side.knee[1], 'B', 3);
      p.line(side.knee[0], side.knee[1] + 1, side.ankle[0], side.ankle[1], 'S', 2);
      p.rect(side.ankle[0] - 1, side.ankle[1] + 1, 3, 2, 'W');
    }
    // torso
    p.rect(cx - 4, sh, 8, hp - sh + 1, 'R'); p.rect(cx - 4, sh, 1, hp - sh + 1, 'r'); p.rect(cx + 3, sh, 1, hp - sh + 1, 'r');
    if (q.rear) p.rect(cx - 1, sh + 1, 1, hp - sh - 1, 'r');
    p.rect(cx - 4, hp - 1, 8, 2, 'B');
    // arms
    for (const side of [q.L, q.R]) {
      const sx = side === q.L ? cx - 5 : cx + 4;
      p.line(sx, sh + 1, side.elbow[0], side.elbow[1], 'S', 2);
      p.line(side.elbow[0], side.elbow[1], side.hand[0], side.hand[1], 'S', 2);
      p.dot(sx, sh + 1, 'R', 3);
    }
    // neck + head
    p.rect(cx - 1, hy + 3, 2, sh - hy - 3, 'S');
    p.disc(cx, hy, 3, 'S');
    if (q.rear) p.disc(cx, hy, 3, 'H', (x, y) => y <= hy + 2);
    else { p.disc(cx, hy, 3, 'H', (x, y) => y <= hy - 2); p.set(cx - 1, hy, 'K'); p.set(cx + 1, hy, 'K'); }
    p.line(cx - 3, hy - 1, cx + 3, hy - 1, 'R', 1);
  }
  const frontSeat = p => { p.rect(9, 7, 14, 14, 'M'); p.rect(10, 8, 12, 12, 'G'); p.rect(8, 21, 16, 2, 'M'); p.rect(8, 21, 16, 1, 'm'); post(p, 15, 23, 7); base(p, 6, 30, 20); };
  const seatedLegsApart = { L: { knee: [10, 23], ankle: [9, 28] }, R: { knee: [22, 23], ankle: [23, 28] } };
  const seatedLegsTogether = { L: { knee: [14, 23], ankle: [13, 28] }, R: { knee: [18, 23], ankle: [19, 28] } };
  const handsOnSeat = { L: { elbow: [9, 17], hand: [9, 21] }, R: { elbow: [23, 17], hand: [23, 21] } };
  const fview = (legs, arms) => ({ head: [16, 6], sh: 11, hip: 20, L: { ...legs.L, ...arms.L }, R: { ...legs.R, ...arms.R } });

  const SPRITES = {
    /* gym80 Chest Press: upright seat, lever arms from a pivot above and behind, handles pushed forward */
    chestpress: [0, 1].map(f => p => {
      rearTower(p, f); chair(p, 8, 8, 14, 8, 11); p.rect(5, 3, 10, 2, 'M'); p.rect(5, 3, 10, 1, 'm');
      const hand = f ? [26, 14] : [20, 14];
      lever(p, 13, 4, hand[0], hand[1] - 2);
      athlete(p, { head: [13, 8], neck: [13, 12], hip: [13, 21], knee: [19, 21], ankle: [19, 28], shoulder: [13, 14], elbow: f ? [19, 15] : [15, 18], hand });
      grip(p, hand[0], hand[1]);
    }),
    /* gym80 Leg Extension: seat to the knee, roller on the front of the shin, pivot at the knee */
    legext: [0, 1].map(f => p => {
      rearTower(p, f); chair(p, 8, 7, 14, 8, 12);
      const ankle = f ? [27, 20] : [19, 28];
      athlete(p, { head: [13, 7], neck: [13, 11], hip: [13, 20], knee: [19, 20], ankle, shoulder: [13, 13], elbow: [15, 17], hand: [15, 21] });
      if (f) { lever(p, 19, 20, 25, 17); pad(p, 24, 16, 4, 3); } else { lever(p, 19, 20, 21, 26); pad(p, 21, 25, 3, 4); }
    }),
    /* gym80 Lat Pulldown: tower in front with the stack, thigh pad, bar from the top pulley to the upper chest */
    latpull: [0, 1].map(f => p => {
      post(p, 23, 1, 29); p.rect(10, 0, 15, 2, 'M'); p.rect(10, 0, 15, 1, 'm'); stack(p, 26, f ? 14 : 20); base(p, 6, 30, 26); p.dot(13, 2, 'W', 2);
      seat(p, 7, 22, 12); post(p, 11, 24, 6); post(p, 20, 18, 4); pad(p, 15, 17, 6, 2);
      const hand = f ? [15, 13] : [13, 4];
      p.line(13, 2, hand[0], hand[1] - 1, 'n', 1); p.rect(hand[0] - 3, hand[1] - 1, 7, 1, 'W'); p.rect(hand[0] - 3, hand[1], 1, 2, 'W'); p.rect(hand[0] + 3, hand[1], 1, 2, 'W');
      athlete(p, { head: [12, 9], neck: [12, 13], hip: [12, 22], knee: [19, 21], ankle: [19, 28], shoulder: [12, 15], elbow: f ? [9, 19] : [11, 9], hand });
    }),
    /* gym80 Seated Row (vogatore): chest pad in front, feet on the platform, handles pulled to the pad */
    row: [0, 1].map(f => p => {
      post(p, 25, 6, 24); stack(p, 27, f ? 14 : 20); base(p, 4, 30, 28);
      seat(p, 6, 22, 9); post(p, 9, 24, 6); post(p, 18, 19, 11); pad(p, 16, 10, 3, 9); p.rect(22, 22, 2, 7, 'G');
      const hand = f ? [19, 13] : [24, 13];
      lever(p, 25, 24, hand[0] + 1, hand[1] + 2); grip(p, hand[0], hand[1]);
      athlete(p, { head: [12, 8], neck: [12, 12], hip: [11, 21], knee: [17, 21], ankle: [21, 26], shoulder: [12, 14], elbow: f ? [8, 16] : [18, 14], hand });
    }),
    /* gym80 Abdominal Crunch: pads on the upper chest, lever from above, curl the trunk forward */
    abs: [0, 1].map(f => p => {
      rearTower(p, f); chair(p, 8, 8, 13, 8, 11); p.rect(5, 2, 16, 2, 'M'); p.rect(5, 2, 16, 1, 'm');
      post(p, 20, 26, 4); pad(p, 20, 24, 3, 3);
      if (!f) { lever(p, 19, 3, 17, 12); athlete(p, { head: [13, 8], neck: [13, 12], hip: [13, 21], knee: [19, 21], ankle: [19, 27], shoulder: [13, 14], elbow: [16, 18], hand: [17, 13] }); pad(p, 16, 11, 3, 4); }
      else { lever(p, 19, 3, 21, 14); athlete(p, { head: [19, 12], neck: [17, 15], hip: [13, 21], knee: [19, 21], ankle: [19, 27], shoulder: [17, 16], elbow: [20, 20], hand: [21, 16] }); pad(p, 20, 14, 3, 4); }
    }),
    /* gym80 Lying Leg Curl: face down on the bench, roller on the back of the ankles, heels curled up to the glutes */
    legcurl: [0, 1].map(f => p => {
      post(p, 9, 24, 6); post(p, 23, 24, 6); base(p, 4, 30, 26); p.rect(5, 22, 24, 2, 'M'); p.rect(5, 22, 24, 1, 'm');
      p.rect(15, 21, 6, 1, 'G'); post(p, 27, 24, 3);
      if (f) lever(p, 8, 25, 11, 12); else lever(p, 8, 25, 3, 18);
      athlete(p, { head: [26, 16], neck: [22, 19], hip: [14, 19], knee: [8, 20], ankle: f ? [11, 12] : [2, 20], shoulder: [22, 19], elbow: [24, 23], hand: [27, 25] });
      if (f) pad(p, 10, 9, 4, 3); else pad(p, 1, 16, 4, 3);
    }),
    /* gym80 Seated Leg Press (weight stack): reclined back, feet on a vertical plate that slides forward */
    legpress: [0, 1].map(f => p => {
      base(p, 0, 30, 32); p.rect(16, 27, 15, 1, 'n'); stack(p, 0, f ? 14 : 18); post(p, 6, 24, 6);
      p.line(5, 9, 10, 22, 'M', 3); p.line(6, 9, 11, 22, 'm', 1); seat(p, 8, 23, 8); 
      const px = f ? 27 : 22;
      athlete(p, { head: [7, 10], neck: [8, 14], hip: [12, 22], knee: f ? [19, 20] : [16, 15], ankle: f ? [26, 20] : [21, 20], shoulder: [8, 16], elbow: [10, 20], hand: [13, 24] });
      p.rect(px, 13, 2, 14, 'Y'); p.rect(px + 1, 13, 1, 14, 'y'); p.rect(px - 1, 26, 4, 1, 'G');
    }),
    /* gym80 Biceps Curl: seated, upper arms on the angled pad, curl the handle to the shoulder */
    biccurl: [0, 1].map(f => p => {
      rearTower(p, f); seat(p, 8, 22, 9); post(p, 11, 24, 6); base(p, 8, 30, 20); post(p, 20, 19, 11);
      p.line(15, 14, 22, 18, 'Y', 3); p.line(15, 16, 22, 20, 'y', 1);
      const hand = f ? [18, 10] : [26, 21];
      athlete(p, { head: [12, 7], neck: [13, 11], hip: [12, 21], knee: [18, 22], ankle: [18, 28], shoulder: [13, 13], elbow: [20, 16], hand });
      lever(p, 21, 17, hand[0], hand[1]); p.rect(hand[0] - 1, hand[1] - 1, 3, 3, 'G');
    }),
    /* gym80 Triceps Machine: seated, upper arms on a steep pad, push the handles down until the arms are straight */
    tricep: [0, 1].map(f => p => {
      rearTower(p, f); seat(p, 8, 22, 9); post(p, 11, 24, 6); base(p, 8, 30, 20); post(p, 19, 21, 9);
      p.line(15, 14, 19, 20, 'Y', 3); p.line(16, 15, 20, 21, 'y', 1);
      const hand = f ? [25, 23] : [19, 10];
      athlete(p, { head: [12, 7], neck: [13, 11], hip: [12, 21], knee: [17, 22], ankle: [17, 28], shoulder: [13, 13], elbow: [18, 18], hand });
      lever(p, 19, 19, hand[0], hand[1]); p.rect(hand[0] - 1, hand[1] - 1, 3, 3, 'G');
    }),
    /* gym80 Adductor (front view): pads on the inside of the knees, squeeze the legs together */
    adduct: [0, 1].map(f => p => {
      frontSeat(p);
      athleteFront(p, fview(f ? seatedLegsTogether : seatedLegsApart, handsOnSeat));
      const [l, r] = f ? [14, 18] : [10, 22];
      lever(p, 16, 28, l + 2, 25); lever(p, 16, 28, r - 2, 25);
      pad(p, l + 1, 21, 2, 4); pad(p, r - 2, 21, 2, 4);
    }),
    /* gym80 Abductor (front view): pads on the outside of the knees, push the legs apart */
    abduct: [0, 1].map(f => p => {
      frontSeat(p);
      athleteFront(p, fview(f ? seatedLegsApart : seatedLegsTogether, handsOnSeat));
      const [l, r] = f ? [10, 22] : [14, 18];
      lever(p, 16, 29, l - 3, 26); lever(p, 16, 29, r + 3, 26);
      pad(p, l - 4, 21, 2, 5); pad(p, r + 3, 21, 2, 5);
    }),
    /* gym80 Lateral Raise (front view): pads on the outside of the elbows, raise the arms to shoulder height */
    latraise: [0, 1].map(f => p => {
      frontSeat(p);
      const arms = f ? { L: { elbow: [5, 12], hand: [4, 14] }, R: { elbow: [27, 12], hand: [28, 14] } }
                     : { L: { elbow: [10, 17], hand: [10, 19] }, R: { elbow: [22, 17], hand: [22, 19] } };
      athleteFront(p, fview(seatedLegsTogether, arms));
      if (f) { lever(p, 11, 9, 5, 10); lever(p, 21, 9, 27, 10); pad(p, 3, 9, 4, 2); pad(p, 26, 9, 4, 2); }
      else { lever(p, 11, 9, 8, 16); lever(p, 21, 9, 24, 16); pad(p, 7, 15, 2, 5); pad(p, 24, 15, 2, 5); }
    }),
    /* gym80 Butterfly Reverse (rear view): chest on the pad, open the straight arms out to the sides */
    revfly: [0, 1].map(f => p => {
      post(p, 15, 0, 7); p.dot(16, 2, 'W', 2); p.rect(8, 21, 16, 2, 'M'); p.rect(8, 21, 16, 1, 'm'); post(p, 15, 23, 7); base(p, 6, 30, 20);
      const arms = f ? { L: { elbow: [6, 12], hand: [2, 12] }, R: { elbow: [26, 12], hand: [30, 12] } }
                     : { L: { elbow: [10, 13], hand: [11, 14] }, R: { elbow: [22, 13], hand: [21, 14] } };
      if (f) { lever(p, 16, 2, 2, 10); lever(p, 16, 2, 30, 10); } else { lever(p, 16, 2, 12, 12); lever(p, 16, 2, 20, 12); }
      athleteFront(p, { head: [16, 6], sh: 11, hip: 20, rear: true, L: arms.L, R: arms.R });
      if (f) { grip(p, 1, 12); grip(p, 29, 12); }
    }),
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
  /* best drawing for an exercise name (gym80 machine names, Italian or English) */
  function guess(name) {
    const n = String(name || '').toLowerCase();
    if (/later|alzat|lateral raise/.test(n)) return 'latraise';
    if (/reverse|revers|rear delt|deltoid|post/.test(n)) return 'revfly';
    if (/abdu|abdut/.test(n) && /out|fuori|ester|apri/.test(n)) return 'abduct';
    if (/addu|addut/.test(n)) return 'adduct';
    if (/abdu|abdut/.test(n)) return /in\b|dentro|intern|chiud/.test(n) ? 'adduct' : 'adduct';
    if (/leg ?press|pressa/.test(n)) return 'legpress';
    if (/leg ?ext|estens|quadric/.test(n)) return 'legext';
    if (/leg ?curl|femoral/.test(n)) return 'legcurl';
    if (/bicip|bicep/.test(n)) return 'biccurl';
    if (/tricip|tricep|dip/.test(n)) return 'tricep';
    if (/vogator|row|rematore|pulley/.test(n)) return 'row';
    if (/\blat\b|lat machine|pulldown|lat ?pull/.test(n)) return 'latpull';
    if (/abdom|addom|crunch|\babs?\b/.test(n)) return 'abs';
    if (/chest|petto|panca|bench/.test(n)) return 'chestpress';
    return null;
  }
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
  global.GymSprites = { keys: Object.keys(SPRITES), draw, svg, PAL, guess };
})(typeof window !== 'undefined' ? window : globalThis);
