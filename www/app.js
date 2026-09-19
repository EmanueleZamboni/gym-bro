'use strict';
/* =========================== pixel icons (8x8) =========================== */
const ICONS = {
  pen:   ['......##','.....#.#','....#.#.','...#.#..','..#.#...','.##.#...','.#.##...','####....'],
  gear:  ['..####..','.#....#.','##.##.##','#.#..#.#','#.#..#.#','##.##.##','.#....#.','..####..'],
  x:     ['##....##','.##..##.','..####..','...##...','..####..','.##..##.','##....##','........'],
  up:    ['...##...','..####..','.######.','########','...##...','...##...','...##...','...##...'],
  down:  ['...##...','...##...','...##...','...##...','########','.######.','..####..','...##...'],
  plus:  ['...##...','...##...','...##...','########','########','...##...','...##...','...##...'],
  minus: ['........','........','........','########','########','........','........','........'],
  check: ['.......#','......##','.....##.','#...##..','##.##...','.###....','..#.....','........'],
  play:  ['#.......','###.....','#####...','#######.','#######.','#####...','###.....','#.......'],
  log:   ['##.#####','........','##.#####','........','##.#####','........','##.#####','........']
};
const icon = (k, color = 'currentColor') => `<svg class="icon" viewBox="0 0 8 8" shape-rendering="crispEdges">${ICONS[k].map((r, y) => { let o = ''; for (let x = 0; x < 8; x++) if (r[x] === '#') o += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`; return o; }).join('')}</svg>`;

/* =========================== i18n =========================== */
const I18N = {
  en: { select: 'STAGE SELECT', clear: 'CLEAR', edit: 'EDIT', editTitle: 'EDIT EXERCISE', addTitle: 'NEW EXERCISE', settings: 'OPTIONS', sets: 'sets', reps: 'reps', set: 'SET',
    done: 'DONE', rest: 'REST', resting: 'RESTING', ready: 'READY?', go: 'GO!!', hit: 'HIT!', last: 'LAST ONE!', stageClear: 'STAGE CLEAR', allClear: 'ALL CLEAR!', volume: 'VOLUME',
    skip: 'SKIP', newWorkout: 'NEW WORKOUT', addExercise: 'ADD EXERCISE', save: 'SAVE', delete: 'DELETE', code: 'CODE', name: 'NAME', kg: 'WEIGHT (KG)',
    restOverride: 'REST FOR THIS EXERCISE', useDefault: 'default', notes: 'NOTES', sprite: 'SPRITE', restDefault: 'REST TIME',
    restDefaultSub: 'Countdown after every DONE', sound: 'SOUND', soundSub: 'Only HIT, the bell, 3-2-1 and GO. Short clips, so your music ducks instead of stopping.', vibration: 'RUMBLE',
    notify: 'STATUS BAR TIMER', notifySub: 'Countdown in the notification shade while you rest, and an alarm notification at zero. Rings even if the app is in the background.',
    cancel: 'CANCEL', log: 'LOG', workouts: 'WORKOUTS', changes: 'CHANGES', total: 'TOTAL', thisMonth: 'THIS MONTH', perWeek: 'PER WEEK', exercisesN: 'EXERCISES', noWorkouts: 'NO WORKOUTS YET.<br>CLEAR AN EXERCISE AND IT LANDS HERE.', addPastDay: 'ADD PAST DAY', again: 'DO AGAIN?', continueLbl: 'CONTINUE', newWorkoutConfirm: "Reset today's ticks? The workout history keeps today's exercises.", noDetails: 'NO DETAILS', date: 'DATE', pickExercises: 'EXERCISES DONE (OPTIONAL)', deleteDay: 'Delete this gym day?', gymDay: 'GYM DAY', logEmpty: 'NO CHANGES YET.<br>EDITS SHOW UP HERE.', logClear: 'CLEAR LOG', logClearConfirm: 'Delete the whole log?', added: 'ADDED', deleted: 'DELETED', today: 'TODAY', yesterday: 'YESTERDAY', keepAwake: 'SCREEN ON', keepAwakeSub: 'While an exercise is open',
    crt: 'CRT SCANLINES', crtSub: 'Retro monitor look', language: 'LANGUAGE', resetData: 'RESTORE DEFAULT EXERCISES', install: 'INSTALL APP', installSub: 'Add to home screen, full screen and offline',
    empty: 'NO STAGES YET.<br>ADD ONE FROM EDIT.', deleteConfirm: 'Delete this exercise?', resetConfirm: 'Replace all exercises with the defaults?', exercise: 'EXERCISE',
    hint: '▲▼ SELECT STAGE · TAP TO START', tapDone: 'TAP DONE AFTER EACH SET', notifTitle: 'Rest over', notifBody: 'GO! Next set', exit: 'EXIT', of: 'OF', on: 'ON', off: 'OFF',
    round: 'SET', clearedToday: 'CLEAR TODAY' },
  it: { select: 'SCEGLI ESERCIZIO', clear: 'FATTO', edit: 'MODIFICA', editTitle: 'MODIFICA ESERCIZIO', addTitle: 'NUOVO ESERCIZIO', settings: 'OPZIONI', sets: 'serie', reps: 'rip', set: 'SERIE',
    done: 'FATTO', rest: 'RIPOSO', resting: 'RIPOSO', ready: 'PRONTO?', go: 'VIA!!', hit: 'BOOM!', last: "L'ULTIMA!", stageClear: 'ESERCIZIO OK', allClear: 'TUTTO FATTO!', volume: 'VOLUME',
    skip: 'SALTA', newWorkout: 'NUOVO ALLENAMENTO', addExercise: 'AGGIUNGI ESERCIZIO', save: 'SALVA', delete: 'ELIMINA', code: 'CODICE', name: 'NOME', kg: 'PESO (KG)',
    restOverride: 'RIPOSO PER QUESTO ESERCIZIO', useDefault: 'predefinito', notes: 'NOTE', sprite: 'SPRITE', restDefault: 'TEMPO DI RIPOSO',
    restDefaultSub: 'Conto alla rovescia dopo ogni FATTO', sound: 'SUONO', soundSub: 'Solo FATTO, campana, 3-2-1 e VIA. Clip brevi: la musica si abbassa invece di fermarsi.', vibration: 'VIBRAZIONE',
    notify: 'TIMER NELLA BARRA', notifySub: 'Conto alla rovescia nelle notifiche durante il riposo e notifica di allarme a zero. Suona anche con l\'app in background.',
    cancel: 'ANNULLA', log: 'REGISTRO', workouts: 'ALLENAMENTI', changes: 'MODIFICHE', total: 'TOTALE', thisMonth: 'QUESTO MESE', perWeek: 'A SETTIMANA', exercisesN: 'ESERCIZI', noWorkouts: 'NESSUN ALLENAMENTO.<br>COMPLETA UN ESERCIZIO E APPARE QUI.', addPastDay: 'AGGIUNGI GIORNO', again: 'RIFARE?', continueLbl: 'CONTINUA', newWorkoutConfirm: 'Azzerare le spunte di oggi? Lo storico degli allenamenti resta.', noDetails: 'SENZA DETTAGLI', date: 'DATA', pickExercises: 'ESERCIZI FATTI (FACOLTATIVO)', deleteDay: 'Eliminare questo giorno di palestra?', gymDay: 'PALESTRA', logEmpty: 'ANCORA NIENTE.<br>LE MODIFICHE FINISCONO QUI.', logClear: 'SVUOTA REGISTRO', logClearConfirm: 'Cancellare tutto il registro?', added: 'AGGIUNTO', deleted: 'ELIMINATO', today: 'OGGI', yesterday: 'IERI', keepAwake: 'SCHERMO ACCESO', keepAwakeSub: 'Mentre un esercizio è aperto',
    crt: 'SCANLINE CRT', crtSub: 'Effetto monitor retro', language: 'LINGUA', resetData: 'RIPRISTINA ESERCIZI', install: 'INSTALLA APP', installSub: 'Aggiungi alla Home, a tutto schermo e offline',
    empty: 'NESSUN ESERCIZIO.<br>AGGIUNGILO DA MODIFICA.', deleteConfirm: 'Eliminare questo esercizio?', resetConfirm: 'Sostituire tutti gli esercizi con quelli predefiniti?', exercise: 'ESERCIZIO',
    hint: '▲▼ SCEGLI · TOCCA PER INIZIARE', tapDone: 'PREMI FATTO DOPO OGNI SERIE', notifTitle: 'Riposo finito', notifBody: 'VIA! Prossima serie', exit: 'ESCI', of: 'DI', on: 'ON', off: 'OFF',
    round: 'SERIE', clearedToday: 'FATTI OGGI' }
};
const t = k => (I18N[state.settings.lang] || I18N.en)[k] ?? k;

/* =========================== state =========================== */
const DEFAULT_EXERCISES = [
  { code: 'A01', name: 'Vertical Chest Press', sets: 4, reps: 10, kg: 40, diagram: 'chestpress', notes: 'Riesco' },
  { code: 'E04', name: 'Leg Extension Machine', sets: 4, reps: 10, kg: 35, diagram: 'legext', notes: 'Sopra il piede zona tibia, cuscinetto indietro, sedile fino al ginocchio, piede a martello' },
  { code: 'B02', name: 'Lat Machine', sets: 4, reps: 10, kg: 45, diagram: 'latpull', notes: 'A malapena' },
  { code: 'B01', name: 'Vogatore a tiraggio centrale', sets: 4, reps: 10, kg: 35, diagram: 'row', notes: '40 kg mi fa male, tengo 35' },
  { code: 'F10', name: 'Abdominal Machine', sets: 4, reps: 12, kg: 45, diagram: 'abs', notes: 'A malapena' },
  { code: 'E05', name: 'Leg Curl Machine', sets: 4, reps: 10, kg: 40, diagram: 'legcurl', notes: '' },
  { code: 'E01', name: 'Leg Press', sets: 4, reps: 10, kg: 85, diagram: 'legpress', notes: 'Appena alzato' }
];
const KEY = 'gymbro.v1';
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);
const freshExercises = () => DEFAULT_EXERCISES.map(e => ({ id: uid(), rest: null, doneSets: 0, ...e }));
let state = load();
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.exercises) { s.settings = { crt: true, ...s.settings }; s.log = s.log || [];
    if (!s.history) { s.history = {}; for (const l of [...s.log].reverse()) if (l.kind === 'clear' && l.to) historyAdd(s, l.t, { code: l.code, name: l.name, ...l.to }); }
    if (!s.settings.notifyV2) { s.settings.notify = true; s.settings.notifyV2 = true; }
    seedKnownDays(s); return s; } } catch (e) {}
  return seedKnownDays({ log: [], history: {}, settings: { rest: 90, sound: true, vibrate: true, notify: true, notifyV2: true, wake: true, crt: true, lang: (navigator.language || 'en').startsWith('it') ? 'it' : 'en' }, exercises: freshExercises(), day: today() });
}
/* the owner's first three gym days, entered by hand before the history existed */
function seedKnownDays(st) {
  if (st.seeded0919) return st;
  for (const d of ['2026-09-15', '2026-09-17', '2026-09-19']) if (!st.history[d]) st.history[d] = [];
  st.seeded0919 = true; return st;
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
function dayCheck() { if (state.day !== today()) { state.exercises.forEach(e => e.doneSets = 0); state.day = today(); save(); } }
const restOf = e => (e.rest && e.rest > 0) ? e.rest : state.settings.rest;
const isDone = e => e.doneSets >= e.sets;
const dayOf = ts => { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
function historyAdd(st, ts, ex) {
  const day = dayOf(ts), list = (st.history[day] = st.history[day] || []);
  const i = list.findIndex(x => x.code === ex.code && x.name === ex.name);
  const entry = { t: ts, code: ex.code, name: ex.name, reps: ex.reps, sets: ex.sets, kg: ex.kg };
  if (i >= 0) list[i] = entry; else list.push(entry);
}
function logAdd(e, kind, from, to) {
  state.log.unshift({ t: Date.now(), code: e.code, name: e.name, kind, from, to });
  if (state.log.length > 600) state.log.length = 600;
}

/* =========================== native bridge (Android APK) =========================== */
const NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const RT = NATIVE ? window.Capacitor.registerPlugin('RestTimer') : null;
function nativeArm() {
  if (!RT || !S.ex || S.phase !== 'rest') return;
  const e = S.ex, next = Math.min(e.sets, e.doneSets + 1);
  RT.start({ endAt: S.endAt, title: `${t('rest')} · ${e.name}`, body: `${t('set')} ${next}/${e.sets} · ${e.reps} ${t('reps')} · ${e.kg} KG`,
    goTitle: `${t('go')} ${e.name}`, goBody: `${t('set')} ${next}/${e.sets} · ${e.reps} ${t('reps')} · ${e.kg} KG` }).catch(() => {});
}
function nativeDisarm() { if (RT) RT.cancel().catch(() => {}); }

/* =========================== helpers =========================== */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sfx = n => { if (state.settings.sound) Sfx.play(n); };
const buzz = p => { if (state.settings.vibrate && navigator.vibrate) { try { navigator.vibrate(p); } catch (e) {} } };
let toastT;
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 2200); }
function flash(yellow) { const f = $('#flash'); f.classList.remove('on'); f.classList.toggle('yellow', !!yellow); void f.offsetWidth; f.classList.add('on'); }
function shake() { const f = $('#fight'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); }

/* history-backed layers so the Android back button closes things */
const layers = [];
function pushLayer(name, close) { layers.push({ name, close }); history.pushState({ layer: name }, ''); }
function popLayer() { if (layers.length) history.back(); }
window.addEventListener('popstate', () => { const l = layers.pop(); if (l) l.close(); });

/* tile wipe transition (Mega Drive style) */
const wipeEl = $('#wipe');
function wipe(mid) {
  const T = 44, cols = Math.ceil(innerWidth / T), rows = Math.ceil(innerHeight / T);
  wipeEl.style.gridTemplateColumns = `repeat(${cols},${T}px)`; wipeEl.style.gridTemplateRows = `repeat(${rows},${T}px)`;
  let h = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) h += `<i style="transition-delay:${(c + r) * 12}ms"></i>`;
  wipeEl.innerHTML = h;
  const total = (cols + rows) * 12 + 130;
  wipeEl.classList.add('in');
  setTimeout(() => { mid(); setTimeout(() => { wipeEl.classList.remove('in'); setTimeout(() => { wipeEl.innerHTML = ''; }, total); }, 60); }, total);
}

/* =========================== list (stage select) =========================== */
let mode = 'list';
const sprite = (k, f = 0, opts) => GymSprites.svg(k, f, '', opts);
function renderList() {
  dayCheck();
  const el = $('#list'), ex = state.exercises, doneCount = ex.filter(isDone).length;
  $('#subtitle').innerHTML = `<b>${doneCount}/${ex.length}</b> ${t('clearedToday')}`;
  if (!ex.length) { el.innerHTML = `<div class="empty">${t('empty')}</div>`; return; }
  el.innerHTML = `<div class="stages">${ex.map((e, i) => `
    <button class="stage ${isDone(e) ? 'done' : ''}" data-id="${e.id}" style="--i:${i}">
      <div class="sbox">${sprite(e.diagram, 0)}</div>
      <div>
        <span class="scode">${esc(e.code || '—')}</span>
        <div class="sname">${esc(e.name)}</div>
        <div class="sspec"><b>${e.sets}</b>${t('sets')}</div>
        ${e.doneSets > 0 && !isDone(e) ? `<div class="cont">▶ ${t('continueLbl')} ${e.doneSets + 1}/${e.sets}</div>` : ''}
      </div>
      <div class="skg">${e.reps}<small>${t('reps')}</small></div>
      <div class="skg kg">${e.kg}<small>KG</small></div>
      ${isDone(e) ? `<div class="stamp-clear">${t('clear')}!</div>` : ''}
    </button>`).join('')}</div>
    ${doneCount ? `<div class="center"><button class="btn cyan" id="btnNewWorkout">${t('newWorkout')}</button></div>` : ''}`;
  el.querySelectorAll('.stage').forEach(c => c.addEventListener('click', () => openSession(c.dataset.id)));
  const nw = $('#btnNewWorkout');
  if (nw) nw.addEventListener('click', () => { if (!confirm(t('newWorkoutConfirm'))) return; state.exercises.forEach(e => e.doneSets = 0); save(); renderList(); });
}

/* =========================== edit =========================== */
function renderEdit() {
  const el = $('#edit'), ex = state.exercises;
  $('#subtitle').innerHTML = t('edit');
  el.innerHTML = `<div class="stages">${ex.map((e, i) => `
    <div class="row" data-id="${e.id}" style="--i:${i}">
      <div class="sbox">${sprite(e.diagram, 0)}</div>
      <div><div class="sname">${esc(e.name)}</div><div class="sspec">${esc(e.code)} · ${e.reps}×${e.sets} · <b>${e.kg} kg</b>${e.rest ? ` · ${e.rest}s` : ''}</div></div>
      <div class="acts">
        <button class="btn grey sq" data-act="up" ${i === 0 ? 'disabled' : ''}>${icon('up')}</button>
        <button class="btn grey sq" data-act="down" ${i === ex.length - 1 ? 'disabled' : ''}>${icon('down')}</button>
        <button class="btn sq" data-act="edit">${icon('pen')}</button>
      </div>
    </div>`).join('')}</div>
    <div class="center"><button class="btn cyan" id="btnAdd">${icon('plus')} ${t('addExercise')}</button></div>`;
  el.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', ev => {
    const id = ev.currentTarget.closest('.row').dataset.id, i = ex.findIndex(x => x.id === id), act = ev.currentTarget.dataset.act;
    if (act === 'edit') { return openForm(id); }
    const j = act === 'up' ? i - 1 : i + 1; if (j < 0 || j >= ex.length) return;
    [ex[i], ex[j]] = [ex[j], ex[i]]; save();
    renderEdit(); el.querySelectorAll('.row').forEach(r => r.style.animation = 'none'); el.querySelector(`[data-id="${id}"]`).classList.add('bump');
  }));
  $('#btnAdd').addEventListener('click', () => { openForm(null); });
}
function setMode(m) {
  mode = m;
  $('#list').classList.toggle('hidden', m !== 'list');
  $('#edit').classList.toggle('hidden', m !== 'edit');
  $('#btnEdit').innerHTML = m === 'edit' ? icon('check') : icon('pen');
  $('#btnEdit').classList.toggle('grey', m !== 'edit');
  if (m === 'edit') renderEdit(); else renderList();
}
$('#btnEdit').addEventListener('click', () => { setMode(mode === 'edit' ? 'list' : 'edit'); });
$('#btnSettings').innerHTML = icon('gear');

$('#btnClose').innerHTML = icon('x');
$('#dlgClose').innerHTML = icon('x');

/* =========================== dialog =========================== */
let dlgOpen = false;
function openDlg(title, body, foot = '') {
  $('#dlgTitle').textContent = title; $('#dlgBody').innerHTML = body; $('#dlgFoot').innerHTML = foot;
  $('#dlg').classList.add('open'); $('#backdrop').classList.add('open'); $('#dlg').scrollTop = 0;
  if (!dlgOpen) { dlgOpen = true; pushLayer('dlg', closeDlgNow); }
}
function closeDlgNow() { dlgOpen = false; $('#dlg').classList.remove('open'); $('#backdrop').classList.remove('open'); }
function closeDlg() { if (dlgOpen) popLayer(); }
$('#backdrop').addEventListener('click', () => { closeDlg(); });
$('#dlgClose').addEventListener('click', () => { closeDlg(); });

const stepper = (id, val, min, max, step) => `<div class="stepper"><button type="button" class="btn grey sq" data-d="-1">${icon('minus')}</button><input type="number" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" inputmode="decimal"><button type="button" class="btn grey sq" data-d="1">${icon('plus')}</button></div>`;
function wireSteppers(root) {
  root.querySelectorAll('.stepper').forEach(s => {
    const inp = s.querySelector('input'), step = parseFloat(inp.step) || 1;
    s.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      let v = (parseFloat(inp.value) || 0) + step * parseInt(b.dataset.d);
      v = Math.max(parseFloat(inp.min), Math.min(parseFloat(inp.max), v));
      inp.value = Math.round(v * 100) / 100; inp.dispatchEvent(new Event('input'));
    }));
  });
}
function openForm(id) {
  const e = id ? state.exercises.find(x => x.id === id) : { code: '', name: '', sets: 4, reps: 10, kg: 20, rest: null, notes: '', diagram: 'body' };
  let diagram = e.diagram;
  openDlg(id ? t('editTitle') : t('addTitle'), `
    <div class="grid2" style="grid-template-columns:1fr 2fr">
      <div class="field"><label>${t('code')}</label><input type="text" id="fCodeI" value="${esc(e.code)}" maxlength="6" autocapitalize="characters"></div>
      <div class="field"><label>${t('name')}</label><input type="text" id="fNameI" value="${esc(e.name)}" maxlength="40"></div>
    </div>
    <div class="grid2">
      <div class="field"><label>${t('reps')}</label>${stepper('fReps', e.reps, 1, 100, 1)}</div>
      <div class="field"><label>${t('sets')}</label>${stepper('fSets', e.sets, 1, 20, 1)}</div>
    </div>
    <div class="field"><label>${t('kg')}</label>${stepper('fKg', e.kg, 0, 999, 2.5)}</div>
    <div class="field"><label>${t('restOverride')} <span id="fRestLbl"></span></label>${stepper('fRest', e.rest || 0, 0, 600, 15)}</div>
    <div class="field"><label>${t('sprite')}</label><div class="pick" id="fPick">${GymSprites.keys.map(k => `<button type="button" data-k="${k}" class="${k === diagram ? 'sel' : ''}">${sprite(k, 0)}</button>`).join('')}</div></div>
    <div class="field"><label>${t('notes')}</label><textarea id="fNotesI">${esc(e.notes)}</textarea></div>`,
    `${id ? `<button class="btn red" id="fDelete">${t('delete')}</button>` : ''}<button class="btn" id="fSave">${t('save')}</button>`);
  const body = $('#dlgBody'); wireSteppers(body);
  body.querySelectorAll('#fPick button').forEach(b => b.addEventListener('click', () => {
    diagram = b.dataset.k; body.querySelectorAll('#fPick button').forEach(x => x.classList.toggle('sel', x === b)); 
  }));
  const restLbl = () => { const v = parseInt($('#fRest').value) || 0; $('#fRestLbl').textContent = v ? `· ${v}s` : `· ${t('useDefault')} ${state.settings.rest}s`; };
  $('#fRest').addEventListener('input', restLbl); restLbl();
  $('#fSave').addEventListener('click', () => {
    const data = { code: $('#fCodeI').value.trim().toUpperCase(), name: $('#fNameI').value.trim() || t('exercise'),
      reps: Math.max(1, parseInt($('#fReps').value) || 1), sets: Math.max(1, parseInt($('#fSets').value) || 1),
      kg: Math.max(0, parseFloat($('#fKg').value) || 0), rest: (parseInt($('#fRest').value) || 0) || null, notes: $('#fNotesI').value.trim(), diagram };
    if (id) {
      for (const k of ['kg', 'reps', 'sets', 'rest']) if ((e[k] || 0) !== (data[k] || 0)) logAdd({ ...e, ...data }, k, e[k] || 0, data[k] || 0);
      Object.assign(e, data); if (e.doneSets > e.sets) e.doneSets = e.sets;
    } else { const ne = { id: uid(), doneSets: 0, ...data }; state.exercises.push(ne); logAdd(ne, 'add'); }
    save(); closeDlg(); renderEdit();
  });
  const del = $('#fDelete');
  if (del) del.addEventListener('click', () => { if (confirm(t('deleteConfirm'))) { logAdd(e, 'del'); state.exercises = state.exercises.filter(x => x.id !== id); save(); closeDlg(); renderEdit(); } });
}

