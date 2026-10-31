/* ============================================================
   TAG1.JS — Марк, Лиза, Мия; день 1 «Знакомство»
   ============================================================ */

const npcs = {
    mark: {
        name: 'Mark',
        emoji: '🧑‍💻',
        intro: {
            firstMessage: 'Jonas? Jonas, bist du das?',
            firstMessage_tr: 'Йонас? Йонас, это ты?'
        },
        steps: [
            {
                id: 'intro',
                keywords: ['bin', 'heiße', 'heisse', 'name'],
                context: '📝 Ответьте на вопрос',
                hint: 'Ich bin [имя]. или Ich heiße [имя].',
                npcSays: 'Oh. Entschuldigung. Ich habe dich mit jemandem verwechselt.',
                npcSays_tr: 'О. Извини. Я тебя с кем-то перепутал.',
                npcThen: 'Wie heißt du?',
                npcThen_tr: 'Как тебя зовут?',
                next: 'after_name'
            },
            {
                id: 'after_name',
                keywords: ['bin', 'heiße', 'heisse', 'name'],
                context: '📝 Назови своё имя',
                hint: 'Ich bin [имя]. или Ich heiße [имя].',
                npcSays: 'Freut mich. Ich bin Mark.',
                npcSays_tr: 'Приятно познакомиться. Я Марк.',
                next: 'ask_from'
            },
            {
                id: 'ask_from',
                keywords: ['woher', 'kommst'],
                context: '📝 Спроси, откуда он',
                hint: 'Woher kommst du?',
                npcSays: 'Ich komme aus Leipzig. Aber jetzt wohne ich in Berlin. Schon seit zehn Jahren.',
                npcSays_tr: 'Я из Лейпцига. Но сейчас живу в Берлине. Уже десять лет.',
                next: 'ask_job'
            },
            {
                id: 'ask_job',
                keywords: ['arbeit', 'beruf', 'machst', 'studier'],
                context: '📝 Спроси, чем он занимается',
                hint: 'Was machst du? или Was bist du von Beruf?',
                npcSays: 'Ich arbeite als Programmierer. Ich repariere alte Computer. Klingt langweilig, oder?',
                npcSays_tr: 'Я работаю программистом. Ремонтирую старые компьютеры. Звучит скучно, да?',
                next: 'ask_hobby'
            },
            {
                id: 'ask_hobby',
                keywords: ['hobby', 'hobbys', 'freizeit', 'gern', 'kaffee'],
                context: '📝 Спроси о хобби',
                hint: 'Was machst du gern? или Was ist dein Hobby?',
                npcSays: 'Ich repariere gern alte Computer. Und ich trinke gern Kaffee. Viel Kaffee. Ohne Kaffee kein Code.',
                npcSays_tr: 'Люблю ремонтировать старые компьютеры. И люблю кофе. Много кофе. Без кофе нет кода.',
                next: 'ask_jonas'
            },
            {
                id: 'ask_jonas',
                keywords: ['jonas', 'wer', 'kennst'],
                context: '📝 Спроси: «Кто такой Йонас?»',
                hint: 'Wer ist Jonas?',
                npcSays: 'Jonas… Er war mein Freund. Wir haben zusammen gearbeitet. Er wollte immer alles reparieren. Auch wenn es kaputt war. Er sagte: «Ich gebe nicht auf». Und dann…',
                npcSays_tr: 'Йонас… Он был моим другом. Мы вместе работали. Он всегда хотел всё починить. Даже когда это было сломано. Он говорил: «Я не сдаюсь». А потом…',
                npcThen: 'Ich muss jetzt gehen. Tschüss.',
                npcThen_tr: 'Мне пора идти. Пока.',
                next: null
            }
        ]
    },
    lisa: {
        name: 'Lisa',
        emoji: '👩',
        intro: {
            firstMessage: 'Jonas? Bist du das? Ich warte hier schon so lange.',
            firstMessage_tr: 'Йонас? Это ты? Я жду здесь уже так долго.'
        },
        steps: [
            {
                id: 'intro',
                keywords: ['bin', 'heiße', 'heisse', 'name'],
                context: '📝 Ответьте на вопрос',
                hint: 'Ich bin [имя]. или Ich heiße [имя].',
                npcSays: 'Oh… Entschuldigung. Ich habe dich verwechselt. Du siehst ihm ähnlich.',
                npcSays_tr: 'О… Извини. Я тебя перепутала. Ты похож на него.',
                npcThen: 'Wie heißt du?',
                npcThen_tr: 'Как тебя зовут?',
                next: 'after_name'
            },
            {
                id: 'after_name',
                keywords: ['bin', 'heiße', 'heisse', 'name'],
                context: '📝 Назови своё имя',
                hint: 'Ich bin [имя]. или Ich heiße [имя].',
                npcSays: 'Freut mich. Ich bin Lisa.',
                npcSays_tr: 'Приятно познакомиться. Я Лиза.',
                next: 'ask_from'
            },
            {
                id: 'ask_from',
                keywords: ['woher', 'kommst'],
                context: '📝 Спроси, откуда она',
                hint: 'Woher kommst du?',
                npcSays: 'Ich komme aus München...',
                npcSays_tr: 'Я из Мюнхена...',
                next: 'ask_job'
            },
            {
                id: 'ask_job',
                keywords: ['arbeit', 'beruf', 'machst', 'studier'],
                context: '📝 Спроси, чем она занимается',
                hint: 'Was machst du? или Was bist du von Beruf?',
                npcSays: 'Ich arbeite als Architektin. Ich zeichne Häuser. Alte Häuser, neue Häuser. Ich zeichne fast immer.',
                npcSays_tr: 'Я работаю архитектором. Рисую дома. Старые, новые. Я рисую почти всегда.',
                next: 'ask_home'
            },
            {
                id: 'ask_home',
                keywords: ['wohnst', 'wohn', 'lebst'],
                context: '📝 Спроси, где она живёт',
                hint: 'Wo wohnst du?',
                npcSays: 'Hier, in Berlin...',
                npcSays_tr: 'Здесь, в Берлине...',
                next: 'ask_hobby'
            },
            {
                id: 'ask_hobby',
                keywords: ['hobby', 'hobbys', 'freizeit', 'gern', 'wartest', 'warte'],
                context: '📝 Спроси о хобби',
                hint: 'Was machst du gern? или Was ist dein Hobby?',
                npcSays: 'Ich zeichne gern. Und ich gehe gern spazieren. Er ging auch gern hier. Wir waren oft hier zusammen.',
                npcSays_tr: 'Люблю рисовать. И люблю гулять. Он тоже любил здесь гулять. Мы часто были здесь вместе.',
                next: 'ask_jonas'
            },
            {
                id: 'ask_jonas',
                keywords: ['jonas', 'wer', 'kennst'],
                context: '📝 Спроси: «Кто такой Йонас?»',
                hint: 'Wer ist Jonas?',
                npcSays: 'Jonas… Er war… ich erinnere mich an seine Stimme. Er sagte immer: «Ich komme zurück». Und ich warte. Ich warte immer noch.',
                npcSays_tr: 'Йонас… Он был… я помню его голос. Он всегда говорил: «Я вернусь». И я жду. Я всё ещё жду.',
                npcThen: 'Ich muss jetzt gehen. Tschüss.',
                npcThen_tr: 'Мне пора идти. Пока.',
                next: null
            }
        ]
    },
    mia: {
        name: 'Mia',
        emoji: '👧',
        intro: {
            firstMessage: 'Onkel Jonas! Bist du endlich da? Du kommst immer zu spät!',
            firstMessage_tr: 'Дядя Йонас! Ты наконец пришёл? Ты всегда опаздываешь!'
        },
        steps: [
            {
                id: 'intro',
                keywords: ['bin', 'heiße', 'heisse', 'name'],
                context: '📝 Ответьте на вопрос',
                hint: 'Ich bin [имя]. или Ich heiße [имя].',
                npcSays: 'Oh. Du bist nicht Onkel Jonas? Schade. Du siehst ein bisschen wie er aus.',
                npcSays_tr: 'О. Ты не дядя Йонас? Жалко. Ты немного похож на него.',
                npcThen: 'Wie heißt du?',
                npcThen_tr: 'Как тебя зовут?',
                next: 'after_name'
            },
            {
                id: 'after_name',
                keywords: ['bin', 'heiße', 'heisse', 'name'],
                context: '📝 Назови своё имя',
                hint: 'Ich bin [имя]. или Ich heiße [имя].',
                npcSays: 'Freut mich. Ich bin Mia. Ich bin zwölf. Fast dreizehn!',
                npcSays_tr: 'Приятно познакомиться. Я Мия. Мне двенадцать. Почти тринадцать!',
                next: 'ask_from'
            },
            {
                id: 'ask_from',
                keywords: ['woher', 'kommst'],
                context: '📝 Спроси, откуда она',
                hint: 'Woher kommst du?',
                npcSays: 'Ich komme aus Hamburg. Aber ich wohne jetzt bei meiner Mama in Berlin. Papa wohnt noch in Hamburg.',
                npcSays_tr: 'Я из Гамбурга. Но сейчас живу у мамы в Берлине. Папа всё ещё в Гамбурге.',
                next: 'ask_job'
            },
            {
                id: 'ask_job',
                keywords: ['arbeit', 'beruf', 'machst', 'schule', 'lernst', 'gehst'],
                context: '📝 Спроси, чем она занимается / про школу',
                hint: 'Was machst du? / Wie ist es in der Schule?',
                npcSays: 'Ich gehe in die Schule. Ich lerne gern Englisch. Mathe ist doof. Aber Englisch ist toll!',
                npcSays_tr: 'Я хожу в школу. Люблю учить английский. Математика дурацкая. А английский классный!',
                next: 'ask_home'
            },
            {
                id: 'ask_home',
                keywords: ['wohnst', 'wohn', 'lebst'],
                context: '📝 Спроси, где она живёт',
                hint: 'Wo wohnst du?',
                npcSays: 'Bei meiner Mama. Onkel Jonas wohnte auch hier. Im Haus nebenan. Aber er kommt nicht mehr. Er kommt nie mehr.',
                npcSays_tr: 'У мамы. Дядя Йонас тоже жил здесь. В соседнем доме. Но он больше не приходит. Он никогда не приходит.',
                next: 'ask_jonas'
            },
            {
                id: 'ask_jonas',
                keywords: ['jonas', 'wer', 'kennst'],
                context: '📝 Спроси: «Кто такой Йонас?»',
                hint: 'Wer ist Jonas?',
                npcSays: 'Onkel Jonas? Er war lustig. Er hat immer Steine für mich gefunden. Aber dann ist er einfach verschwunden.',
                npcSays_tr: 'Дядя Йонас? Он был веселым. Он всегда находил для меня камни. А потом он просто исчез.',
                next: 'ask_why_jonas'
            },
            {
                id: 'ask_why_jonas',
                keywords: ['jonas', 'warum', 'worum', 'kommt nicht', 'nicht kommt', 'krank'],
                context: '📝 Спроси: «Почему Йонас не приходит?»',
                hint: 'Warum kommt Jonas nicht?',
                npcSays: 'Warum? Ich weiß nicht. Mama sagt, er ist krank. Aber das glaube ich nicht. Er kommt einfach nicht. Vielleicht will er nicht. Vielleicht hat er uns vergessen.',
                npcSays_tr: 'Почему? Я не знаю. Мама говорит, он болен. Но я в это не верю. Он просто не приходит. Может, он не хочет. Может, он нас забыл.',
                npcThen: 'Ich muss jetzt gehen. Tschüss.',
                npcThen_tr: 'Мне пора идти. Пока.',
                next: null
            }

        ]
    }
};

