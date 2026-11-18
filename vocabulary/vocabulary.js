/* ============ ДАННЫЕ И СОСТОЯНИЕ ============ */
const KEY = 'uni_dict_v3'; // ключ изменён, чтобы не конфликтовать с v2
let currentLang = localStorage.getItem('ud_lang') || 'de';

let dicts = JSON.parse(localStorage.getItem(KEY)) || demoData();

// --- АВТОМИГРАЦИЯ СТАРЫХ ДАННЫХ ---
function migrateData(data) {
  if (!data) return;
  for (const lang in data) {
    if (!Array.isArray(data[lang])) continue;
    data[lang].forEach(w => {
      if (!w.sections) {
        w.sections = w.section ? [w.section] : ['Без темы'];
      }
      delete w.section;
      // на всякий случай проставим роль
      if (!w.role) w.role = 'periphery';
    });
  }
  return data;
}
// Пробуем взять старый ключ, если новый пуст
if (!localStorage.getItem(KEY)) {
  const old = localStorage.getItem('uni_dict_v2');
  if (old) {
    try {
      const oldData = JSON.parse(old);
      dicts = migrateData(oldData);
      localStorage.setItem(KEY, JSON.stringify(dicts));
    } catch(e) { console.error('Миграция не удалась:', e); }
  }
}

let learned = JSON.parse(localStorage.getItem('ud_learned') || '[]');
let streak = +localStorage.getItem('ud_streak') || 0;
let nCorrect = +localStorage.getItem('ud_correct') || 0;
let nTotal = +localStorage.getItem('ud_total') || 0;

let editingId = null;

function demoData() {
  if (window.DEMO_DATA) return JSON.parse(JSON.stringify(window.DEMO_DATA));
  return {
    de: [
      {id:'r1', word:'die Reise', tr:'путешествие', sections:['Путешествия'], subtheme:'Транспорт', role:'core', level:'A1', transcription:'ˈʁaɪ̯zə', def:'Поездка.', ex:'Unsere Reise war schön.', conjugation:'', declension:'die Reise', syn:['die Fahrt'], ant:[], hypo:[], deriv:['reisen'], rel:['der Urlaub']}
    ],
    en: [], it: [], fr: [], es: [], ru: []
  };
}

function getWords() { return dicts[currentLang] || []; }

function slugify(s) {
  return (s || '').toString().toLowerCase().trim()
    .replace(/^(der|die|das|ein|eine|le|la|les|un|une|el|los|las|the|a|an|il|lo|la|i|gli|le)\s+/i, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/[\s-]+/g, '-').replace(/^-|-$/g, '');
}

function makeWord(o) {
  const arr = v => Array.isArray(v) ? v : (v ? String(v).split(',').map(s => s.trim()).filter(Boolean) : []);
  // Поддержка старого поля section и нового sections
  const secs = o.sections ? arr(o.sections) : (o.section ? [o.section] : ['Без темы']);
  return {
    id: o.id || slugify(o.word) || 'w' + Date.now(),
    word: o.word || '',
    tr: o.tr || '',
    sections: secs.length ? secs : ['Без темы'],
    subtheme: o.subtheme || '',
    role: o.role || 'periphery',
    level: o.level || '',
    transcription: o.transcription || '',
    def: o.def || '',
    ex: o.ex || '',
    conjugation: o.conjugation || '',
    declension: o.declension || '',
    syn: arr(o.syn),
    ant: arr(o.ant),
    hypo: arr(o.hypo),
    deriv: arr(o.deriv),
    rel: arr(o.rel)
  };
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(dicts));
  refreshAll();
}

function refreshAll() {
  renderSectionFilter();
  renderFieldSectionSelect();
  renderLibrary();
  updateStats();
  renderGraph();
}

function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('ud_lang', lang);
  const sel = document.getElementById('langSelect');
  if (sel) sel.value = lang;
  if ('speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch(e) {} }
  loadVoices();
  refreshAll();
  nextCard();
  nextGame();
}

/* ============ РЕЧЬ ============ */
const langMap = { de:'de-DE', en:'en-US', it:'it-IT', fr:'fr-FR', es:'es-ES', ru:'ru-RU' };
let voicesCache = [];
function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  try { voicesCache = speechSynthesis.getVoices() || []; } catch(e) { voicesCache = []; }
}
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }

function pickVoice(langCode) {
  if (!voicesCache.length) loadVoices();
  const base = langCode.slice(0, 2).toLowerCase();
  let v = voicesCache.find(x => x.lang.toLowerCase() === langCode.toLowerCase());
  if (!v) v = voicesCache.find(x => x.lang.toLowerCase().startsWith(base + '-'));
  if (!v) v = voicesCache.find(x => x.lang.toLowerCase().startsWith(base));
  return v || null;
}

function speak(t) {
  if (!t || !('speechSynthesis' in window)) return;
  try { speechSynthesis.cancel(); } catch(e) {}
  if (!voicesCache.length) loadVoices();
  const langCode = langMap[currentLang] || 'en-US';
  const u = new SpeechSynthesisUtterance(t);
  u.lang = langCode; u.rate = 0.9; u.pitch = 1;
  const v = pickVoice(langCode); if (v) u.voice = v;
  speechSynthesis.speak(u);
}
function speakField(id) { const el = document.getElementById(id); if (el) speak(el.value); }

