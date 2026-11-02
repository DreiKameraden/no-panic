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
    npcColors: {}, 
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

    // 🆕 если это NPC и в CONFIG есть цвет — применяем
    const colorKey = (type === 'npc') ? state.currentNPC : type;
    const npcColor = CONFIG.npcColors?.[colorKey];
    if (npcColor) {
        msg.setAttribute('data-npc', colorKey);
        msg.style.setProperty('--npc-color', npcColor.color);
        msg.style.setProperty('--npc-bg', npcColor.bg);
        msg.style.setProperty('--npc-bg-light', npcColor.bgLight);
    }

    let avatar = '';
    if (type === 'user') avatar = '👤';
    else if (type === 'system') avatar = '⚠';
    else if (type === 'npc' && CONFIG.npcAvatar) avatar = CONFIG.npcAvatar();
    else if (CONFIG.npcs?.[type]?.emoji) avatar = CONFIG.npcs[type].emoji;
    else if (CONFIG.avatars[type]) avatar = CONFIG.avatars[type];

    const senderHtml = sender ? `<div class="msg-sender">${sender}</div>` : '';

    let translateHtml = '';
    if (translation) {
        translateHtml = `<button class="translate-btn" onclick="showTranslation(this, '${translation.replace(/'/g, "\\'")}')">🌐</button>`;
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

function showHint() {
    if (state.phase !== 'dialogue') return;
    const npc = CONFIG.npcs[state.currentNPC];
    if (!npc) return;
    const step = npc.steps.find(s => s.id === state.currentStepId);
    if (!step) return;
    addRobotMessage(`💡 Подсказка: <strong>${step.hint}</strong>`);
    state.hintUsed = true;
    state.currentInputFirstTry = false;
    if (window.innerWidth <= 900) {
        switchTab('robot');
        setTimeout(() => switchTab('chat'), 3000);
    }
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

function finishLesson(lessonNum, topicName) {
    state.robotExplained[lessonNum] = true;
    addRobotMessage(`✅ <strong>Часть ${lessonNum} изучена: ${topicName}!</strong> Теперь общайся с собеседником.<br><br>💡 Если забудешь — нажми 💡 ПОДСКАЗКА.`);
    enableAskRobot(true, 'МОЖЕТЕ ОБЩАТЬСЯ');
    if (window.innerWidth <= 900) switchTab('chat');
    setTimeout(() => startDialogue(), 800);
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


/* ---------- УНИВЕРСАЛЬНАЯ ОБРАБОТКА ДИАЛОГА ---------- */
async function handleDialogueInputBase(text, npcs, onEnd) {
    addMainMessage('user', text, 'ВЫ');
    document.getElementById('user-input').value = '';

    const npc = npcs[state.currentNPC];
    if (!npc) return null;

    const step = npc.steps.find(s => s.id === state.currentStepId);
    if (!step) return null;

    if (!matchesKeywords(text, step.keywords)) {
        setTimeout(() => {
            addMainMessage('npc', '??? Ich verstehe nicht. Kannst du das wiederholen?', npc.name);
            addRobotMessage(`💬 ${npc.name} не понял(а). Нажми 💡 для подсказки.`);
        }, 500);
        return null;
    }

    disableInput();
    await sleep(800);

    /* 🆕 показываем ВСЕ сообщения шага — циклом */
    const messages = step.messages || [];
    for (const msg of messages) {
        addMainMessage(msg.type, msg.text, msg.sender, msg.text_tr);
        await sleep(1200);
    }

    if (step.nextEvent) {
    state.currentNPC = step.nextEvent;
    }

    if (step.next === null) {
        if (onEnd) await onEnd(step, npc);
        return step;
    }

    state.currentStepId = step.next;

    /* 🆕 ищем следующий шаг в текущем (или уже переключённом) событии */
    const currentNpc = npcs[state.currentNPC];
    const nextStep = currentNpc.steps.find(s => s.id === state.currentStepId);
    await sleep(800);
    if (nextStep && nextStep.context) enableInput(nextStep.context);
    return step;
}


/* ---------- УНИВЕРСАЛЬНЫЙ ТЕСТ ---------- */
function showTest(opts) {
    state.currentTestFirstTry = true;

    const container = document.getElementById(opts.container || 'robot-messages');
    const block = document.createElement('div');

    let inner;
    if (opts.container === 'main-messages') {
        block.className = 'msg system';
        inner = `
            <div class="msg-avatar">${opts.avatar || '⚠'}</div>
            <div class="msg-body">
                <div class="test-block">
                    <div class="test-q">${opts.question}</div>
                    <div class="test-opts">
                        ${opts.options.map((opt, i) => `<button class="test-opt" data-idx="${i}">${opt.text}</button>`).join('')}
                    </div>
                </div>
            </div>
        `;
    } else {
        block.className = 'test-block';
        inner = `
            <div class="test-progress">ТЕСТ ${opts.testIdx} / ${opts.totalTests}</div>
            <div class="test-q">${opts.question}</div>
            <div class="test-opts">
                ${opts.options.map((opt, i) => `<button class="test-opt" data-idx="${i}">${opt.text}</button>`).join('')}
            </div>
        `;
    }

    block.innerHTML = inner;
    container.appendChild(block);
    container.scrollTop = container.scrollHeight;

    block.querySelectorAll('.test-opt').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.idx);
            const isCorrect = opts.options[idx].correct;
            const buttons = block.querySelectorAll('.test-opt');

            state.totalAttempts++;

            if (isCorrect) {
                buttons[idx].classList.add('correct');
                buttons.forEach(b => b.classList.add('locked'));
                state.testsPassed++;

                if (opts.points && (CONFIG.awardAlways || state.currentTestFirstTry)) {
                    state.score += opts.points;
                }
                updateStats();

                if (opts.onCorrect) opts.onCorrect();
            } else {
                buttons[idx].classList.add('wrong');
                buttons[idx].classList.add('locked');
                state.errors++;
                state.currentTestFirstTry = false;
                updateStats();

                if (opts.freezeOnWrong) freezeTime();
                if (opts.onWrong) opts.onWrong();
            }
        };
    });
}

/* ---------- ОБЁРТКА: ТЕСТ РОБОТА ---------- */
function addTestToRobot(question, options, callback, testIdx, totalTests) {
    showTest({
        container: 'robot-messages',
        avatar: '🤖',
        question,
        options,
        points: CONFIG.pointsPerTest,
        testIdx,
        totalTests,
        onCorrect: () => {
            const award = CONFIG.awardAlways || state.currentTestFirstTry;
            if (award) {
                addRobotMessage(`✅ Верно! <strong>+${CONFIG.pointsPerTest} очков</strong>`);
            } else {
                addRobotMessage('✅ Верно! (Очки не начислены — были ошибки)');
            }
            if (callback) setTimeout(callback, 600);
        },
        onWrong: () => {
            addRobotMessage('❌ Неверно. Попробуйте другой вариант.');
        }
    });
}

/* ---------- ОБЁРТКА: ПРОВЕРКА VERTER ---------- */
function showVerterTest(question, options, onCorrect, onWrong) {
    showTest({
        container: 'main-messages',
        avatar: '⚠',
        question,
        options,
        points: 50,
        freezeOnWrong: true,
        onCorrect,
        onWrong
    });
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

function submitInput() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;
    if (state.phase !== 'dialogue') return;
    if (CONFIG.onSubmitInput) CONFIG.onSubmitInput(text);
}


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