const npcOrder = ['mark', 'lisa', 'mia'];
let currentNPCIndex = 0;

async function tag1Intro() {
    state.phase = 'intro';
    state.collectedInfo = {
        mark: { name: null, from: null, job: null, home: null, hobby: null, jonas: null },
        lisa: { name: null, from: null, job: null, home: null, hobby: null, jonas: null },
        mia:  { name: null, from: null, job: null, home: null, hobby: null, jonas: null }
    };
    state.robotExplained = { 1: false, 2: false, 3: false };
    state.currentStepId = 'intro';

    await sleep(500);
    addMainMessage('system', '⚠ ВХОДЯЩЕЕ СООБЩЕНИЕ ОТ НЕИЗВЕСТНОГО "VERTER"');
    await sleep(1000);
    addMainMessage('verter', 'Ты попал во <strong>временную петлю</strong>. Система нестабильна.', 'VERTER [неизвестный]');
    await sleep(1500);
    addMainMessage('verter', 'Время зациклено. Выход — только через выполнение задания. Поговори с каждым. Задавай вопросы. Узнай, кто они.', 'VERTER [неизвестный]');
    await sleep(1500);
    addMainMessage('verter', '⚠ Память повреждена. Твой помощник <strong>ASSISTENT-404</strong> объяснит грамматику. Только после этого ты сможешь говорить.', 'VERTER [неизвестный]');
    await sleep(1500);
    addMainMessage('verter', 'После каждого знакомства — проверка. Неправильный ответ — время заморозится.', 'VERTER [неизвестный]');
    await sleep(1000);
    addMainMessage('verter', 'Подключаю...', 'VERTER [неизвестный]');
    await sleep(2000);
    startNPCMeeting(0);
}

