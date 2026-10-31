/* ============================================================
   UTILS.JS — общий движок ZEITSCHLEIFE
   ============================================================ */

/* ---------- СОСТОЯНИЕ ---------- */
const state = {
    phase: 'boot',
    dialogueStep: 0,
    subPhase: 'ask_both',
    collectedInfo: {},
    robotExplained: false,
    freezes: 0,
    score: 0,
    testsPassed: 0,
    totalAttempts: 0,
    errors: 0,
    hintUsed: false,
    timeFrozen: false,
    timerSeconds: 3600,
    activeTab: 'chat',
    robotUnread: 0,
    currentTestFirstTry: true,
    currentInputFirstTry: true
};

/* ---------- КОНФИГ ДНЯ ---------- */
let CONFIG = {
    dayTag: 'TAG 1',
    chatHeader: '◈ КАНАЛ СВЯЗИ',
    bootMessages: ['ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ...'],
    avatars: {},
    npcAvatar: null,
    maxScore: 0,
    threshold: 0,
    nextUrl: null,
    nextLabel: '▶ ПЕРЕХОД',
    finalTitle: null,
    finalRows: () => [],
    pointsPerTest: 20,
    awardAlways: false,
    onBoot: null,
    onAskRobot: null,
    onSubmitInput: null,
    onShowHint: null
};

// 🆕 ============================================================
// 🆕 ПРОГРЕСС ДНЕЙ — нужно и utils.js (пишет), и start-screen.js (читает)
// 🆕 ============================================================
const COMPLETED_KEY = 'zeitschleife_completed';
const TOTAL_DAYS = 3;

function getCompletedDays() {
    try {
        return JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]');
    } catch { return []; }
}

function markDayCompleted(tag) {
    const days = getCompletedDays();
    const n = parseInt(tag, 10);
    if (n && !days.includes(n)) {
        days.push(n);
        days.sort((a, b) => a - b);
        localStorage.setItem(COMPLETED_KEY, JSON.stringify(days));
    }
}

function isDayUnlocked(tag) {
    const n = parseInt(tag, 10);
    if (n <= 1) return true;
    return getCompletedDays().includes(n - 1);
}

function resetProgress() {
    localStorage.removeItem(COMPLETED_KEY);
}
// 🆕 ============================================================
// 🆕 конец блока прогресса
// 🆕 ============================================================

function initGame(config) {
    CONFIG = { ...CONFIG, ...config };
    if (!CONFIG.threshold && CONFIG.maxScore) {
        CONFIG.threshold = Math.floor(CONFIG.maxScore * 0.7);
    }

    document.title = `ZEITSCHLEIFE // ${CONFIG.dayTag}`;
    const dayTagEl = document.getElementById('day-tag');
    if (dayTagEl) dayTagEl.innerText = `// ${CONFIG.dayTag}`;
    const chatHeaderEl = document.getElementById('main-chat-header');
    if (chatHeaderEl) chatHeaderEl.innerText = CONFIG.chatHeader;

    bindGlobalEvents();
    bootSequence();
}

