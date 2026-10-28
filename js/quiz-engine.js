/* =========================================
   quiz-engine.js — Универсальный движок тестов
   Исправлено: fill_blank + гарантированная отправка без CORS ошибок
   ========================================= */

// ====== ЧИТАЕМ ПАРАМЕТРЫ ИЗ URL ======
const urlParams = new URLSearchParams(window.location.search);
const testPath = urlParams.get('test');

if (!testPath) {
  document.body.innerHTML = `
    <div style="padding:60px 20px;text-align:center;color:#fca5a5">
      <h1>❌ Не указан тест</h1>
      <p style="margin-top:20px;font-size:18px">Правильный URL:</p>
      <code style="display:block;margin-top:10px;padding:15px;background:rgba(255,255,255,0.05);border-radius:8px;font-size:14px">
        quiz.html?test=english/tests/test-01-basics.json
      </code>
      <a href="index.html" style="display:inline-block;margin-top:30px;color:var(--accent)">← Вернуться на главную</a>
    </div>
  `;
  throw new Error('No test specified');
}

// ====== ВАШ GOOGLE APPS SCRIPT URL ======
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwrGRl223fjhIMajg8kQeYAt1sXfyFVPAEASbVIejMfFLaoaAncf8V2Ui_3XEQGXDR5/exec";

// ====== СОСТОЯНИЕ ======
let TEST_DATA = null;
let studentName = "";
let studentGroup = "";
let score = 0;
let currentQ = 0;
let timeLeft = 900;
let timerInterval = null;
let testStarted = false;
let testFinished = false;

// ====== ЗАГРУЖАЕМ JSON ======
fetch(testPath.endsWith('.json') ? testPath : `${testPath}.json`)
  .then(r => {
    if (!r.ok) throw new Error('JSON не найден');
    return r.json();
  })
  .then(data => {
    TEST_DATA = data;
    timeLeft = data.timeLimit || 900;
    document.getElementById('testTitle').textContent = data.name;
    document.getElementById('testSubtitle').textContent = data.subtitle || `${data.questions.length} вопросов · ${Math.floor(timeLeft/60)} минут`;
  })
  .catch(err => {
    document.body.innerHTML = `
      <div style="padding:60px 20px;text-align:center;color:#fca5a5">
        <h1>❌ Не удалось загрузить тест</h1>
        <p style="margin-top:20px;font-size:18px">Проверьте путь:</p>
        <code style="display:block;margin-top:10px;padding:15px;background:rgba(255,255,255,0.05);border-radius:8px;font-size:14px">
          ${testPath}
        </code>
        <p style="margin-top:20px;color:var(--muted)">Ошибка: ${err.message}</p>
        <a href="index.html" style="display:inline-block;margin-top:30px;color:var(--accent)">← Вернуться на главную</a>
      </div>
    `;
  });

// ====== ЗАЩИТА ОТ ЗАКРЫТИЯ ВКЛАДКИ ======
window.addEventListener('beforeunload', (e) => {
  if (testStarted && !testFinished) {
    sendResultSync(true); // Отправляем как "незавершенный"
    e.preventDefault();
    e.returnValue = 'Тест ещё не завершён! Результат будет сохранен.';
    return e.returnValue;
    }
});

// ====== СТАРТ ТЕСТА ======
function startTest() {
  if (!TEST_DATA) {
    alert("Тест ещё загружается, подождите...");
    return;
  }
  
  const name = document.getElementById('studentName').value.trim();
  const group = document.getElementById('studentGroup').value.trim();
  
  if (name.length < 3 || group.length < 2) {
    alert("Введите ФИО (минимум 3 символа) и номер группы");
    return;
  }
  
  studentName = name;
  studentGroup = group;
  testStarted = true;

  document.getElementById('startScreen').classList.remove('active');
  document.getElementById('quizScreen').classList.add('active');
  document.getElementById('displayName').textContent = "👤 " + studentName + " | " + studentGroup;

  showQuestion();
  startTimer();
}

// ====== ТАЙМЕР ======
function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      finishTest();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const el = document.getElementById('timer');
  el.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  if (timeLeft <= 60) el.classList.add('warning');
}

// ====== РЕНДЕР ВОПРОСА ======
function showQuestion() {
  if (currentQ >= TEST_DATA.questions.length) {
    finishTest();
    return;
  }
  
  const q = TEST_DATA.questions[currentQ];
  const progress = ((currentQ) / TEST_DATA.questions.length) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
  
  let html = '';
  switch (q.type) {
    case 'multiple_choice': html = renderMultipleChoice(q, currentQ); break;
    case 'true_false': html = renderTrueFalse(q, currentQ); break;
    case 'fill_blank': html = renderFillBlank(q, currentQ); break;
    case 'multiple_select': html = renderMultipleSelect(q, currentQ); break;
    default: html = `<div class="q"><div class="qt">Неизвестный тип: ${q.type}</div></div>`;
  }
  document.getElementById('questionArea').innerHTML = html;
}