/* ============ ВКЛАДКИ ============ */
document.querySelectorAll('.tab').forEach(t => t.onclick = () => {
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(x => x.classList.add('hidden'));
  t.classList.add('active');
  const content = document.getElementById(t.dataset.tab);
  if (content) content.classList.remove('hidden');
  if (t.dataset.tab === 'graph') setTimeout(renderGraph, 50);
});

/* ============ МОДАЛКИ ============ */
function fillAddForm(w) {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  set('f_word', w ? w.word : '');
  set('f_tr', w ? w.tr : '');
  set('f_sections', w ? (w.sections || []).join(', ') : '');
  set('f_subtheme', w ? (w.subtheme || '') : '');
  set('f_role', w ? (w.role || 'periphery') : 'periphery');
  set('f_level', w ? w.level : '');
  set('f_transcription', w ? (w.transcription || '') : '');
  set('f_def', w ? (w.def || '') : '');
  set('f_ex', w ? w.ex : '');
  set('f_conjugation', w ? (w.conjugation || '') : '');
  set('f_declension', w ? (w.declension || '') : '');
  set('f_syn', w ? (w.syn || []).join(', ') : '');
  set('f_ant', w ? (w.ant || []).join(', ') : '');
  set('f_hypo', w ? (w.hypo || []).join(', ') : '');
  set('f_deriv', w ? (w.deriv || []).join(', ') : '');
  set('f_rel', w ? (w.rel || []).join(', ') : '');
}

function openAddModal() {
  editingId = null;
  fillAddForm(null);
  const title = document.getElementById('addModalTitle');
  if (title) title.textContent = '➕ Добавить новое слово';
  const modal = document.getElementById('addModal');
  if (modal) modal.classList.add('active');
}

function openEditModal(id) {
  const w = getWords().find(x => x.id === id);
  if (!w) return;
  editingId = id;
  fillAddForm(w);
  const title = document.getElementById('addModalTitle');
  if (title) title.textContent = '✏️ Редактировать слово';
  const modal = document.getElementById('addModal');
  if (modal) modal.classList.add('active');
}

function closeAddModal() {
  const modal = document.getElementById('addModal');
  if (modal) modal.classList.remove('active');
  editingId = null;
}

function openImportModal() { const m = document.getElementById('importModal'); if (m) m.classList.add('active'); }
function closeImportModal() {
  const m = document.getElementById('importModal'); if (m) m.classList.remove('active');
  const ta = document.getElementById('csvPaste'); if (ta) ta.value = '';
}

/* ============ СЛОВАРЬ ============ */
function saveNewWord() {
  const word = document.getElementById('f_word').value.trim();
  const tr = document.getElementById('f_tr').value.trim();
  if (!word || !tr) { alert('Заполни слово и перевод!'); return; }

  const list = v => v.split(',').map(s => s.trim()).filter(Boolean);
  const secs = list(document.getElementById('f_sections').value);
  
  const data = {
    word, tr,
    sections: secs.length ? secs : ['Без темы'],
    subtheme: document.getElementById('f_subtheme').value.trim(),
    role: (document.getElementById('f_role') || {}).value || 'periphery',
    level: document.getElementById('f_level').value.trim(),
    transcription: document.getElementById('f_transcription').value.trim(),
    def: document.getElementById('f_def').value.trim(),
    ex: document.getElementById('f_ex').value.trim(),
    conjugation: document.getElementById('f_conjugation').value.trim(),
    declension: document.getElementById('f_declension').value.trim(),
    syn: list(document.getElementById('f_syn').value),
    ant: list(document.getElementById('f_ant').value),
    hypo: list(document.getElementById('f_hypo').value),
    deriv: list(document.getElementById('f_deriv').value),
    rel: list(document.getElementById('f_rel').value)
  };

  const words = getWords();
  if (editingId) {
    const i = words.findIndex(x => x.id === editingId);
    if (i >= 0) words[i] = makeWord({ ...data, id: editingId });
    else words.push(makeWord({ ...data, id: editingId }));
  } else {
    const w = makeWord(data);
    const i = words.findIndex(x => x.id === w.id);
    if (i >= 0) words[i] = w; else words.push(w);
  }
  save();
  closeAddModal();
}

function delWord(id) {
  if (!confirm('Удалить слово?')) return;
  dicts[currentLang] = getWords().filter(w => w.id !== id);
  save();
}

function renderLibrary() {
  const q = (document.getElementById('searchLib').value || '').toLowerCase();
  const sectionEl = document.getElementById('sectionFilter');
  const section = sectionEl ? sectionEl.value : '';
  const list = document.getElementById('wordList');
  if (!list) return;
  list.innerHTML = '';
  const words = getWords();

  if (words.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:40px;opacity:.5">Словарь пуст. Нажмите "➕ Добавить слово" или "📊 Импорт"</div>';
    return;
  }

  const filtered = words.filter(w => {
    const matchQ = !q || w.word.toLowerCase().includes(q) || w.tr.toLowerCase().includes(q);
    const matchS = !section || (w.sections || []).includes(section);
    return matchQ && matchS;
  });

  if (filtered.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:40px;opacity:.5">Ничего не найдено по выбранным условиям.</div>';
    return;
  }

  filtered.forEach(w => {
    const d = document.createElement('div');
    d.className = 'word-item';
    const secsStr = (w.sections || []).join(' / ');
    d.innerHTML = `
      <div>
        <span class="word-main">${w.word}</span>
        <span class="word-tr">— ${w.tr}</span>
        <span class="word-meta">[${secsStr}${w.subtheme ? ' / ' + w.subtheme : ''}] ${w.level}</span>
      </div>
      <div>
        <button class="mini-btn" onclick="speak('${w.word.replace(/'/g, "\\'")}')">🔊</button>
        <button class="mini-btn" onclick="openEditModal('${w.id}')">✏️</button>
        <button class="mini-btn del" onclick="delWord('${w.id}')">🗑</button>
      </div>`;
    list.appendChild(d);
  });
}