/* ---------- СООБЩЕНИЯ ---------- */
function addMainMessage(type, text, sender, translation) {
    const container = document.getElementById('main-messages');
    const msg = document.createElement('div');
    msg.className = `msg ${type}`;

    let avatar = '';
    if (type === 'user') avatar = '👤';
    else if (type === 'system') avatar = '⚠';
    else if (type === 'npc' && CONFIG.npcAvatar) avatar = CONFIG.npcAvatar();
    else if (CONFIG.avatars[type]) avatar = CONFIG.avatars[type];

    const senderHtml = sender ? `<div class="msg-sender">${sender}</div>` : '';

    let translateHtml = '';
    if (translation) {
        translateHtml = `<button class="translate-btn" onclick="showTranslation(this, '${translation.replace(/'/g, "\\'")}')">🔍 ПЕРЕВОД</button>`;
    }

    msg.innerHTML = `
        <div class="msg-avatar">${avatar}</div>
        <div class="msg-body">
            ${senderHtml}
            <div class="msg-text">${text}</div>
            ${translateHtml}
        </div>
    `;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function showTranslation(btn, translation) {
    const body = btn.parentElement;
    const box = document.createElement('div');
    box.className = 'translation-box';
    box.innerHTML = translation;
    body.appendChild(box);
    btn.style.display = 'none';
}

function addRobotMessage(text, showBadge = true) {
    const container = document.getElementById('robot-messages');
    const msg = document.createElement('div');
    msg.className = 'msg robot';
    msg.innerHTML = `
        <div class="msg-avatar">🤖</div>
        <div class="msg-body">
            <div class="msg-sender">ASSISTENT-404</div>
            <div class="msg-text">${text}</div>
        </div>
    `;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;

    if (showBadge && window.innerWidth <= 900 && state.activeTab !== 'robot') {
        state.robotUnread++;
        updateRobotBadge();
    }
}

function updateRobotBadge() {
    const badge = document.getElementById('robot-badge');
    if (state.robotUnread > 0) {
        badge.innerText = state.robotUnread > 9 ? '9+' : state.robotUnread;
        badge.classList.add('show');
    } else {
        badge.classList.remove('show');
    }
}

/* ---------- ТАБЫ ---------- */
function switchTab(tab) {
    state.activeTab = tab;
    const chatPanel = document.getElementById('main-chat');
    const robotPanel = document.getElementById('robot-panel');
    const inputPanel = document.getElementById('input-panel');
    const robotFooter = document.getElementById('robot-footer');

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');

    if (tab === 'chat') {
        chatPanel.classList.remove('hidden-mobile');
        robotPanel.classList.remove('active-mobile');
        inputPanel.style.display = 'flex';
        robotFooter.classList.remove('active-mobile');
    } else {
        chatPanel.classList.add('hidden-mobile');
        robotPanel.classList.add('active-mobile');
        inputPanel.style.display = 'none';
        robotFooter.classList.add('active-mobile');
        state.robotUnread = 0;
        updateRobotBadge();
    }
}

/* ---------- НОРМАЛИЗАЦИЯ ---------- */
function normalizeText(text) {
    return text.toLowerCase().replace(/[.,!?]/g, '').replace(/ß/g, 'ss')
        .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').trim();
}

function matchesKeywords(text, keywords) {
    const normalized = normalizeText(text);
    return keywords.some(kw => normalized.includes(normalizeText(kw)));
}

/* ---------- ТЕСТЫ ---------- */
function addTestToRobot(question, options, callback, testIdx, totalTests) {
    state.currentTestFirstTry = true;

    const container = document.getElementById('robot-messages');
    const block = document.createElement('div');
    block.className = 'test-block';

    const optsHtml = options.map((opt, i) =>
        `<button class="test-opt" data-idx="${i}">${opt.text}</button>`
    ).join('');

    block.innerHTML = `
        <div class="test-progress">ТЕСТ ${testIdx} / ${totalTests}</div>
        <div class="test-q">${question}</div>
        <div class="test-opts">${optsHtml}</div>
    `;

    container.appendChild(block);
    container.scrollTop = container.scrollHeight;

    block.querySelectorAll('.test-opt').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.idx);
            handleTestAnswer(idx, options, block, callback);
        };
    });
}

function handleTestAnswer(idx, options, block, callback) {
    state.totalAttempts++;
    const buttons = block.querySelectorAll('.test-opt');

    if (options[idx].correct) {
        buttons[idx].classList.add('correct');
        buttons.forEach(b => b.classList.add('locked'));
        state.testsPassed++;

        const award = CONFIG.awardAlways || state.currentTestFirstTry;
        if (award) {
            state.score += CONFIG.pointsPerTest;
            addRobotMessage(`✅ Верно! <strong>+${CONFIG.pointsPerTest} очков</strong>`);
        } else {
            addRobotMessage('✅ Верно! (Очки не начислены — были ошибки)');
        }

        updateStats();
        if (callback) setTimeout(callback, 600);
    } else {
        buttons[idx].classList.add('wrong');
        buttons[idx].classList.add('locked');
        state.errors++;
        state.currentTestFirstTry = false;
        updateStats();
        addRobotMessage('❌ Неверно. Попробуйте другой вариант.');
    }
}

/* ---------- СТАТИСТИКА / INPUT / ASK ---------- */
function updateStats() {
    document.getElementById('score').innerText = state.score;
    document.getElementById('freezes').innerText = state.freezes;
    const errorsEl = document.getElementById('errors');
    if (errorsEl) {
        errorsEl.innerText = state.errors;
        if (state.errors > 0) errorsEl.classList.add('danger');
        else errorsEl.classList.remove('danger');
    }
}

function setInputContext(text) {
    const ctx = document.getElementById('input-context');
    if (text) { ctx.innerHTML = text; ctx.style.display = 'block'; }
    else { ctx.style.display = 'none'; }
}

function enableInput(context) {
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const hintBtn = document.getElementById('hint-btn');

    input.disabled = false;
    input.placeholder = 'Напишите на немецком...';
    input.value = '';
    sendBtn.disabled = false;
    hintBtn.disabled = false;

    setInputContext(context);

    if (window.innerWidth > 900) setTimeout(() => input.focus(), 100);
}

function disableInput() {
    document.getElementById('user-input').disabled = true;
    document.getElementById('send-btn').disabled = true;
    document.getElementById('hint-btn').disabled = true;
    setInputContext(null);
}

function enableAskRobot(enabled, statusText) {
    document.getElementById('robot-ask-btn').disabled = !enabled;
    if (statusText) document.getElementById('robot-status').innerText = statusText;
}