// ====== ТИП 1: Выбор одного ======
function renderMultipleChoice(q, index) {
  return `
    <div class="q" data-index="${index}" data-type="multiple_choice" data-correct="${q.c}">
      <div class="q-num">Вопрос ${index + 1} из ${TEST_DATA.questions.length}</div>
      <div class="qt">${q.q}</div>
      <div class="opts">
        ${q.opts.map((opt, i) => `<div class="opt" onclick="selectMC(this, ${i})">${opt}</div>`).join('')}
      </div>
    </div>
  `;
}

function selectMC(el, idx) {
  const q = el.closest('.q');
  if (q.dataset.done) return;
  q.dataset.done = "1";
  const correct = parseInt(q.dataset.correct);
  if (idx + 1 === correct) score++;
  q.querySelectorAll('.opt').forEach((o, i) => {
    o.style.pointerEvents = 'none';
    if (i + 1 === correct) o.classList.add('ok');
    else if (o === el) o.classList.add('no');
  });
  setTimeout(() => { currentQ++; showQuestion(); }, 600);
}

// ====== ТИП 2: Правда / Ложь ======
function renderTrueFalse(q, index) {
  return `
    <div class="q" data-index="${index}" data-type="true_false" data-correct="${q.answer}">
      <div class="q-num">Вопрос ${index + 1} из ${TEST_DATA.questions.length}</div>
      <div class="qt">${q.q}</div>
      <div class="opts">
        <div class="opt" onclick="selectTF(this, true)">✅ True</div>
        <div class="opt" onclick="selectTF(this, false)">❌ False</div>
      </div>
    </div>
  `;
}

function selectTF(el, val) {
  const q = el.closest('.q');
  if (q.dataset.done) return;
  q.dataset.done = "1";
  const correct = q.dataset.correct === "true";
  if (val === correct) score++;
  q.querySelectorAll('.opt').forEach(o => {
    o.style.pointerEvents = 'none';
    if (o.textContent.includes("True") && correct) o.classList.add('ok');
    else if (o.textContent.includes("False") && !correct) o.classList.add('ok');
    else if (o === el && val !== correct) o.classList.add('no');
  });
  setTimeout(() => { currentQ++; showQuestion(); }, 600);
}

// ====== ТИП 3: Ввод текста ======
function renderFillBlank(q, index) {
  const answer = q.answer.toLowerCase().replace(/"/g, '&quot;');
  return `
    <div class="q" data-index="${index}" data-type="fill_blank" data-answer="${answer}">
      <div class="q-num">Вопрос ${index + 1} из ${TEST_DATA.questions.length}</div>
      <div class="qt">${q.q}</div>
      <input type="text" class="input-field" id="input-${index}" placeholder="Введите ответ" onkeydown="if(event.key==='Enter')checkFB(this)">
      <button class="btn btn-secondary" style="margin-top:10px;padding:10px 20px;font-size:14px" onclick="checkFB(document.getElementById('input-${index}'))">Проверить</button>
    </div>
  `;
}

function checkFB(inputEl) {
  const q = inputEl.closest('.q');
  if (q.dataset.done) return;
  const userAnswer = inputEl.value.trim().toLowerCase();
  const correct = q.dataset.answer;
  if (userAnswer === '') {
    inputEl.style.borderColor = 'var(--accent)';
    inputEl.focus();
    return;
  }
  q.dataset.done = "1";
  const isCorrect = userAnswer === correct;
  if (isCorrect) score++;
  inputEl.disabled = true;
  inputEl.style.borderColor = isCorrect ? 'var(--accent-4)' : 'var(--danger)';
  inputEl.style.background = isCorrect ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)';
  const btn = q.querySelector('button');
  btn.disabled = true;
  btn.style.opacity = '0.5';
  setTimeout(() => { currentQ++; showQuestion(); }, 1000);
}