function renderSectionFilter() {
  const sel = document.getElementById('sectionFilter');
  if (!sel) return;
  const words = getWords();
  const counts = {};
  words.forEach(w => {
    (w.sections || ['Без темы']).forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    });
  });
  const sections = Object.keys(counts).sort();
  const current = sel.value;
  sel.innerHTML = '<option value="">📂 Все темы (' + words.length + ')</option>' +
    sections.map(s => `<option value="${s.replace(/"/g, '&quot;')}">${s} (${counts[s]})</option>`).join('');
  if (current && sections.includes(current)) sel.value = current;
}

function renderFieldSectionSelect() {
  const sel = document.getElementById('fieldSectionSelect');
  if (!sel) return;
  const words = getWords();
  const counts = {};
  words.forEach(w => {
    (w.sections || ['Без темы']).forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    });
  });
  const sections = Object.keys(counts).sort();
  const current = sel.value;
  sel.innerHTML = '<option value="">🎯 Все темы (' + sections.length + ')</option>' +
    sections.map(s => `<option value="${s.replace(/"/g, '&quot;')}">${s} (${counts[s]})</option>`).join('');
  if (current && sections.includes(current)) sel.value = current;
}

/* ============ КАРТОЧКИ ============ */
let curCard = null;
function nextCard() {
  const words = getWords();
  if (!words.length) { const wd = document.getElementById('wordDisplay'); if (wd) wd.textContent = '—'; return; }
  curCard = words[Math.floor(Math.random() * words.length)];
  const el = document.getElementById('wordDisplay');
  if (!el) return;

  el.textContent = curCard.word;
  el.className = 'word';

  const badges = document.getElementById('cardBadges');
  if (badges) {
    const parts = [];
    (curCard.sections || []).forEach(s => parts.push(`<span class="badge">📂 ${s}</span>`));
    if (curCard.subtheme) parts.push(`<span class="badge">${curCard.subtheme}</span>`);
    if (curCard.role === 'core') parts.push(`<span class="badge">⭐ Ядро</span>`);
    else if (curCard.role === 'periphery') parts.push(`<span class="badge">🔹 Периферия</span>`);
    if (curCard.level) parts.push(`<span class="badge">${curCard.level}</span>`);
    badges.innerHTML = parts.join(' ');
  }

  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set('transcriptionDisplay', curCard.transcription ? '[' + curCard.transcription + ']' : '');
  set('defDisplay', curCard.def ? '💡 ' + curCard.def : '');
  set('exampleDisplay', curCard.ex || '');
  set('conjugationDisplay', curCard.conjugation ? '🔄 ' + curCard.conjugation : '');
  set('declensionDisplay', curCard.declension ? '📐 ' + curCard.declension : '');

  const td = document.getElementById('translationDisplay');
  if (td) { td.textContent = ''; td.classList.remove('show'); }
}
function showTranslation() {
  if (!curCard) return;
  const td = document.getElementById('translationDisplay');
  if (!td) return;
  td.textContent = curCard.tr;
  td.classList.add('show');
  markLearned(curCard.word);
}
function speakCurrent() { speak(curCard && curCard.word); }

/* ============ ИГРЫ ============ */
let gameMode = 'findTranslation', gameCur = null, gameAnswered = false;
document.querySelectorAll('.btn-mode[data-mode]').forEach(b => b.onclick = () => {
  document.querySelectorAll('.btn-mode[data-mode]').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  gameMode = b.dataset.mode;
  nextGame();
});