/* ---------- ТАЙМЕР / FREEZE ---------- */
function startTimer() {
    setInterval(() => {
        if (state.timeFrozen) return;
        if (state.timerSeconds > 0) {
            state.timerSeconds--;
            const min = Math.floor(state.timerSeconds / 60);
            const sec = state.timerSeconds % 60;
            document.getElementById('timer').innerText =
                `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        }
    }, 1000);
}

function freezeTime() {
    state.freezes++;
    state.timeFrozen = true;
    updateStats();

    const overlay = document.getElementById('freeze-overlay');
    overlay.classList.add('active');

    setTimeout(() => {
        overlay.classList.remove('active');
        state.timeFrozen = false;
    }, 3000);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/* ---------- BOOT ---------- */
async function bootSequence() {
    const bootText = document.getElementById('boot-text');

    for (const msg of CONFIG.bootMessages) {
        bootText.innerText = msg;
        await sleep(700);
    }

    await sleep(500);
    document.getElementById('boot-screen').style.display = 'none';
    document.getElementById('main-container').classList.add('active');

    startTimer();
    if (CONFIG.onBoot) CONFIG.onBoot();
}

/* ---------- ОБЩИЙ ФИНАЛ ---------- */
function showFinalStats() {
    const percent = CONFIG.maxScore > 0
        ? Math.round((state.score / CONFIG.maxScore) * 100)
        : 0;

    document.getElementById('fs-title').innerText =
        CONFIG.finalTitle || `◢ ${CONFIG.dayTag} ABGESCHLOSSEN ◣`;

    document.getElementById('fs-rows').innerHTML = CONFIG.finalRows()
        .map(r => `<div class="final-row"><span class="final-label">${r.label}</span><span class="final-value">${r.value}</span></div>`)
        .join('');

    document.getElementById('cond-threshold').innerText = CONFIG.threshold;

    const scoreOk = CONFIG.maxScore === 0 || state.score >= CONFIG.threshold;
    const freezesOk = state.freezes === 0;
    const canProceed = scoreOk && freezesOk && CONFIG.nextUrl;

    const condScore = document.getElementById('cond-score');
    const condFreezes = document.getElementById('cond-freezes');
    const lockReason = document.getElementById('lock-reason');
    const nextBtn = document.getElementById('next-btn');

    if (scoreOk) {
        condScore.innerText = `✓ (${state.score}/${CONFIG.threshold})`;
        condScore.className = 'status-ok';
    } else {
        condScore.innerText = `✗ (${state.score}/${CONFIG.threshold})`;
        condScore.className = 'status-fail';
    }

    if (freezesOk) {
        condFreezes.innerText = '✓ (0)';
        condFreezes.className = 'status-ok';
    } else {
        condFreezes.innerText = `✗ (${state.freezes})`;
        condFreezes.className = 'status-fail';
    }

    if (canProceed) {
        nextBtn.classList.remove('locked');
        nextBtn.onclick = null;
        nextBtn.setAttribute('href', CONFIG.nextUrl);
        nextBtn.innerText = CONFIG.nextLabel;
        lockReason.style.display = 'none';

        // 🆕 отметить текущий день пройденным (для стартового экрана)
        const currentTag = new URLSearchParams(location.search).get('tag');
        if (currentTag) markDayCompleted(currentTag);
        // 🆕 конец
    } else {
        nextBtn.classList.add('locked');
        nextBtn.onclick = (e) => e.preventDefault();
        nextBtn.removeAttribute('href');
        nextBtn.innerText = CONFIG.nextUrl ? CONFIG.nextLabel : '◼ КОНЕЦ';

        const reasons = [];
        if (!scoreOk) reasons.push(`Недостаточно очков: ${state.score} из ${CONFIG.threshold} необходимых`);
        if (!freezesOk) reasons.push(`Есть ${state.freezes} заморозок времени (нужно 0)`);

        if (reasons.length) {
            lockReason.innerHTML = '🔒 <strong>Переход заблокирован:</strong><br>• ' + reasons.join('<br>• ');
            lockReason.style.display = 'block';
        } else {
            lockReason.style.display = 'none';
        }
    }

    document.getElementById('final-stats').classList.add('active');
}

/* ---------- ДЕЛЕГАТЫ ---------- */
function askRobot()    { if (CONFIG.onAskRobot) CONFIG.onAskRobot(); }
function submitInput() { if (CONFIG.onSubmitInput) CONFIG.onSubmitInput(); }
function showHint()    { if (CONFIG.onShowHint) CONFIG.onShowHint(); }

/* ---------- ГЛОБАЛЬНЫЕ ОБРАБОТЧИКИ ---------- */
function bindGlobalEvents() {
    document.getElementById('user-input').addEventListener('keypress', e => {
        if (e.key === 'Enter' && !document.getElementById('send-btn').disabled) {
            submitInput();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            document.getElementById('main-chat').classList.remove('hidden-mobile');
            document.getElementById('robot-panel').classList.remove('active-mobile');
            document.getElementById('input-panel').style.display = 'flex';
            document.getElementById('robot-footer').classList.remove('active-mobile');
        }
    });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', e => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) e.preventDefault();
        lastTouchEnd = now;
    }, false);
}