let deferredInstall = null;
window.addEventListener('beforeinstallprompt', ev => { ev.preventDefault(); deferredInstall = ev; });
function openSettings() {
  const s = state.settings;
  const tog = (k, on, a = t('on'), b = t('off')) => `<button class="toggle ${on ? '' : 'off'}" data-k="${k}"><span>◄</span> ${on ? a : b} <span>►</span></button>`;
  openDlg(t('settings'), `
    <div class="opt"><div><div class="lab">${t('restDefault')}</div><div class="sub">${t('restDefaultSub')}</div></div><div style="width:160px">${stepper('sRest', s.rest, 5, 600, 5)}</div></div>
    <div class="opt"><div><div class="lab">${t('sound')}</div><div class="sub">${t('soundSub')}</div></div>${tog('sound', s.sound)}</div>
    <div class="opt"><div><div class="lab">${t('vibration')}</div></div>${tog('vibrate', s.vibrate)}</div>
    ${NATIVE ? '' : `<div class="opt"><div><div class="lab">${t('notify')}</div><div class="sub">${t('notifySub')}</div></div>${tog('notify', s.notify)}</div>`}
    <div class="opt"><div><div class="lab">${t('keepAwake')}</div><div class="sub">${t('keepAwakeSub')}</div></div>${tog('wake', s.wake)}</div>
    <div class="opt"><div><div class="lab">${t('crt')}</div><div class="sub">${t('crtSub')}</div></div>${tog('crt', s.crt)}</div>
    <div class="opt"><div><div class="lab">${t('language')}</div></div>${tog('lang', s.lang === 'en', 'EN', 'IT').replace('class="toggle off"', 'class="toggle"')}</div>
    ${deferredInstall ? `<div class="opt"><div><div class="lab">${t('install')}</div><div class="sub">${t('installSub')}</div></div><button class="btn cyan" id="sInstall">${t('install')}</button></div>` : ''}
    <div class="center"><button class="btn red" id="sReset" style="font-size:9px">${t('resetData')}</button></div>`);
  const body = $('#dlgBody'); wireSteppers(body);
  $('#sRest').addEventListener('input', ev => { const v = parseInt(ev.target.value); if (v >= 5) { s.rest = v; save(); } });
  body.querySelectorAll('.toggle').forEach(b => b.addEventListener('click', async () => {
    const k = b.dataset.k;
    if (k === 'lang') { s.lang = s.lang === 'en' ? 'it' : 'en'; document.documentElement.lang = s.lang; save(); openSettings(); if (mode === 'edit') renderEdit(); else renderList(); return; }
    s[k] = !s[k];
    if (k === 'notify' && s.notify) {
      if (!('Notification' in window)) s.notify = false;
      else if (Notification.permission !== 'granted') { const p = await Notification.requestPermission(); if (p !== 'granted') s.notify = false; }
    }
    if (k === 'crt') document.body.classList.toggle('crt', s.crt);
    save(); openSettings();
  }));
  const inst = $('#sInstall');
  if (inst) inst.addEventListener('click', async () => { if (!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; closeDlg(); });
  $('#sReset').addEventListener('click', () => { if (confirm(t('resetConfirm'))) { state.exercises = freshExercises(); save(); closeDlg(); setMode('list'); } });
}
$('#btnSettings').addEventListener('click', () => { openSettings(); });

let logTab = 'workouts';
function dayLabel(d) {
  const td = dayOf(Date.now()), y = dayOf(Date.now() - 864e5);
  if (d === td) return t('today'); if (d === y) return t('yesterday');
  const [Y, M, D] = d.split('-'); const wd = new Date(+Y, +M - 1, +D).toLocaleDateString(state.settings.lang === 'it' ? 'it-IT' : 'en-GB', { weekday: 'short' }).toUpperCase().replace('.', '');
  return `${wd} ${D}/${M}${+Y !== new Date().getFullYear() ? '/' + Y : ''}`;
}
function renderWorkouts() {
  const days = Object.keys(state.history).sort().reverse();
  const addBtn = `<div class="center" style="margin:8px 0 4px"><button class="btn grey" id="addDay" style="font-size:8px;min-height:40px">${t('addPastDay')}</button></div>`;
  if (!days.length) return addBtn + `<div class="empty">${t('noWorkouts')}</div>`;
  const now = new Date(), ym = dayOf(now.getTime()).slice(0, 7);
  const thisMonth = days.filter(d => d.startsWith(ym)).length;
  const weeks = 16, msDay = 864e5;
  // calendar: 16 columns of weeks, 7 rows Mon..Sun, ending this week
  const todayD = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dow = (todayD.getDay() + 6) % 7; // Mon = 0
  const start = new Date(todayD.getTime() - (dow + (weeks - 1) * 7) * msDay);
  const set = new Set(days);
  let cal = '';
  for (let r = 0; r < 7; r++) for (let c = 0; c < weeks; c++) {
    const d = new Date(start.getTime() + (c * 7 + r) * msDay), k = dayOf(d.getTime());
    const cls = d > todayD ? 'fut' : set.has(k) ? 'on' : ''; cal += `<i class="${cls} ${k === dayOf(now.getTime()) ? 'td' : ''}" style="grid-area:${r + 1}/${c + 1}"></i>`;
  }
  const inWindow = days.filter(d => d >= dayOf(start.getTime())).length;
  const perWeek = (inWindow / weeks).toFixed(1);
  const rows = days.map(d => {
    const list = state.history[d], vol = list.reduce((a, x) => a + x.kg * x.reps * x.sets, 0);
    return `<div class="wday" data-day="${d}"><div class="wh"><b>${dayLabel(d)}</b><span>${list.length ? `${list.length} ${t('exercisesN')} · <em>${vol}</em> KG` : `${t('gymDay')} · ${t('noDetails')}`}<button class="wdel" data-del="${d}" aria-label="delete">${icon('x')}</button></span></div>
      ${list.map(x => `<div class="wrow"><span class="lc">${esc(x.code || '—')}</span><span class="wn">${esc(x.name)}</span><span class="n">${x.reps}×${x.sets}</span><span class="n kg">${x.kg}<small>KG</small></span></div>`).join('')}</div>`;
  }).join('');
  return `<div class="tiles"><div class="tile"><b>${days.length}</b><small>${t('total')}</small></div><div class="tile"><b>${thisMonth}</b><small>${t('thisMonth')}</small></div><div class="tile"><b>${perWeek}</b><small>${t('perWeek')}</small></div></div>
    <div class="cal" style="grid-template-columns:repeat(${weeks},1fr)">${cal}</div>${rows}${addBtn}`;
}
function renderAddDay() {
  return `<div class="field"><label>${t('date')}</label><input type="date" id="adDate" value="${dayOf(Date.now())}" max="${dayOf(Date.now())}"></div>
    <div class="field"><label>${t('pickExercises')}</label><div class="picklist">${state.exercises.map(e => `<button type="button" class="pk" data-id="${e.id}"><span class="lc">${esc(e.code || '—')}</span><span class="wn">${esc(e.name)}</span><span class="n">${e.reps}×${e.sets} · ${e.kg}KG</span></button>`).join('')}</div></div>
    <div class="dlg-btns"><button class="btn grey" id="adCancel">${t('cancel')}</button><button class="btn" id="adSave">${t('save')}</button></div>`;
}
function renderChanges() {
  const days = {};
  for (const l of state.log) { const d = dayOf(l.t); (days[d] = days[d] || []).push(l); }
  const row = l => {
    const hh = new Date(l.t).toTimeString().slice(0, 5);
    let body;
    if (l.kind === 'clear') body = `<span class="lk">${t('clear')}</span><span class="n">${l.to.reps}×${l.to.sets}</span> · <span class="n">${l.to.kg}</span> KG`;
    else if (l.kind === 'add') body = `<span class="lk">${t('added')}</span>${esc(l.name)}`;
    else if (l.kind === 'del') body = `<span class="lk">${t('deleted')}</span>${esc(l.name)}`;
    else { const up = l.to > l.from; body = `<span class="lk">${l.kind === 'kg' ? 'KG' : l.kind === 'rest' ? t('rest') : t(l.kind).toUpperCase()}</span><span class="n">${l.from}</span> → <b class="n ${up ? 'up' : 'dn'}">${l.to}</b>`; }
    return `<div class="logrow"><span class="lc ${l.kind === 'clear' ? 'clear' : l.kind === 'del' ? 'del' : ''}">${esc(l.code || '—')}</span><div>${body}<span class="ln">${hh} · ${esc(l.name)}</span></div></div>`;
  };
  return state.log.length ? Object.keys(days).sort().reverse().map(d => `<div class="logday">${dayLabel(d)}</div>${days[d].map(row).join('')}`).join('') : `<div class="empty">${t('logEmpty')}</div>`;
}
function openLog(tab) {
  if (tab) logTab = tab;
  const tabs = `<div class="tabs"><button class="${logTab === 'workouts' ? 'on' : ''}" data-tab="workouts">${t('workouts')}</button><button class="${logTab === 'changes' ? 'on' : ''}" data-tab="changes">${t('changes')}</button></div>`;
  const content = logTab === 'workouts' ? renderWorkouts() : renderChanges();
  openDlg(t('log'), tabs + content, logTab === 'changes' && state.log.length ? `<button class="btn grey" id="logClear" style="font-size:9px">${t('logClear')}</button>` : '');
  const body = $('#dlgBody');
  body.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => openLog(b.dataset.tab)));
  body.querySelectorAll('.wdel').forEach(b => b.addEventListener('click', () => { if (confirm(t('deleteDay'))) { delete state.history[b.dataset.del]; save(); openLog('workouts'); } }));
  const add = $('#addDay');
  if (add) add.addEventListener('click', () => {
    body.innerHTML = tabs + renderAddDay(); $('#dlgFoot').innerHTML = '';
    const picked = new Set();
    body.querySelectorAll('.pk').forEach(b => b.addEventListener('click', () => { const id = b.dataset.id; picked.has(id) ? picked.delete(id) : picked.add(id); b.classList.toggle('on', picked.has(id)); }));
    body.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => openLog(b.dataset.tab)));
    $('#adCancel').addEventListener('click', () => openLog('workouts'));
    $('#adSave').addEventListener('click', () => {
      const d = $('#adDate').value; if (!d) return;
      const [Y, M, D] = d.split('-').map(Number), ts = new Date(Y, M - 1, D, 12).getTime();
      state.history[d] = state.history[d] || [];
      for (const e of state.exercises) if (picked.has(e.id)) historyAdd(state, ts, e);
      save(); openLog('workouts');
    });
  });
  const c = $('#logClear'); if (c) c.addEventListener('click', () => { if (confirm(t('logClearConfirm'))) { state.log = []; save(); openLog(); } });
}
$('#btnLog').innerHTML = icon('log');
$('#btnLog').addEventListener('click', () => openLog('workouts'));