function nextGame() {
  gameAnswered = false;
  const words = getWords();
  const promptEl = document.getElementById('gamePrompt');
  const opts = document.getElementById('gameOptions');
  if (!promptEl || !opts) return;

  if (words.length < 4) {
    promptEl.textContent = '⚠️ Нужно минимум 4 слова в словаре';
    opts.innerHTML = '';
    const ia = document.getElementById('gameInputArea'); if (ia) ia.classList.add('hidden');
    return;
  }
  gameCur = words[Math.floor(Math.random() * words.length)];
  const listen = (gameMode === 'listenType' || gameMode === 'listenChoose');
  const showWord = (gameMode === 'findTranslation');
  const showTr = (gameMode === 'findWord' || gameMode === 'typeByTranslation');

  promptEl.textContent = listen ? '🎧 Слушай…' : (showWord ? gameCur.word : (showTr ? gameCur.tr : ''));
  const lb = document.getElementById('gameListenBtn'); if (lb) lb.style.display = listen ? 'flex' : 'none';
  const fb = document.getElementById('gameFeedback'); if (fb) fb.textContent = '';
  opts.innerHTML = '';

  const inputArea = document.getElementById('gameInputArea');
  const needInput = (gameMode === 'typeByTranslation' || gameMode === 'listenType');
  if (inputArea) inputArea.classList.toggle('hidden', !needInput);
  const gi = document.getElementById('gameInput'); if (gi) gi.value = '';

  if (listen) speak(gameCur.word);

  if (gameMode === 'findTranslation' || gameMode === 'findWord' || gameMode === 'listenChoose') {
    const key = gameMode === 'findWord' ? 'word' : (gameMode === 'listenChoose' ? 'word' : 'tr');
    const pool = words.filter(w => w.id !== gameCur.id);
    const chosen = [gameCur];
    while (chosen.length < 4 && pool.length) {
      chosen.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    chosen.sort(() => Math.random() - 0.5);
    chosen.forEach(w => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = w[key];
      btn.onclick = () => checkGame(btn, w[key] === gameCur[key]);
      opts.appendChild(btn);
    });
  }
}
function speakGame() { speak(gameCur && gameCur.word); }
function checkGame(btn, isCorrect) {
  if (gameAnswered) return;
  gameAnswered = true; nTotal++;
  const fb = document.getElementById('gameFeedback');
  if (isCorrect) {
    btn.classList.add('correct'); if (fb) { fb.innerHTML = '✅ Правильно!'; fb.style.color = '#2ecc71'; }
    nCorrect++; streak++; markLearned(gameCur.word);
  } else {
    btn.classList.add('wrong'); if (fb) { fb.innerHTML = '❌ Правильно: <b>' + gameCur.word + ' — ' + gameCur.tr + '</b>'; fb.style.color = '#e74c3c'; }
    streak = 0;
    document.querySelectorAll('.quiz-option').forEach(b => { if (b.textContent === gameCur.word || b.textContent === gameCur.tr) b.classList.add('correct'); });
  }
  localStorage.setItem('ud_streak', streak); localStorage.setItem('ud_correct', nCorrect); localStorage.setItem('ud_total', nTotal);
  updateStats();
}
function checkGameInput() {
  if (gameAnswered || !gameCur) return;
  const inp = document.getElementById('gameInput').value.trim().toLowerCase();
  const target = gameCur.word.toLowerCase();
  const norm = s => s.replace(/^(der|die|das|ein|eine|le|la|les|un|une|el|los|las|the|a|an|il|lo|i|gli|le)\s+/i, '');
  gameAnswered = true; nTotal++;
  const fb = document.getElementById('gameFeedback');
  if (norm(inp) === norm(target)) {
    if (fb) { fb.innerHTML = '✅ Верно!'; fb.style.color = '#2ecc71'; }
    nCorrect++; streak++; markLearned(gameCur.word);
  } else {
    if (fb) { fb.innerHTML = '❌ Правильно: <b>' + gameCur.word + '</b>'; fb.style.color = '#e74c3c'; }
    streak = 0;
  }
  localStorage.setItem('ud_streak', streak); localStorage.setItem('ud_correct', nCorrect); localStorage.setItem('ud_total', nTotal);
  updateStats();
}

function markLearned(w) {
  if (!w) return;
  if (!learned.includes(w)) { learned.push(w); localStorage.setItem('ud_learned', JSON.stringify(learned)); updateStats(); }
}

/* ============ ИМПОРТ / ЭКСПОРТ ============ */
function parseCSVLine(line, sep) {
  const out = []; let cur = ''; let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else inQuotes = false; }
      else cur += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === sep) { out.push(cur); cur = ''; }
      else cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function parseTable(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  text = text.replace(/^\uFEFF/, '').replace(/^(\s*\r?\n)+/, '');
  const first = text.split(/\r?\n/)[0] || '';
  const sep = first.includes('\t') ? '\t' : (first.includes(';') ? ';' : ',');
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  const headers = parseCSVLine(lines[0], sep).map(h =>
    h.trim().toLowerCase().replace(/^"|"$/g, '').replace(/^\uFEFF/, '')
  );
  return lines.slice(1).map(l => {
    const v = parseCSVLine(l, sep);
    const o = {};
    headers.forEach((h, i) => {
      let val = (v[i] || '').trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      val = val.replace(/^"|"$/g, '');
      o[h] = val;
    });
    return o;
  });
}