async function startNPCMeeting(npcIdx) {
    currentNPCIndex = npcIdx;
    const npcKey = npcOrder[npcIdx];
    state.currentNPC = npcKey;
    state.currentStepId = 'intro';
    state.phase = `npc${npcIdx + 1}_meeting`;

    const npc = npcs[npcKey];
    addMainMessage('system', `⚠ ПОДКЛЮЧЕНИЕ К СУБЪЕКТУ #${npcIdx + 1}: ${npc.name.toUpperCase()}`);
    await sleep(1500);
    addMainMessage('npc', npc.intro.firstMessage, npc.name, npc.intro.firstMessage_tr);
    await sleep(1000);

    const npcNum = npcIdx + 1;

    if (!state.robotExplained[npcNum]) {
        addMainMessage('verter', 'Собеседник тебя с кем-то путает. Нажми <strong>🤖 СПРОСИТЬ РОБОТА</strong>...', 'VERTER [неизвестный]');
        enableAskRobot(true, 'НАЖМИТЕ ДЛЯ ОБУЧЕНИЯ');
        disableInput();
    } else {
        addMainMessage('verter', 'Собеседник тебя с кем-то путает. Ответь ему.', 'VERTER [неизвестный]');
        enableAskRobot(false, 'ОБЩАЙТЕСЬ');
        setTimeout(() => startDialogue(), 800);
    }

    if (window.innerWidth <= 900) switchTab('chat');
}