/* =========================== fight screen =========================== */
const S = { ex: null, open: false, phase: 'idle', endAt: 0, dur: 0, raf: 0, timeout: 0, interval: 0, lastShown: -1, wake: null, anim: 0, goT: 0 };
const fight = $('#fight');
function openSession(id) {
  const e = state.exercises.find(x => x.id === id); if (!e) return;
  wipe(() => {
    S.ex = e; S.open = true; S.phase = isDone(e) ? 'cleared' : 'set';
    $('#fCode').textContent = e.code || t('exercise'); $('#fName').textContent = e.name;
    $('#stReps').textContent = e.reps; $('#stRepsL').textContent = t('reps'); $('#stKg').textContent = e.kg;
    $('#fNotes').textContent = e.notes || '';
    $('#sprite').innerHTML = GymSprites.svg(e.diagram, 0, 'f0') + GymSprites.svg(e.diagram, 1, 'f1') + GymSprites.svg(e.diagram, 0, 'rest', { sweat: true });
    $('#stamp').className = 'stamp'; $('#score').className = 'score'; $('#score').innerHTML = '';
    fight.classList.remove('resting', 'go');
    renderBar(); renderSub();
    fight.classList.remove('hidden'); fight.setAttribute('aria-hidden', 'false');
    window.scrollTo(0, 0);
    pushLayer('fight', closeSessionNow);
    requestWake(); startAnim();
  });
}
function closeSessionNow() {
  S.open = false; S.phase = 'idle'; stopTimer(); stopAnim(); closeNotifications(); nativeDisarm();
  fight.classList.add('hidden'); fight.classList.remove('resting', 'go'); fight.setAttribute('aria-hidden', 'true');
  releaseWake(); save(); renderList();
}
function closeSession() { if (S.open) popLayer(); }
$('#btnClose').addEventListener('click', () => { closeSession(); });