function importRows(rows) {
  if (!rows.length) return 0;
  const aliases = {
    word: ['word', 'слово', 'term', 'термин'],
    tr: ['tr', 'translation', 'перевод', 'значение'],
    sections: ['sections', 'темы', 'тема', 'раздел', 'topic'],
    subtheme: ['subtheme', 'подтема', 'под темой', 'под-тема', 'subtopic'],
    role: ['role', 'роль', 'роль в теме'],
    level: ['level', 'уровень', 'тег', 'tag', 'тег (уровень)'],
    transcription: ['transcription', 'транскрипция', 'ipa'],
    def: ['def', 'definition', 'толкование', 'определение', 'описание'],
    ex: ['ex', 'example', 'пример', 'примеры'],
    conjugation: ['conjugation', 'спряжение'],
    declension: ['declension', 'склонение'],
    syn: ['syn', 'synonyms', 'синонимы'],
    ant: ['ant', 'antonyms', 'антонимы'],
    hypo: ['hypo', 'род-вид', 'род–вид', 'hypernym', 'hypernyms'],
    deriv: ['deriv', 'derivation', 'словообразование', 'однокоренные'],
    rel: ['rel', 'related', 'связанные', 'связи']
  };
  const hs = Object.keys(rows[0]);
  const map = {};
  for (const key in aliases) {
    const a = aliases[key];
    const found = hs.find(h => a.includes(h) || a.some(x => h.includes(x)));
    if (found) map[key] = found;
  }
  if (!map.word || !map.tr) { alert('Не найдены колонки "word" и "tr"!'); return 0; }

  const list = v => (v || '').split(/[,;|]/).map(s => s.trim()).filter(Boolean);
  let count = 0;
  const words = getWords();

  rows.forEach(r => {
    if (!r[map.word]) return;
    const w = makeWord({
      word: r[map.word], tr: r[map.tr],
      sections: list(r[map.sections]),
      subtheme: r[map.subtheme] || '',
      role: r[map.role] || 'periphery',
      level: r[map.level] || '',
      transcription: r[map.transcription] || '',
      def: r[map.def] || '',
      ex: r[map.ex] || '',
      conjugation: r[map.conjugation] || '',
      declension: r[map.declension] || '',
      syn: list(r[map.syn]),
      ant: list(r[map.ant]),
      hypo: list(r[map.hypo]),
      deriv: list(r[map.deriv]),
      rel: list(r[map.rel])
    });
    const i = words.findIndex(x => x.id === w.id);
    if (i >= 0) words[i] = w; else words.push(w);
    count++;
  });
  return count;
}

function importPasted() {
  const t = document.getElementById('csvPaste').value;
  if (!t.trim()) { alert('Нечего импортировать'); return; }
  const n = importRows(parseTable(t));
  document.getElementById('csvPaste').value = '';
  save(); closeImportModal();
  alert('Импортировано в словарь (' + currentLang + '): ' + n + ' слов.');
}

function importFile(e) {
  const f = e.target.files[0]; if (!f) return;
  if (!/\.(csv|txt)$/i.test(f.name)) {
    alert('Поддерживаются только .csv и .txt. Сохраните таблицу как CSV (UTF-8).');
    e.target.value = '';
    return;
  }
  const r = new FileReader();
  r.onload = ev => {
    let text = ev.target.result;
    const head = text.slice(0, 300);
    const looksOk = /word|слово|tr|перевод|def|толкование/i.test(head);
    if (!looksOk) {
      const r2 = new FileReader();
      r2.onload = ev2 => {
        const n = importRows(parseTable(ev2.target.result));
        save(); closeImportModal();
        alert('Импортировано в словарь (' + currentLang + '): ' + n + ' слов.');
        e.target.value = '';
      };
      r2.readAsText(f, 'Windows-1251');
      return;
    }
    const n = importRows(parseTable(text));
    save(); closeImportModal();
    alert('Импортировано в словарь (' + currentLang + '): ' + n + ' слов.');
    e.target.value = '';
  };
  r.readAsText(f, 'UTF-8');
}

function exportCSV() {
  const words = getWords();
  if (!words.length) { alert('Словарь пуст'); return; }
  const head = 'word,tr,sections,subtheme,role,level,transcription,def,ex,conjugation,declension,syn,ant,hypo,deriv,rel';
  const rows = words.map(w => [
    w.word, w.tr, (w.sections||[]).join('|'), w.subtheme || '', w.role || '', w.level || '',
    w.transcription || '', w.def || '', w.ex || '',
    w.conjugation || '', w.declension || '',
    (w.syn||[]).join(', '), (w.ant||[]).join(', '),
    (w.hypo||[]).join(', '), (w.deriv||[]).join(', '), (w.rel||[]).join(', ')
  ].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(','));
  download('\ufeff' + [head, ...rows].join('\n'), `dictionary_${currentLang}.csv`, 'text/csv');
}

function exportJSON() {
  download(JSON.stringify(dicts, null, 2), 'all_dictionaries_backup.json', 'application/json');
}

function download(content, name, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name; a.click();
}

/* ============ ГРАФ ============ */
const lvlColor = { A1: '#43e97b', A2: '#4facfe', B1: '#fa709a', B2: '#f093fb', C1: '#667eea', C2: '#455a64' };
let network = null;

/* Собирает все слова + заглушки для упомянутых, но отсутствующих. 
   Заглушки создаются для каждой темы отдельно. */
function expandWordsWithStubs(words) {
  const existing = new Map(); // slug -> word
  words.forEach(w => existing.set(slugify(w.word), w));

  const stubs = [];
  const addRef = (ref, parentSections, parentSubtheme) => {
    if (!ref) return;
    const s = slugify(ref);
    if (!s || existing.has(s)) return;
    
    // Наследуем все темы родителя. Если тем нет - "Без темы".
    const secs = parentSections && parentSections.length ? parentSections : ['Без темы'];
    
    secs.forEach(sec => {
      const stubId = `stub_${slugify(sec)}_${s}`;
      // Проверяем, не создали ли уже такую заглушку
      if (stubs.some(x => x.id === stubId)) return;
      
      stubs.push(makeWord({
        id: stubId,
        word: ref,
        tr: '—',
        sections: [sec], // заглушка принадлежит только этой конкретной теме
        subtheme: parentSubtheme || '',
        role: 'periphery',
        __stub: true
      }));
    });
  };

  words.forEach(w => {
    (w.syn || []).forEach(ref => addRef(ref, w.sections, w.subtheme));
    (w.ant || []).forEach(ref => addRef(ref, w.sections, w.subtheme));
    (w.hypo || []).forEach(ref => addRef(ref, w.sections, w.subtheme));
    (w.deriv || []).forEach(ref => addRef(ref, w.sections, w.subtheme));
    (w.rel || []).forEach(ref => addRef(ref, w.sections, w.subtheme));
  });

  return words.concat(stubs);
}