function tag1AskRobot() {
    const npcNum = currentNPCIndex + 1;
    if (state.robotExplained[npcNum]) {
        addRobotMessage('Я уже объяснил все правила для этого собеседника. Общайся!');
        return;
    }
    enableAskRobot(false, 'ОБУЧЕНИЕ В ПРОЦЕССЕ...');
    if (npcNum === 1) robotLesson1();
    else if (npcNum === 2) robotLesson2();
    else if (npcNum === 3) robotLesson3();
}

async function robotLesson3() {
    addRobotMessage('🔍 Анализирую собеседника: <strong>Mark</strong>. <strong>Тема:</strong> глагол <em>sein</em>.');
    await sleep(600);
    addRobotMessage(`<div class="grammar-block"><h4>📖 ГЛАГОЛ «sein» (быть)</h4><p class="rule">Неправильный глагол. Запомни наизусть:</p><ul><li><strong>ich bin</strong> — я есть</li><li><strong>du bist</strong> — ты есть</li><li><strong>er/sie/es ist</strong> — он/она/оно есть</li><li><strong>wir sind</strong> — мы есть</li><li><strong>ihr seid</strong> — вы есть</li><li><strong>sie/Sie sind</strong> — они/Вы есть</li></ul><div class="example">Ich <strong>bin</strong> Mark. — Я Марк.</div><div class="example">Du <strong>bist</strong> Student. — Ты студент.</div></div>`);
    await sleep(500);
    await new Promise(resolve => addTestToRobot('Выбери правильную форму: «Ich ___ Mark.»', [{ text: 'bin', correct: true }, { text: 'bist', correct: false }, { text: 'ist', correct: false }, { text: 'sind', correct: false }], resolve, 1, 3));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('Выбери правильную форму: «Du ___ Lisa.»', [{ text: 'bin', correct: false }, { text: 'bist', correct: true }, { text: 'ist', correct: false }, { text: 'sind', correct: false }], resolve, 2, 3));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('Выбери правильную форму: «Sie ___ Mia.»', [{ text: 'bin', correct: false }, { text: 'bist', correct: false }, { text: 'ist', correct: true }, { text: 'sind', correct: false }], resolve, 3, 3));
    await sleep(500);
    finishLesson(1, 'ГЛАГОЛ SEIN');
}