/* sprite frame animation: alternate frames while working */
function startAnim() { stopAnim(); S.anim = setInterval(() => { if (S.phase === 'set') $('#sprite').classList.toggle('alt'); }, 420); }
function stopAnim() { clearInterval(S.anim); $('#sprite').classList.remove('alt'); }

function renderBar(flashIdx) {
  const e = S.ex;
  $('#bar').innerHTML = Array.from({ length: e.sets }, (_, k) => `<i class="${k < e.doneSets ? 'on' : ''} ${k === e.doneSets && S.phase !== 'done' ? 'cur' : ''} ${k === flashIdx ? 'flash' : ''}">${k + 1}</i>`).join('');
  const next = Math.min(e.sets, e.doneSets + 1);
  $('#btnDone').textContent = S.phase === 'rest' ? t('resting') : S.phase === 'go' ? t('go') : S.phase === 'cleared' ? t('again') : t('done');
  $('#btnDone').classList.toggle('grey', S.phase !== 'set');
  $('#btnDone').disabled = !(S.phase === 'set' || S.phase === 'cleared');
}
function renderSub() {
  const el = $('#subctl');
  if (S.phase === 'rest') {
    el.innerHTML = `<button class="btn grey" id="btnMinus">-15s</button><button class="btn grey" id="btnPlus">+15s</button><button class="btn red" id="btnSkip">${t('skip')}</button>`;
    $('#btnSkip').addEventListener('click', () => { if (S.phase === 'rest') { endRest(false); } });
    $('#btnPlus').addEventListener('click', () => { if (S.phase === 'rest') { S.endAt += 15000; S.dur += 15; tick(); nativeArm(); } });
    $('#btnMinus').addEventListener('click', () => { if (S.phase === 'rest') { S.endAt -= 15000; tick(); if (S.phase === 'rest') nativeArm(); } });
  } else el.innerHTML = '';
}