function buildGraphData(words, opts) {
  const nodes = [], edges = [], byNorm = {};
  const onSec = opts.sec, onSyn = opts.syn, onAnt = opts.ant, onHypo = opts.hypo, onDeriv = opts.deriv, onRel = opts.rel;

  words.forEach(w => {
    byNorm[slugify(w.word)] = w.id;
    const isStub = !!w.__stub;
    nodes.push({
      id: w.id,
      label: w.word,
      shape: 'dot',
      size: isStub ? 10 : 16,
      color: isStub
        ? { background: 'rgba(149,165,166,.35)', border: 'rgba(149,165,166,.8)' }
        : { background: lvlColor[w.level] || '#95a5a6', border: '#fff' },
      font: {
        size: isStub ? 12 : 14,
        color: isStub ? 'rgba(255,255,255,.55)' : '#fff',
        italic: isStub ? { enabled: true } : undefined
      },
      title: isStub ? `${w.word} — нет карточки` : w.tr
    });
  });

  const secs = {};
  if (onSec) {
    words.forEach(w => {
      if (w.__stub) return;
      (w.sections || ['Без темы']).forEach(s => {
        if (!secs[s]) {
          secs[s] = 'sec_' + slugify(s);
          nodes.push({
            id: secs[s], label: '📂 ' + s, shape: 'diamond', size: 14,
            color: { background: '#ffd700', border: '#fff' }, font: { size: 13, color: '#ffd700' }
          });
        }
        edges.push({ from: w.id, to: secs[s], color: { color: 'rgba(255,215,0,.2)' }, width: 1 });
      });
    });
  }

  const link = (from, arr, color, label, dashes) => (arr || []).forEach(t => {
    const to = byNorm[slugify(t)];
    if (to && to !== from) {
      edges.push({ from, to, label, arrows: 'to', color: { color }, dashes, width: 2, font: { size: 10, color } });
    }
  });

  words.forEach(w => {
    if (w.__stub) return;
    if (onSyn) link(w.id, w.syn, '#2ecc71', 'син', [5, 5]);
    if (onAnt) link(w.id, w.ant, '#e74c3c', 'ант', [8, 4]);
    if (onHypo) link(w.id, w.hypo, '#f39c12', 'род-вид', [2, 4]);
    if (onDeriv) link(w.id, w.deriv, '#9b59b6', 'словообр', [4, 2]);
    if (onRel) link(w.id, w.rel, '#4ecdc4', 'связ', false);
  });

  return { nodes, edges };
}

function renderGraph() {
  const graphTab = document.getElementById('graph');
  const container = document.getElementById('graphContainer');
  if (!graphTab || graphTab.classList.contains('hidden') || !container) return;
  if (typeof vis === 'undefined') {
    const info = document.getElementById('graphInfo');
    if (info) info.innerHTML = '<p style="text-align:center;padding:20px;opacity:.7">⚠️ Библиотека vis-network не загрузилась.</p>';
    return;
  }

  let words = getWords();
  if (!words.length) {
    const info = document.getElementById('graphInfo');
    if (info) info.innerHTML = '<p style="text-align:center;padding:40px;opacity:.5">Добавьте слова, чтобы построить граф.</p>';
    if (network) { network.destroy(); network = null; }
    return;
  }
  words = expandWordsWithStubs(words);

  const chk = id => { const el = document.getElementById(id); return el ? el.checked : true; };
  const opts = {
    syn: chk('chkSyn'), ant: chk('chkAnt'), hypo: chk('chkHypo'),
    deriv: chk('chkDeriv'), rel: chk('chkRel'), sec: chk('chkSec')
  };

  const { nodes, edges } = buildGraphData(words, opts);

  if (network) network.destroy();
  network = new vis.Network(container, {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  }, {
    physics: {
      barnesHut: {
        gravitationalConstant: -12000,
        springLength: 220,
        springConstant: 0.04,
        avoidOverlap: 1
      },
      stabilization: { iterations: 300 }
    },
    interaction: { hover: true }
  });

  network.on('click', p => {
    if (p.nodes.length && !String(p.nodes[0]).startsWith('sec_') && !String(p.nodes[0]).startsWith('theme_')) showGraphCard(p.nodes[0]);
  });
}