async function robotLesson2() {
    addRobotMessage('🔍 Анализирую собеседника: <strong>Lisa</strong>. <strong>Тема:</strong> спряжение правильных глаголов.');
    await sleep(600);
    addRobotMessage(`<div class="grammar-block"><h4>📖 СПРЯЖЕНИЕ ПРАВИЛЬНЫХ ГЛАГОЛОВ (Präsens)</h4><p class="rule">Основа + окончание по лицу:</p><ul><li><strong>ich</strong> — <strong>-e</strong> → ich komm<strong>e</strong></li><li><strong>du</strong> — <strong>-st</strong> → du komm<strong>st</strong></li><li><strong>er/sie/es</strong> — <strong>-t</strong> → er komm<strong>t</strong></li><li><strong>wir</strong> — <strong>-en</strong> → wir komm<strong>en</strong></li><li><strong>ihr</strong> — <strong>-t</strong> → ihr komm<strong>t</strong></li><li><strong>sie/Sie</strong> — <strong>-en</strong> → sie komm<strong>en</strong></li></ul><div class="example">Ich <strong>komme</strong> aus Berlin.</div><div class="example">Du <strong>wohnst</strong> in München.</div><div class="example">Er <strong>arbeitet</strong> als Programmierer.</div></div>`);
    await sleep(500);
    await new Promise(resolve => addTestToRobot('Выбери правильную форму: «Ich ___ aus Berlin.» (kommen)', [{ text: 'komme', correct: true }, { text: 'kommst', correct: false }, { text: 'kommt', correct: false }, { text: 'kommen', correct: false }], resolve, 1, 3));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('Выбери правильную форму: «Du ___ in München.» (wohnen)', [{ text: 'wohne', correct: false }, { text: 'wohnst', correct: true }, { text: 'wohnt', correct: false }, { text: 'wohnen', correct: false }], resolve, 2, 3));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('Выбери правильную форму: «Er ___ als Programmierer.» (arbeiten)', [{ text: 'arbeite', correct: false }, { text: 'arbeitest', correct: false }, { text: 'arbeitet', correct: true }, { text: 'arbeiten', correct: false }], resolve, 3, 3));
    await sleep(500);
    finishLesson(2, 'СПРЯЖЕНИЕ ГЛАГОЛОВ');
}

async function robotLesson1() {
    addRobotMessage('🔍 Анализирую собеседника: <strong>Mia</strong>. <strong>Тема:</strong> W-вопросы.');
    await sleep(600);
    addRobotMessage(`<div class="grammar-block"><h4>📖 W-ВОПРОСЫ</h4><p class="rule">W-слово + глагол (2-е место) + подлежащее</p><ul><li><strong>Wie heißt du?</strong> — Как тебя зовут?</li><li><strong>Woher kommst du?</strong> — Откуда ты?</li><li><strong>Was machst du?</strong> — Что ты делаешь?</li><li><strong>Wo wohnst du?</strong> — Где ты живёшь?</li><li><strong>Was sind deine Hobbys?</strong> — Какие у тебя хобби?</li><li><strong>Wer ist Jonas?</strong> — Кто такой Йонас?</li></ul><p style="margin-top:6px;color:#ff99ff;">💡 Сравни: «Du <strong>heißt</strong> Mark» → «Wie <strong>heißt</strong> du?» — глагол перед подлежащим!</p></div>`);
    await sleep(500);
    await new Promise(resolve => addTestToRobot('Как спросить «Как тебя зовут?»', [{ text: 'Wer du heißt?', correct: false }, { text: 'Wie heißt du?', correct: true }, { text: 'Wie du heißt?', correct: false }, { text: 'Heißt wie du?', correct: false }], resolve, 1, 6));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('Как спросить «Откуда ты?»', [{ text: 'Wo kommst du?', correct: false }, { text: 'Woher du kommst?', correct: false }, { text: 'Woher kommst du?', correct: true }, { text: 'Kommst du woher?', correct: false }], resolve, 2, 6));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('Как спросить «Что ты делаешь?»', [{ text: 'Was du machst?', correct: false }, { text: 'Was machst du?', correct: true }, { text: 'Machst was du?', correct: false }, { text: 'Du was machst?', correct: false }], resolve, 3, 6));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('Как спросить «Где ты живёшь?»', [{ text: 'Wo du wohnst?', correct: false }, { text: 'Wo wohnst du?', correct: true }, { text: 'Wohnst wo du?', correct: false }, { text: 'Du wohnst wo?', correct: false }], resolve, 4, 6));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('Как спросить «Какие у тебя хобби?»', [{ text: 'Was sind deine Hobbys?', correct: true }, { text: 'Was deine Hobbys sind?', correct: false }, { text: 'Was ist deine Hobbys', correct: false }, { text: 'Du was gern machst?', correct: false }], resolve, 5, 6));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('Как спросить «Кто такой Йонас?»', [{ text: 'Wer Jonas ist?', correct: false }, { text: 'Wer ist Jonas?', correct: true }, { text: 'Ist wer Jonas?', correct: false }, { text: 'Jonas wer ist?', correct: false }], resolve, 6, 6));
    await sleep(500);
    finishLesson(3, 'W-ВОПРОСЫ');
}