/* the satisfying press */
function particles(n, colors) {
  const wrap = $('.controls');
  const W = wrap.clientWidth, H = wrap.clientHeight;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div'); p.className = 'px-particle';
    const sz = 6 + Math.floor(Math.random() * 3) * 4; p.style.width = p.style.height = sz + 'px';
    p.style.background = colors[i % colors.length];
    const x0 = (Math.random() - .5) * W * .8, y0 = 0;
    const a = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.1, d = 70 + Math.random() * 120;
    wrap.appendChild(p);
    p.animate([{ transform: `translate(${x0}px,${y0}px)`, opacity: 1 }, { transform: `translate(${x0 + Math.cos(a) * d}px,${y0 + Math.sin(a) * d + 40}px)`, opacity: 0 }],
      { duration: 500 + Math.random() * 300, easing: 'steps(7,end)', fill: 'forwards' }).onfinish = () => p.remove();
  }
}
function stamp(text, cls = '', hold = 700) {
  const s = $('#stamp'); s.textContent = text; s.className = 'stamp ' + cls; void s.offsetWidth; s.classList.add('in');
  clearTimeout(S.stampT);
  if (hold > 0) S.stampT = setTimeout(() => { s.classList.remove('in'); s.classList.add('out'); }, hold);
}
$('#btnDone').addEventListener('click', () => {
  if (!S.open) return;
  if (S.phase === 'cleared') { S.ex.doneSets = 0; S.phase = 'set'; save(); renderBar(); renderSub(); return; }
  if (S.phase !== 'set') return;
  const e = S.ex;
  Sfx.prime(['alarm', 'go', 'tick3']);
  if (!NATIVE && state.settings.notify && 'Notification' in window && Notification.permission === 'default') Notification.requestPermission().catch(() => {});
  if (RT && e.doneSets === 0) RT.requestPermission().catch(() => {});
  e.doneSets = Math.min(e.sets, e.doneSets + 1); save();
  const last = isDone(e);
  sfx(last ? 'finish' : 'hit'); buzz(last ? [30, 40, 30, 40, 90] : [20, 30, 40]);
  shake(); flash(true); particles(last ? 26 : 14, ['#ffd23f', '#f4f1ff', '#ff3b5c', '#3ef2ff']);
  if (last) return finishExercise();
  stamp(e.doneSets === e.sets - 1 ? t('last') : t('hit'), '', 520);
  startRest();
  renderBar(e.doneSets - 1);
});