function renderFieldGraph() {
  let words = getWords();
  const info = document.getElementById('graphInfo');
  const container = document.getElementById('graphContainer');
  if (!container || typeof vis === 'undefined') return;
  if (!words.length) {
    if (info) info.innerHTML = '<p style="text-align:center;padding:40px;opacity:.5">Добавьте слова.</p>';
    if (network) { network.destroy(); network = null; }
    return;
  }
  words = expandWordsWithStubs(words);

  const sel = document.getElementById('fieldSectionSelect');
  const chosen = sel ? sel.value : '';

  const groups = {};
  words.forEach(w => {
    (w.sections || ['Без темы']).forEach(s => {
      if (!groups[s]) groups[s] = [];
      groups[s].push(w);
    });
  });

  const sections = Object.keys(groups).sort();
  const visibleSections = chosen ? [chosen].filter(s => groups[s]) : sections;

  const nodes = [], edges = [], byNorm = {};
  words.forEach(w => { byNorm[slugify(w.word)] = w.id; });

  visibleSections.forEach(sec => {
    const themeId = 'theme_' + slugify(sec);
    nodes.push({
      id: themeId, label: '🎯 ' + sec, shape: 'hexagon', size: 30,
      color: { background: '#667eea', border: '#fff' },
      font: { size: 18, color: '#fff' }
    });

    // Для тематического поля берем только слова, у которых эта тема есть
    groups[sec].forEach(w => {
      const isStub = !!w.__stub;
      
      // Если слово уже добавлено (у него несколько тем), не дублируем узел, но добавим ребро к этой теме
      if (!nodes.some(n => n.id === w.id)) {
        nodes.push({
          id: w.id,
          label: w.word,
          shape: 'dot',
          size: isStub ? 11 : (w.role === 'core' ? 26 : 15),
          color: isStub
            ? { background: 'rgba(149,165,166,.35)', border: 'rgba(149,165,166,.8)' }
            : (w.role === 'core'
                ? { background: '#ffd700', border: '#fff' }
                : { background: lvlColor[w.level] || '#95a5a6', border: '#fff' }),
          font: {
            size: isStub ? 12 : (w.role === 'core' ? 16 : 13),
            color: isStub ? 'rgba(255,255,255,.55)' : '#fff',
            italic: isStub ? { enabled: true } : undefined
          },
          title: isStub ? `${w.word} — нет карточки` : (w.tr + (w.role === 'core' ? ' ⭐ ядро' : ''))
        });
      }
      
      edges.push({
        from: themeId, to: w.id,
        color: { color: w.role === 'core' ? '#ffd700' : 'rgba(255,255,255,.25)' },
        width: w.role === 'core' ? 3 : 1,
        dashes: w.role === 'core' ? false : [4, 4]
      });
    });
  });

  const visibleIds = new Set(nodes.map(n => n.id));
  const explicitPairs = new Set();

  const link = (from, arr, color, label, dashes) => (arr || []).forEach(t => {
    const to = byNorm[slugify(t)];
    if (to && to !== from && visibleIds.has(from) && visibleIds.has(to)) {
      // Для заглушек id уникален, ищем именно по slug
      const actualTo = nodes.find(n => n.id === to)?.id;
      if (!actualTo) return;
      
      edges.push({ from, to: actualTo, label, arrows: 'to', color: { color }, dashes, width: 2, font: { size: 10, color } });
      explicitPairs.add(from + '|' + actualTo);
      explicitPairs.add(actualTo + '|' + from);
    }
  });
  
  visibleSections.forEach(sec => {
    groups[sec].forEach(w => {
      if (w.__stub) return;
      link(w.id, w.syn, '#2ecc71', 'син', [5, 5]);
      link(w.id, w.ant, '#e74c3c', 'ант', [8, 4]);
      link(w.id, w.hypo, '#f39c12', 'род-вид', [2, 4]);
      link(w.id, w.deriv, '#9b59b6', 'словообр', [4, 2]);
      link(w.id, w.rel, '#4ecdc4', 'связ', false);
    });
  });

  const addStruct = (a, b, color, width, dashes, label) => {
    if (!a || !b || a === b) return;
    const key = a + '|' + b;
    if (explicitPairs.has(key)) return;
    explicitPairs.add(key);
    explicitPairs.add(b + '|' + a);
    edges.push({
      from: a, to: b,
      color: { color },
      width,
      dashes,
      label: label || undefined,
      font: label ? { size: 10, color } : undefined,
      arrows: ''
    });
  };

  visibleSections.forEach(sec => {
    const list = groups[sec].filter(w => !w.__stub);
    const cores = list.filter(w => w.role === 'core');
    const periph = list.filter(w => w.role !== 'core');

    for (let i = 0; i < cores.length; i++) {
      for (let j = i + 1; j < cores.length; j++) {
        addStruct(cores[i].id, cores[j].id, 'rgba(255,215,0,.55)', 2, false);
      }
    }

    periph.forEach(p => {
      let target = cores.find(c => c.subtheme && p.subtheme && c.subtheme === p.subtheme) || cores[0];
      if (target) {
        addStruct(target.id, p.id, 'rgba(255,215,0,.35)', 1.5, [3, 5]);
      } else {
        const themeId = 'theme_' + slugify(sec);
        addStruct(themeId, p.id, 'rgba(255,255,255,.15)', 1, [2, 6]);
      }
    });

    const bySub = {};
    periph.forEach(p => {
      const st = p.subtheme || '__none__';
      if (!bySub[st]) bySub[st] = [];
      bySub[st].push(p);
    });
    Object.values(bySub).forEach(arr => {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          addStruct(arr[i].id, arr[j].id, 'rgba(255,255,255,.18)', 1, [2, 6]);
        }
      }
    });
  });

  if (network) network.destroy();
  network = new vis.Network(container, {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  }, {
    physics: {
      barnesHut: {
        gravitationalConstant: -12000,
        springLength: 220,
        springConstant: 0.04,
        avoidOverlap: 1
      },
      stabilization: { iterations: 300 }
    },
    interaction: { hover: true }
  });

  network.on('click', p => {
    if (p.nodes.length && !String(p.nodes[0]).startsWith('theme_')) showGraphCard(p.nodes[0]);
  });

  if (info) info.innerHTML = `<h3>🎯 Тематическое поле${chosen ? ': ' + chosen : ' (все темы)'}</h3>
    <p style="opacity:.75">Ядро (⭐) — крупные жёлтые узлы. Пунктир — периферия. Связи между словами показаны цветными стрелками.</p>`;
}