function finishLesson(lessonNum, topicName) {
    state.robotExplained[lessonNum] = true;
    addRobotMessage(`✅ <strong>Часть ${lessonNum} изучена: ${topicName}!</strong> Теперь общайся с собеседником.<br><br>💡 Если забудешь — нажми 💡 ПОДСКАЗКА.`);
    enableAskRobot(true, 'МОЖЕТЕ ОБЩАТЬСЯ');
    if (window.innerWidth <= 900) switchTab('chat');
    setTimeout(() => startDialogue(), 800);
}

function startDialogue() {
    state.phase = 'dialogue';
    state.currentStepId = 'intro';
    const npc = npcs[state.currentNPC];
    enableInput(npc.steps[0].context);
}

function tag1SubmitInput() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;
    if (state.phase === 'dialogue') handleDialogueInput(text);
}

async function handleDialogueInput(text) {
    addMainMessage('user', text, 'ВЫ');
    document.getElementById('user-input').value = '';

    const npc = npcs[state.currentNPC];
    const step = npc.steps.find(s => s.id === state.currentStepId);
    if (!step) return;

    const matched = (step.id === 'intro' || step.id === 'after_name') || matchesKeywords(text, step.keywords);
    if (!matched) {
        setTimeout(() => {
            addMainMessage('npc', '??? Ich verstehe nicht. Kannst du das wiederholen?', npc.name);
            addRobotMessage(`💬 ${npc.name} не понял(а). Нажми 💡 для подсказки.`);
        }, 500);
        return;
    }

    disableInput();
    await sleep(800);

    addMainMessage('npc', step.npcSays, npc.name, step.npcSays_tr);
    await sleep(1200);

    if (step.npcThen) {
        addMainMessage('npc', step.npcThen, npc.name, step.npcThen_tr);
        await sleep(1000);
    }

    if (step.id === 'after_name') state.collectedInfo[state.currentNPC].name = npc.name;
    if (step.id === 'ask_from') {
        const m = step.npcSays.match(/aus ([A-Za-zÄÖÜäöüß]+)/);
        if (m) state.collectedInfo[state.currentNPC].from = m[1];
    }
    if (step.id === 'ask_job') state.collectedInfo[state.currentNPC].job = step.npcSays;
    if (step.id === 'ask_home') state.collectedInfo[state.currentNPC].home = step.npcSays;
    if (step.id === 'ask_hobby') state.collectedInfo[state.currentNPC].hobby = step.npcSays;
    if (step.id === 'ask_jonas') state.collectedInfo[state.currentNPC].jonas = step.npcSays;

    if (step.next === null) {
        await sleep(800);
        verterCheck();
        return;
    }

    state.currentStepId = step.next;
    const nextStep = npc.steps.find(s => s.id === step.next);
    await sleep(800);
    enableInput(nextStep.context);
}

function tag1ShowHint() {
    if (state.phase !== 'dialogue') return;
    const npc = npcs[state.currentNPC];
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

async function verterCheck() {
    state.phase = 'verter_check';
    const npcKey = state.currentNPC;
    const npc = npcs[npcKey];

    addMainMessage('system', '⚠ ВХОДЯЩЕЕ СООБЩЕНИЕ ОТ VERTER');
    await sleep(1000);
    addMainMessage('verter', `Ты поговорил с <strong>${npc.name}</strong>. Кто он?`, 'VERTER [неизвестный]');
    await sleep(1000);

    const profiles = {
        mark: 'Программист из Лейпцига. Ремонтирует компьютеры.',
        lisa: 'Архитектор из Мюнхена. Рисует дома.',
        mia:  'Школьница из Гамбурга. Коллекционирует камни.'
    };

    const correctAnswer = profiles[npcKey];
    const wrongAnswers = npcOrder.filter(k => k !== npcKey).map(k => profiles[k]);

    const allOptions = shuffle([
        { text: correctAnswer, correct: true },
        ...wrongAnswers.map(w => ({ text: w, correct: false }))
    ]);

    const container = document.getElementById('main-messages');
    const block = document.createElement('div');
    block.className = 'msg system';
    block.innerHTML = `
        <div class="msg-avatar">⚠</div>
        <div class="msg-body">
            <div class="test-block">
                <div class="test-q">Что ты узнал о ${npc.name}?</div>
                <div class="test-opts">
                    ${allOptions.map((opt, i) => `<button class="test-opt" data-idx="${i}">${opt.text}</button>`).join('')}
                </div>
            </div>
        </div>
    `;
    container.appendChild(block);
    container.scrollTop = container.scrollHeight;

    state.currentTestFirstTry = true;
    block.querySelectorAll('.test-opt').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.idx);
            handleVerterAnswer(idx, allOptions, block, npcKey);
        };
    });
}