function startRest() {
  S.phase = 'rest'; S.dur = restOf(S.ex); S.endAt = Date.now() + S.dur * 1000; S.lastShown = -1;
  $('#tLbl').textContent = t('rest'); $('#tNum').classList.remove('low');
  renderSub(); tick();
  clearTimeout(S.restT); S.restT = setTimeout(() => { if (S.phase === 'rest') fight.classList.add('resting'); }, 550);
  nativeArm();
  S.interval = setInterval(tick, 250);
  S.timeout = setTimeout(tick, S.dur * 1000 + 20);
}
function tick() {
  if (S.phase !== 'rest') return;
  const rem = S.endAt - Date.now(), secs = Math.max(0, Math.ceil(rem / 1000));
  if (secs !== S.lastShown) {
    S.lastShown = secs; const num = $('#tNum'); num.textContent = secs;
    num.classList.remove('punch'); void num.offsetWidth; num.classList.add('punch');
    num.classList.toggle('low', secs <= 3);
    if (secs <= 3 && secs > 0) { sfx('tick3'); buzz(15); }
    if (secs > 0) notifyCountdown(secs);
  }
  if (rem <= 0) endRest(true);
  else if (!document.hidden) { cancelAnimationFrame(S.raf); S.raf = requestAnimationFrame(tick); }
}
function stopTimer() { clearInterval(S.interval); clearTimeout(S.timeout); cancelAnimationFrame(S.raf); clearTimeout(S.goT); clearTimeout(S.restT); }
function endRest(alarm) {
  stopTimer();
  fight.classList.remove('resting');
  if (!alarm) { S.phase = 'set'; renderBar(); renderSub(); closeNotifications(); nativeDisarm(); return; }
  /* READY? ... (delay) ... GO!! with a crunch */
  S.phase = 'go'; fight.classList.add('go'); renderBar(); renderSub();
  if (!NATIVE) { sfx('alarm'); buzz([120, 80, 120, 80, 200]); } else if (Date.now() - S.endAt > 4000) RT.dismiss().catch(() => {});
  flash(false);
  stamp(t('ready'), 'blink', 0);
  notifyAlarm();
  S.goT = setTimeout(() => {
    if (!NATIVE) { sfx('go'); buzz([60, 30, 140]); } shake(); flash(true);
    stamp(t('go'), 'cyan', 900);
    S.goT = setTimeout(() => { S.phase = 'set'; fight.classList.remove('go'); renderBar(); renderSub(); }, 700);
  }, 900);
}