function showGraphCard(id) {
  const words = getWords();
  let w = words.find(x => x.id === id);
  let isStub = false;

  if (!w) {
    const all = expandWordsWithStubs(words);
    w = all.find(x => x.id === id);
    if (w && w.__stub) isStub = true;
  }

  if (!w) return;
  const info = document.getElementById('graphInfo');

  if (isStub) {
    if (info) {
      info.innerHTML = `
        <h3>${w.word}</h3>
        <p style="opacity:.7">Слово упомянуто в связях, но карточки пока нет.</p>
        <div class="btn-group" style="justify-content:flex-start">
          <button class="btn btn-speak" onclick="speak('${w.word.replace(/'/g, "\\'")}')">🔊 Произнести</button>
          <button class="btn btn-mode" onclick="prefillNewWordFromStub('${w.word.replace(/'/g, "\\'")}', '${(w.sections||[]).join(', ').replace(/'/g, "\\'")}')">➕ Создать карточку</button>
        </div>`;
    }
    return;
  }

  const tag = (arr, cls) => (arr && arr.length)
    ? `<div><b>${cls === 'syn' ? 'Синонимы' : cls === 'ant' ? 'Антонимы' : cls === 'hypo' ? 'Род–вид' : cls === 'deriv' ? 'Словообразование' : 'Связанные'}:</b> ${arr.map(t => `<span class="tag ${cls}">${t}</span>`).join('')}</div>`
    : '';

  if (!info) return;
  info.innerHTML = `
    <h3>${w.word} — ${w.tr}</h3>
    ${w.transcription ? `<div style="opacity:.7;font-family:monospace">[${w.transcription}]</div>` : ''}
    ${w.def ? `<p style="margin:6px 0">💡 ${w.def}</p>` : ''}
    ${(w.sections || []).map(s => `<span class="badge">📂 ${s}</span>`).join(' ')}
    ${w.subtheme ? `<span class="badge">${w.subtheme}</span>` : ''}
    <span class="badge">${w.role === 'core' ? '⭐ ядро' : (w.role === 'periphery' ? '🔹 периферия' : '—')}</span>
    <span class="badge">${w.level || '—'}</span>
    ${w.ex ? `<p style="margin-top:8px;font-style:italic">«${w.ex}»</p>` : ''}
    ${w.conjugation ? `<p>🔄 ${w.conjugation}</p>` : ''}
    ${w.declension ? `<p>📐 ${w.declension}</p>` : ''}
    ${tag(w.syn, 'syn')}${tag(w.ant, 'ant')}${tag(w.hypo, 'hypo')}${tag(w.deriv, 'deriv')}${tag(w.rel, 'rel')}
    <div class="btn-group" style="justify-content:flex-start">
      <button class="btn btn-speak" onclick="speak('${w.word.replace(/'/g, "\\'")}')">🔊 Произнести</button>
      <button class="btn btn-mode" onclick="openEditModal('${w.id}')">✏️ Редактировать</button>
    </div>`;
}

function prefillNewWordFromStub(word, sectionsStr) {
  openAddModal();
  const elW = document.getElementById('f_word');
  if (elW) elW.value = word;
  const elS = document.getElementById('f_sections');
  if (elS) elS.value = sectionsStr || '';
}

/* ============ СТАТИСТИКА ============ */
function updateStats() {
  const words = getWords();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('totalWords', words.length);
  set('learnedCount', learned.length);
  set('streakCount', streak);
  set('accuracy', (nTotal ? Math.round(nCorrect / nTotal * 100) : 0) + '%');
  const pf = document.getElementById('progressFill');
  if (pf) pf.style.width = (words.length ? Math.min(100, Math.round(learned.length / words.length * 100)) : 0) + '%';
}

/* ============ СТАРТ ============ */
function initApp() {
  const sel = document.getElementById('langSelect');
  if (sel) sel.value = currentLang;
  const search = document.getElementById('searchLib');
  if (search) search.oninput = renderLibrary;
  const gi = document.getElementById('gameInput');
  if (gi) gi.addEventListener('keydown', e => { if (e.key === 'Enter') checkGameInput(); });

  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('active'); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
  });

  if ('speechSynthesis' in window) {
    loadVoices();
    if (!voicesCache.length) speechSynthesis.onvoiceschanged = loadVoices;
  }

  refreshAll();
  nextCard();
  nextGame();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}