async function handleVerterAnswer(idx, options, block, npcKey) {
    state.totalAttempts++;
    const buttons = block.querySelectorAll('.test-opt');

    if (options[idx].correct) {
        buttons[idx].classList.add('correct');
        buttons.forEach(b => b.classList.add('locked'));
        state.score += 50;
        updateStats();

        await sleep(800);
        addMainMessage('verter', '✅ Верно. Фрагмент восстановлен.', 'VERTER [неизвестный]');

        await sleep(1500);
        moveToNextNPC();
    } else {
        buttons[idx].classList.add('wrong');
        buttons[idx].classList.add('locked');
        state.errors++;
        state.currentTestFirstTry = false;
        updateStats();

        freezeTime();

        await sleep(3000);
        addMainMessage('verter', '❌ Неверно! <strong>Время заморожено.</strong> Попробуй ещё раз.', 'VERTER [неизвестный]');
    }
}

async function moveToNextNPC() {
    currentNPCIndex++;
    if (currentNPCIndex >= npcOrder.length) {
        await finale();
    } else {
        addMainMessage('verter', 'Переход к следующему субъекту...', 'VERTER [неизвестный]');
        await sleep(1500);
        startNPCMeeting(currentNPCIndex);
    }
}

async function finale() {
    state.phase = 'finale';

    addMainMessage('system', '⚠ КРИТИЧЕСКОЕ СООБЩЕНИЕ ОТ VERTER');
    await sleep(1000);
    addMainMessage('verter', 'Протокол завершён.', 'VERTER [неизвестный]');
    await sleep(1500);
    addMainMessage('verter', 'Время разомкнуто. Доступ к следующему дню разрешён.', 'VERTER [неизвестный]');
    await sleep(1500);
    addMainMessage('verter', 'Отдыхай. Петля ждёт.', 'VERTER [неизвестный]');
    await sleep(2000);
    showFinalStats();
}

initGame({
    dayTag: 'TAG 1',
    chatHeader: '◈ КАНАЛ СВЯЗИ // ФРАГМЕНТ 1: ЗНАКОМСТВО',
    bootMessages: [
        'ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ...',
        'ОБНАРУЖЕНА АНОМАЛИЯ...',
        'ЗАГРУЗКА ФРАГМЕНТА ПАМЯТИ #1...',
        'ПОДКЛЮЧЕНИЕ К СУБЪЕКТАМ...'
    ],
    avatars: { verter: '🎭' },
    npcAvatar: () => npcs[state.currentNPC]?.emoji || '👤',
    maxScore: 390,
    nextUrl: 'tags.html?tag=2',
    nextLabel: '▶ ПЕРЕХОД К TAG 2',
    pointsPerTest: 20,
    awardAlways: true,
    finalTitle: '◢ ФРАГМЕНТ 1 ВОССТАНОВЛЕН ◣',
    finalRows: () => [
        { label: 'Воспоминаний:',    value: '3 / 3' },
        { label: 'Тестов пройдено:', value: state.testsPassed },
        { label: 'Всего попыток:',   value: state.totalAttempts },
        { label: 'Ошибок:',          value: state.errors },
        { label: 'Заморозок:',       value: state.freezes },
        { label: 'Счёт:',            value: state.score },
        { label: 'Макс. счёт:',      value: 390 },
        { label: 'Процент:',         value: Math.round((state.score / 390) * 100) + '%' }
    ],
    onBoot: tag1Intro,
    onAskRobot: tag1AskRobot,
    onSubmitInput: tag1SubmitInput,
    onShowHint: tag1ShowHint
});