// ====== ТИП 4: Выбор нескольких ======
function renderMultipleSelect(q, index) {
  return `
    <div class="q" data-index="${index}" data-type="multiple_select" data-correct='${JSON.stringify(q.correct)}'>
      <div class="q-num">Вопрос ${index + 1} из ${TEST_DATA.questions.length}</div>
      <div class="qt">${q.q}</div>
      <div class="opts">
        ${q.opts.map((opt, i) => `<div class="opt" onclick="toggleMS(this, ${i})">${opt}</div>`).join('')}
      </div>
      <button class="btn btn-secondary" style="margin-top:10px;padding:10px 20px;font-size:14px" onclick="checkMS(this)">Проверить</button>
    </div>
  `;
}

function toggleMS(el, idx) {
  const q = el.closest('.q');
  if (q.dataset.done) return;
  el.classList.toggle('selected');
  if (!q.dataset.selected) q.dataset.selected = "[]";
  let selected = JSON.parse(q.dataset.selected);
  if (selected.includes(idx)) {
    selected = selected.filter(i => i !== idx);
  } else {
    selected.push(idx);
  }
  q.dataset.selected = JSON.stringify(selected);
}

function checkMS(el) {
  const q = el.closest('.q');
  if (q.dataset.done) return;
  q.dataset.done = "1";
  const correct = JSON.parse(q.dataset.correct);
  const selected = q.dataset.selected ? JSON.parse(q.dataset.selected) : [];
  const isCorrect = correct.length === selected.length && correct.every(c => selected.includes(c));
  if (isCorrect) score++;
  q.querySelectorAll('.opt').forEach((o, i) => {
    o.style.pointerEvents = 'none';
    if (correct.includes(i)) o.classList.add('ok');
    else if (selected.includes(i)) o.classList.add('no');
  });
  el.disabled = true;
  el.style.opacity = '0.5';
  setTimeout(() => { currentQ++; showQuestion(); }, 1200);
}

// ====== ЗАВЕРШЕНИЕ ТЕСТА ======
function finishTest() {
  if (testFinished) return;
  testFinished = true;
  clearInterval(timerInterval);

  document.getElementById('quizScreen').classList.remove('active');
  document.getElementById('resultScreen').classList.add('active');

  document.getElementById('scoreBig').textContent = `${score}/${TEST_DATA.questions.length}`;
  
  const pct = (score / TEST_DATA.questions.length) * 100;
  let grade = "";
  if (pct >= 90) grade = "Оценка: 5 (Отлично)";
  else if (pct >= 75) grade = "Оценка: 4 (Хорошо)";
  else if (pct >= 50) grade = "Оценка: 3 (Удовлетворительно)";
  else grade = "Оценка: 2 (Пересдача)";
  
  document.getElementById('gradeBig').textContent = grade;

  // Вызываем отправку
  sendResult(false);
}

// ====== ОТПРАВКА В GOOGLE ТАБЛИЦУ (ЕДИНСТВЕННЫЙ ПРАВИЛЬНЫЙ ВАРИАНТ) ======
function sendResult(incomplete) {
  console.log("🔄 Запуск отправки данных...");
  sendResultSync(incomplete, null);
}

function sendResultSync(incomplete, data = null) {
  if (!data) {
    const namePart = studentName.substring(0, 3).toUpperCase().replace(/[^A-ZА-Я]/g, 'X').padEnd(3, 'X');
    const code = `${namePart}-${score}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    data = {
      testName: TEST_DATA ? TEST_DATA.name : "Unknown",
      group: studentGroup,
      studentName: studentName,
      score: score,
      total: TEST_DATA ? TEST_DATA.questions.length : 0,
      grade: score >= ((TEST_DATA?.questions.length || 0) * 0.9) ? "5" : score >= ((TEST_DATA?.questions.length || 0) * 0.75) ? "4" : score >= ((TEST_DATA?.questions.length || 0) * 0.5) ? "3" : "2",
      code: code,
      incomplete: incomplete ? "YES" : "NO",
      timestamp: new Date().toISOString()
    };
  }

  console.log("📤 Данные для отправки:", data);

  // Метод 1: sendBeacon (Самый надежный, работает при закрытии вкладки)
  // КРИТИЧЕСКИ ВАЖНО: type: 'text/plain' предотвращает CORS preflight запрос
  const blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
  const beaconSent = navigator.sendBeacon(SCRIPT_URL, blob);
  console.log("📡 sendBeacon:", beaconSent ? "✅ Успешно поставлен в очередь" : "⚠️ Отклонен браузером");

  // Метод 2: Fetch как подстраховка
  // КРИТИЧЕСКИ ВАЖНО: mode: 'no-cors' и ОТСУТСТВИЕ явного Content-Type предотвращают блокировку
  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(data)
  })
  .then(() => console.log("✅ Fetch: запрос ушёл (fire-and-forget)"))
  .catch(err => console.error("❌ Fetch ошибка:", err));
}