function finishExercise() {
  S.phase = 'done'; fight.classList.add('go'); renderBar(); renderSub();
  const all = state.exercises.every(isDone), e = S.ex;
  logAdd(e, 'clear', null, { reps: e.reps, sets: e.sets, kg: e.kg }); historyAdd(state, Date.now(), e); save();
  stamp(all ? t('allClear') : t('stageClear'), all ? 'cyan' : '', 0);
  const vol = e.kg * e.reps * e.sets, sc = $('#score'); sc.innerHTML = `${t('volume')} <b>0</b> KG`; sc.classList.add('in');
  const t0 = performance.now(), D = 900;
  const roll = now => { const x = Math.min(1, (now - t0) / D); sc.querySelector('b').textContent = Math.round(vol * x); if (x < 1) requestAnimationFrame(roll); };
  requestAnimationFrame(roll);
  setTimeout(() => {
    wipe(() => { closeSessionNow(); if (all) setTimeout(() => toast('💪 ' + t('allClear')), 300); });
  }, all ? 2600 : 1900);
}

document.addEventListener('visibilitychange', () => { if (!document.hidden) { if (S.phase === 'rest') tick(); if (S.open) requestWake(); } });

async function requestWake() {
  if (RT) { RT.keepAwake({ on: !!state.settings.wake }).catch(() => {}); return; }
  if (!state.settings.wake || !('wakeLock' in navigator) || S.wake) return;
  try { S.wake = await navigator.wakeLock.request('screen'); S.wake.addEventListener('release', () => { S.wake = null; }); } catch (e) { S.wake = null; }
}
function releaseWake() { if (RT) { RT.keepAwake({ on: false }).catch(() => {}); return; } if (S.wake) { S.wake.release().catch(() => {}); S.wake = null; } }
const canNotify = () => !NATIVE && state.settings.notify && 'Notification' in window && Notification.permission === 'granted' && navigator.serviceWorker;
const NTAG = 'gymbro-rest';
const fmtSecs = n => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
async function notifyCountdown(secs) {
  if (!canNotify() || S.phase !== 'rest') return;
  try { const r = await navigator.serviceWorker.ready;
    r.showNotification(`${t('rest')} ${fmtSecs(secs)}`, { body: `${S.ex.name} · ${t('set')} ${Math.min(S.ex.sets, S.ex.doneSets + 1)}/${S.ex.sets}`,
      tag: NTAG, silent: true, renotify: false, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png' }); } catch (e) {}
}
async function notifyAlarm() {
  if (!canNotify()) return;
  try { const r = await navigator.serviceWorker.ready;
    const hidden = document.hidden;
    r.showNotification(t('notifTitle'), { body: `${S.ex.name} · ${t('notifBody')}`, tag: NTAG, renotify: hidden, silent: !hidden,
      vibrate: hidden ? [200, 100, 200, 100, 400] : undefined, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png' });
    if (!hidden) setTimeout(closeNotifications, 2500); } catch (e) {}
}
async function closeNotifications() {
  if (NATIVE || !navigator.serviceWorker) return;
  try { const r = await navigator.serviceWorker.ready; (await r.getNotifications({ tag: NTAG })).forEach(n => n.close()); } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.phase !== 'rest') closeNotifications(); });

/* wall clock in the arena */
function clockTick() { const d = new Date(), hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0'); $('#clock').innerHTML = `${hh}<i>:</i>${mm}`; }
clockTick(); setInterval(clockTick, 5000);

/* =========================== boot =========================== */
document.documentElement.lang = state.settings.lang;
document.body.classList.toggle('crt', !!state.settings.crt);
setMode('list');
if ('serviceWorker' in navigator && !NATIVE) {
  let hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !S.open) location.reload(); hadController = true; });
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').then(r => r.update()).catch(() => {}));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) navigator.serviceWorker.getRegistration().then(r => r && r.update()); });
}
