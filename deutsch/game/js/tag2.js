/* ============================================================
   TAG2.JS — Sophie + Lukas, погода
   Логика 1:1 из tag2.html. Общие функции — в utils.js.
   ============================================================ */

/* ---------- ДАННЫЕ ДНЯ ---------- */
const sophie = {
    key: 'sophie', name: 'Sophie', emoji: '🌿',
    fullName: 'Sophie Bauer', city: 'München', age: '28',
    job: 'Gärtnerin', hobby: 'Kräutertee trinken und im Garten arbeiten',
    greeting: 'Hallo! Ich bin Sophie aus München. Bei uns regnet es heute stark!'
};

const lukas = {
    key: 'lukas', name: 'Lukas', emoji: '🏔',
    fullName: 'Lukas Fischer', city: 'Hamburg', age: '25',
    job: 'Koch', hobby: 'Fahrrad fahren und Bücher lesen',
    greeting: 'Servus! Ich bin Lukas aus Hamburg. Hier ist es heute windig!',
    g_tr: 'Привет, это тестт'
};

const dialogueSteps = [
    {
        askKeywords: ['heißt ihr', 'heisst ihr', 'heißen sie', 'heissen sie', 'namen', 'heißt du', 'heisst du', 'name'],
        askContext: '📝 Спроси имена у обоих (во множественном числе)',
        askHint: 'Wie heißt ihr?',
        sophie: {
            response: 'Ich heiße Sophie Bauer.',
            responseRu: 'Меня зовут Sophie Bauer.',
            counter: 'Und du? Wie heißt du?',
            counterRu: 'А ты? Как тебя зовут?',
            reaction: 'Schön, dich kennenzulernen!',
            reactionRu: 'Приятно познакомиться!'
        },
        lukas: {
            response: 'Und ich bin Lukas Fischer.',
            responseRu: 'А я — Lukas Fischer.',
            counter: 'Und wie heißt du?',
            counterRu: 'А как тебя зовут?',
            reaction: 'Freut mich!',
            reactionRu: 'Рад знакомству!'
        },
        counterKeywords: ['heiße', 'heisse', 'heißt', 'heisst', 'bin', 'name'],
        counterHint: 'Ich heiße [имя].',
        infoKey: 'name'
    },
    {
        askKeywords: ['kommt ihr', 'woher', 'stadt', 'wohnst', 'wohnt', 'kommst du'],
        askContext: '📝 Спроси, откуда они',
        askHint: 'Woher kommt ihr?',
        sophie: {
            response: 'Ich komme aus München. Ich wohne hier seit meiner Kindheit.',
            responseRu: 'Я из Мюнхена. Живу здесь с детства.',
            counter: 'Und du? Woher kommst du?',
            counterRu: 'А ты? Откуда ты?',
            reaction: 'Interessant!',
            reactionRu: 'Интересно!'
        },
        lukas: {
            response: 'Ich komme aus Hamburg, aus dem Norden Deutschlands.',
            responseRu: 'Я из Гамбурга, с севера Германии.',
            counter: 'Und woher kommst du?',
            counterRu: 'А ты откуда?',
            reaction: 'Cool!',
            reactionRu: 'Круто!'
        },
        counterKeywords: ['komme', 'aus', 'wohne'],
        counterHint: 'Ich komme aus [город].',
        infoKey: 'city'
    },
    {
        askKeywords: ['seid ihr', 'alt', 'jahre', 'bist du'],
        askContext: '📝 Спроси возраст обоих',
        askHint: 'Wie alt seid ihr?',
        sophie: {
            response: 'Ich bin achtundzwanzig Jahre alt.',
            responseRu: 'Мне двадцать восемь лет.',
            counter: 'Und du? Wie alt bist du?',
            counterRu: 'А ты? Сколько тебе лет?',
            reaction: 'Ah, verstehe!',
            reactionRu: 'Ах, понятно!'
        },
        lukas: {
            response: 'Ich bin fünfundzwanzig Jahre alt.',
            responseRu: 'Мне двадцать пять лет.',
            counter: 'Und wie alt bist du?',
            counterRu: 'А сколько тебе лет?',
            reaction: 'Das klingt gut!',
            reactionRu: 'Звучит хорошо!'
        },
        counterKeywords: ['alt', 'jahre', 'bin'],
        counterHint: 'Ich bin [число] Jahre alt.',
        infoKey: 'age'
    },
    {
        askKeywords: ['macht ihr', 'beruf', 'arbeit', 'studier', 'job', 'machst du'],
        askContext: '📝 Спроси, чем они занимаются',
        askHint: 'Was macht ihr? или Was seid ihr von Beruf?',
        sophie: {
            response: 'Ich bin Gärtnerin. Ich arbeite im Stadtpark und kümmere mich um die Blumen und Bäume.',
            responseRu: 'Я садовница. Работаю в городском парке и ухаживаю за цветами и деревьями.',
            counter: 'Und du? Was machst du?',
            counterRu: 'А ты? Чем занимаешься?',
            reaction: 'Super!',
            reactionRu: 'Супер!'
        },
        lukas: {
            response: 'Ich bin Koch. Ich arbeite in einem kleinen Restaurant nahe dem Hafen.',
            responseRu: 'Я повар. Работаю в маленьком ресторане near гавани.',
            counter: 'Und was machst du von Beruf?',
            counterRu: 'А ты кем работаешь?',
            reaction: 'Interessant!',
            reactionRu: 'Интересно!'
        },
        counterKeywords: ['bin', 'arbeite', 'studier', 'mach'],
        counterHint: 'Ich bin [профессия]. / Ich studiere...',
        infoKey: 'job'
    },
    {
        askKeywords: ['eure hobbys', 'hobbys', 'freizeit', 'hobby'],
        askContext: '📝 Спроси об их хобби',
        askHint: 'Was sind eure Hobbys?',
        sophie: {
            response: 'In meiner Freizeit trinke ich gern Kräutertee und arbeite in meinem kleinen Garten.',
            responseRu: 'В свободное время я люблю пить травяной чай и работать в своём маленьком саду.',
            counter: 'Und du? Was sind deine Hobbys?',
            counterRu: 'А ты? Какие у тебя хобби?',
            reaction: 'Das klingt gut!',
            reactionRu: 'Звучит хорошо!'
        },
        lukas: {
            response: 'In meiner Freizeit fahre ich gern Fahrrad und lese Bücher.',
            responseRu: 'В свободное время я люблю кататься на велосипеде и читать книги.',
            counter: 'Und was sind deine Hobbys?',
            counterRu: 'А какие у тебя хобби?',
            reaction: 'Cool!',
            reactionRu: 'Круто!'
        },
        counterKeywords: ['hobby', 'hobbys', 'spiele', 'höre', 'lese', 'koche', 'mache', 'gern'],
        counterHint: 'Ich spiele/höre/lese gern...',
        infoKey: 'hobby'
    },
    {
        askKeywords: ['wetter', 'euch', 'bei euch', 'sonne', 'regen', 'kalt', 'warm', 'wind'],
        askContext: '📝 Спроси о погоде у обоих',
        askHint: 'Wie ist das Wetter bei euch?',
        sophie: {
            response: 'Heute ist das Wetter sehr regnerisch und kühl. Es gibt viele graue Wolken und der Wind weht stark.',
            responseRu: 'Сегодня погода очень дождливая и прохладная. Много серых облаков, и ветер дует сильно.',
            counter: 'Und wie ist das Wetter bei dir?',
            counterRu: 'А какая у тебя погода?',
            reaction: 'Oh, das ist schade!',
            reactionRu: 'О, жаль!'
        },
        lukas: {
            response: 'Bei uns in Hamburg ist es heute windig und bewölkt, aber zum Glück regnet es nicht.',
            responseRu: 'У нас в Гамбурге сегодня ветрено и облачно, но, к счастью, не идёт дождь.',
            counter: 'Und wie ist das Wetter bei dir?',
            counterRu: 'А какая у тебя погода?',
            reaction: 'Verstehe!',
            reactionRu: 'Понятно!'
        },
        counterKeywords: ['wetter', 'sonne', 'regen', 'kalt', 'warm', 'wind', 'schnee'],
        counterHint: 'Das Wetter ist ... / Es regnet / Es ist sonnig...',
        infoKey: 'weather'
    }
];

const MAX_SCORE = 530;
const THRESHOLD = Math.floor(MAX_SCORE * 0.7);

/* ---------- ИНТРО ---------- */
async function tag2Intro() {
    state.phase = 'intro';
    state.dialogueStep = 0;
    state.subPhase = 'ask_both';
    state.collectedInfo = {
        sophie: { name: null, city: null, age: null, job: null, hobby: null, weather: null },
        lukas:  { name: null, city: null, age: null, job: null, hobby: null, weather: null }
    };
    state.robotExplained = false;

    await sleep(500);
    addMainMessage('system', '⚠ ВТОРОЙ ДЕНЬ. ПОДКЛЮЧЕНИЕ К WERTHER...');

    await sleep(1000);
    addMainMessage('verter', 'С возвращением. Петля продолжается.', 'WERTHER');

    await sleep(1500);
    addMainMessage('user', 'Кто ты? Почему я в этой петле?', 'ВЫ');

    await sleep(1500);
    addMainMessage('verter', '...Это не имеет значения. Важно задание.', 'WERTHER');

    await sleep(1500);
    addMainMessage('verter',
        'Сегодня тебе нужно <strong>познакомиться с двумя людьми</strong>. Они из разных городов. Обсудите <strong>погоду</strong>.',
        'WERTHER');

    await sleep(1500);
    addMainMessage('verter',
        'Узнай о каждом:<br>' +
        '• <strong>Имя</strong> (Name)<br>' +
        '• <strong>Город</strong> (Stadt)<br>' +
        '• <strong>Возраст</strong> (Alter)<br>' +
        '• <strong>Профессия</strong> (Beruf)<br>' +
        '• <strong>Хобби</strong> (Hobby)<br>' +
        '• <strong>Погода</strong> (Wetter)',
        'WERTHER');

    await sleep(1500);
    addMainMessage('verter',
        '💡 <strong>СОВЕТ:</strong> Задавай вопросы <strong>сразу обоим</strong> во множественном числе: "Wie heißt <em>ihr</em>?", "Woher kommt <em>ihr</em>?". Они оба ответят и зададут тебе встречный вопрос.',
        'WERTHER');

    await sleep(1500);
    addMainMessage('verter',
        'Помощник объяснит новые темы: <strong>местоимения, безличные предложения, "es gibt"</strong>.',
        'WERTHER');

    await sleep(1000);
    addMainMessage('verter', 'Связь устанавливается...', 'WERTHER');

    await sleep(2000);
    startBothMeeting();
}

/* ---------- ВСТРЕЧА ---------- */
async function startBothMeeting() {
    state.dialogueStep = 0;
    state.subPhase = 'ask_both';

    addMainMessage('system', '⚠ ПОДКЛЮЧЕНИЕ К СУБЪЕКТАМ: SOPHIE + LUKAS');

    await sleep(1500);
    addMainMessage('sophie', sophie.greeting, 'Sophie',
        'Привет! Я Sophie из Мюнхена. У нас сегодня сильный дождь!');

    await sleep(1500);
    addMainMessage('lukas', lukas.greeting, 'Lukas', lukas.g_tr);

    await sleep(1500);
    addMainMessage('verter',
        'Оба собеседника в чате. Задавай вопросы <strong>сразу обоим</strong> во множественном числе. Они ответят по очереди и зададут тебе встречный вопрос.',
        'WERTHER');

    await sleep(1000);
    addMainMessage('verter',
        'Нажми <strong>🤖 СПРОСИТЬ РОБОТА</strong> — он объяснит новые темы и проведёт тесты. Только после этого сможешь общаться.',
        'WERTHER');

    enableAskRobot(true, 'НАЖМИТЕ ДЛЯ ОБУЧЕНИЯ');
    disableInput();

    if (window.innerWidth <= 900) switchTab('chat');
}

/* ---------- РОБОТ: УРОК ---------- */
function tag2AskRobot() {
    if (state.robotExplained) {
        addRobotMessage('Я уже объяснил все темы. Общайся! Если забудешь — нажми 💡 ПОДСКАЗКА.');
        return;
    }
    enableAskRobot(false, 'ОБУЧЕНИЕ В ПРОЦЕССЕ...');
    robotFullLesson();
}

async function robotFullLesson() {
    addRobotMessage('🔍 Анализирую собеседников: <strong>Sophie</strong> (Мюнхен) и <strong>Lukas</strong> (Гамбург). <strong>Темы урока:</strong>');
    await sleep(600);

    addRobotMessage(`
        <div class="grammar-block">
            <h4>🌦 СЛОВАРЬ: ПОГОДА И ПРИРОДА</h4>
            <div class="vocab-grid">
                <div class="vocab-item"><strong>die Sonne</strong><em>солнце</em></div>
                <div class="vocab-item"><strong>der Regen</strong><em>дождь</em></div>
                <div class="vocab-item"><strong>der Schnee</strong><em>снег</em></div>
                <div class="vocab-item"><strong>der Wind</strong><em>ветер</em></div>
                <div class="vocab-item"><strong>die Wolke</strong><em>облако</em></div>
                <div class="vocab-item"><strong>der Nebel</strong><em>туман</em></div>
                <div class="vocab-item"><strong>sonnig</strong><em>солнечно</em></div>
                <div class="vocab-item"><strong>regnerisch</strong><em>дождливо</em></div>
                <div class="vocab-item"><strong>bewölkt</strong><em>облачно</em></div>
                <div class="vocab-item"><strong>windig</strong><em>ветрено</em></div>
                <div class="vocab-item"><strong>kalt / kühl</strong><em>холодно / прохладно</em></div>
                <div class="vocab-item"><strong>warm / heiß</strong><em>тепло / жарко</em></div>
            </div>
        </div>
    `);

    await sleep(500);

    addRobotMessage(`
        <div class="grammar-block">
            <h4>📖 ТЕМА 1: ЛИЧНЫЕ МЕСТОИМЕНИЯ</h4>
            <ul>
                <li><strong>ich</strong> — я</li>
                <li><strong>du</strong> — ты</li>
                <li><strong>er</strong> — он</li>
                <li><strong>sie</strong> — она</li>
                <li><strong>es</strong> — оно</li>
                <li><strong>wir</strong> — мы</li>
                <li><strong>ihr</strong> — вы</li>
                <li><strong>sie / Sie</strong> — они / Вы</li>
            </ul>
            <div class="example"><strong>Sie</strong> ist Gärtnerin. — <em>Она</em> садовница.</div>
            <div class="example"><strong>Er</strong> ist Koch. — <em>Он</em> повар.</div>
        </div>
    `);

    await sleep(500);
    addRobotMessage('📝 Тест 1 из 14:');
    await new Promise(resolve => {
        addTestToRobot('Sophie — женщина. Какое местоимение?',
            [{ text: 'er', correct: false }, { text: 'es', correct: false },
             { text: 'sie', correct: true }, { text: 'wir', correct: false }],
            resolve, 1, 14);
    });

    await sleep(400);
    addRobotMessage('📝 Тест 2 из 14:');
    await new Promise(resolve => {
        addTestToRobot('Lukas — мужчина. Какое местоимение?',
            [{ text: 'sie', correct: false }, { text: 'er', correct: true },
             { text: 'es', correct: false }, { text: 'ihr', correct: false }],
            resolve, 2, 14);
    });

    await sleep(400);
    addRobotMessage('📝 Тест 3 из 14:');
    await new Promise(resolve => {
        addTestToRobot('"___ kommen aus verschiedenen Städten." (Мы из разных городов)',
            [{ text: 'Ich', correct: false }, { text: 'Ihr', correct: false },
             { text: 'Wir', correct: true }, { text: 'Er', correct: false }],
            resolve, 3, 14);
    });

    await sleep(400);

    addRobotMessage(`
        <div class="grammar-block">
            <h4>📖 ТЕМА 2: БЕЗЛИЧНЫЕ ПРЕДЛОЖЕНИЯ С "es"</h4>
            <p class="rule">Погодные явления описываются через "es" + глагол:</p>
            <div class="example"><strong>Es regnet.</strong> — Идёт дождь.</div>
            <div class="example"><strong>Es schneit.</strong> — Идёт снег.</div>
            <div class="example"><strong>Es ist sonnig / bewölkt.</strong> — Солнечно / облачно.</div>
            <div class="example"><strong>Es gibt viele Wolken.</strong> — Много облаков.</div>
            <div class="warning">⚠ НЕ говори "Ich bin kalt".<br>Правильно: <strong>Mir ist kalt.</strong> — Мне холодно.</div>
        </div>
    `);

    await sleep(500);
    addRobotMessage('📝 Тест 4 из 14:');
    await new Promise(resolve => {
        addTestToRobot('Как сказать "Идёт дождь"?',
            [{ text: 'Der Regen ist.', correct: false }, { text: 'Es regnet.', correct: true },
             { text: 'Ich regne.', correct: false }, { text: 'Man regnet.', correct: false }],
            resolve, 4, 14);
    });

    await sleep(400);
    addRobotMessage('📝 Тест 5 из 14:');
    await new Promise(resolve => {
        addTestToRobot('Как правильно сказать "Мне холодно"?',
            [{ text: 'Ich bin kalt.', correct: false }, { text: 'Es ist mich kalt.', correct: false },
             { text: 'Mir ist kalt.', correct: true }, { text: 'Ich habe kalt.', correct: false }],
            resolve, 5, 14);
    });

    await sleep(400);
    addRobotMessage('📝 Тест 6 из 14:');
    await new Promise(resolve => {
        addTestToRobot('Выбери правильный перевод: "Сегодня ветрено"',
            [{ text: 'Heute ist der Wind.', correct: false }, { text: 'Heute es windet.', correct: false },
             { text: 'Heute windet es.', correct: true }, { text: 'Heute ich winde.', correct: false }],
            resolve, 6, 14);
    });

    await sleep(400);

    addRobotMessage(`
        <div class="grammar-block">
            <h4>📖 ТЕМА 3: "man" — безличное "говорят / кто-то"</h4>
            <p class="rule">"man" используется, когда неважно, КТО делает действие:</p>
            <div class="example"><strong>Man</strong> sagt: "Morgen wird es sonnig." — <em>Говорят</em>: завтра будет солнечно.</div>
            <div class="example"><strong>Man</strong> braucht einen Regenschirm. — <em>Нужен</em> зонт.</div>
            <p style="margin-top:6px;color:#ff99ff;">💡 Глагол после "man" всегда в форме 3-го лица ед.ч. (-t)</p>
        </div>
    `);

    await sleep(500);
    addRobotMessage('📝 Тест 7 из 14:');
    await new Promise(resolve => {
        addTestToRobot('"___ sagt, dass Hamburg windig ist." (Говорят, что в Гамбурге ветрено)',
            [{ text: 'Es', correct: false }, { text: 'Ich', correct: false },
             { text: 'Man', correct: true }, { text: 'Wir', correct: false }],
            resolve, 7, 14);
    });

    await sleep(400);
    addRobotMessage('📝 Тест 8 из 14:');
    await new Promise(resolve => {
        addTestToRobot('Выбери ПРАВИЛЬНОЕ предложение:',
            [{ text: 'Man braucht bei Regen eine Jacke.', correct: true },
             { text: 'Man brauchen bei Regen eine Jacke.', correct: false },
             { text: 'Man braucht bei Regen Jacken.', correct: false },
             { text: 'Man brauchen bei Regen Jacken.', correct: false }],
            resolve, 8, 14);
    });

    await sleep(400);

    addRobotMessage(`
        <div class="grammar-block">
            <h4>📖 ТЕМА 4: "es gibt" + AKKUSATIV</h4>
            <p class="rule">"es gibt" = "есть / существует" (требует Akkusativ!)</p>
            <div class="example"><strong>Es gibt</strong> <strong>einen</strong> Regenschirm. — Есть зонт.</div>
            <div class="example"><strong>Es gibt</strong> <strong>viele</strong> Wolken. — Много облаков.</div>
            <div class="example"><strong>Es gibt</strong> <strong>keinen</strong> Schnee. — Нет снега.</div>
        </div>
    `);

    await sleep(500);
    addRobotMessage('📝 Тест 9 из 14:');
    await new Promise(resolve => {
        addTestToRobot('"Heute ___ es viele Wolken."',
            [{ text: 'gibt', correct: true }, { text: 'hat', correct: false },
             { text: 'ist', correct: false }, { text: 'sind', correct: false }],
            resolve, 9, 14);
    });

    await sleep(400);
    addRobotMessage('📝 Тест 10 из 14:');
    await new Promise(resolve => {
        addTestToRobot('Выбери ПРАВИЛЬНОЕ предложение:',
            [{ text: 'Es gibt einen starken Wind.', correct: true },
             { text: 'Es gibt ein starken Wind.', correct: false },
             { text: 'Es gibt einen starke Wind.', correct: false },
             { text: 'Es ist einen starken Wind.', correct: false }],
            resolve, 10, 14);
    });

    await sleep(400);

    addRobotMessage(`
        <div class="grammar-block">
            <h4>📖 ТЕМА 5: ПОЛЕЗНЫЕ ФРАЗЫ О ПОГОДЕ</h4>
            <div class="example"><strong>Wie ist das Wetter heute?</strong> — Какая сегодня погода?</div>
            <div class="example"><strong>Wie ist das Wetter bei dir?</strong> — Какая у тебя погода?</div>
            <div class="example"><strong>Wie ist das Wetter bei euch?</strong> — Какая у вас погода?</div>
            <div class="example"><strong>Die Sonne scheint.</strong> — Солнце светит.</div>
            <div class="example"><strong>Der Wind weht stark.</strong> — Ветер дует сильно.</div>
        </div>
    `);

    await sleep(500);
    addRobotMessage('📝 Тест 11 из 14:');
    await new Promise(resolve => {
        addTestToRobot('Как спросить "Какая у вас (двух) погода?"',
            [{ text: 'Was ist Wetter bei dir?', correct: false },
             { text: 'Wie ist das Wetter bei euch?', correct: true },
             { text: 'Wie ist Wetter bei du?', correct: false },
             { text: 'Was für Wetter hast du?', correct: false }],
            resolve, 11, 14);
    });

    await sleep(400);
    addRobotMessage('📝 Тест 12 из 14:');
    await new Promise(resolve => {
        addTestToRobot('Как сказать "Ветер дует сильно"?',
            [{ text: 'Der Wind ist stark.', correct: false },
             { text: 'Der Wind weht stark.', correct: true },
             { text: 'Es windet stark.', correct: false },
             { text: 'Der Wind bläst stark.', correct: false }],
            resolve, 12, 14);
    });

    await sleep(400);
    addRobotMessage('📝 Тест 13 из 14:');
    await new Promise(resolve => {
        addTestToRobot('Что означает "bewölkt"?',
            [{ text: 'солнечно', correct: false }, { text: 'дождливо', correct: false },
             { text: 'облачно', correct: true }, { text: 'ветрено', correct: false }],
            resolve, 13, 14);
    });

    await sleep(400);
    addRobotMessage('📝 Тест 14 из 14:');
    await new Promise(resolve => {
        addTestToRobot('Выбери правильный перевод: "Der Nebel"',
            [{ text: 'снег', correct: false }, { text: 'облако', correct: false },
             { text: 'туман', correct: true }, { text: 'ветер', correct: false }],
            resolve, 14, 14);
    });

    await sleep(500);
    tag2FinishLesson();
}

function tag2FinishLesson() {
    state.robotExplained = true;

    addRobotMessage('✅ <strong>Все темы изучены!</strong><br><br>📌 Ты знаешь:<br>• Личные местоимения<br>• Безличные "es" (es regnet, es schneit)<br>• Безличное "man"<br>• "es gibt" + Akkusativ<br>• Словарь погоды<br><br>💡 Переходи в чат. Задавай вопросы <strong>сразу обоим</strong> во множественном числе: "Wie heißt <em>ihr</em>?", "Woher kommt <em>ihr</em>?". Они ответят по очереди и зададут тебе встречный вопрос.');

    enableAskRobot(true, 'МОЖЕТЕ ОБЩАТЬСЯ');

    if (window.innerWidth <= 900) switchTab('chat');

    setTimeout(() => startDialogueStep(), 800);
}

/* ---------- ДИАЛОГ ---------- */
function startDialogueStep() {
    state.phase = 'dialogue';
    state.subPhase = 'ask_both';
    const step = dialogueSteps[state.dialogueStep];
    enableInput(step.askContext);
}

function tag2SubmitInput() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;
    if (state.phase === 'dialogue') handleDialogueInput(text);
}

async function handleDialogueInput(text) {
    addMainMessage('user', text, 'ВЫ');
    document.getElementById('user-input').value = '';

    const step = dialogueSteps[state.dialogueStep];

    if (state.subPhase === 'ask_both') {
        const matched = matchesKeywords(text, step.askKeywords);

        if (!matched) {
            setTimeout(() => {
                addMainMessage('sophie', '??? Entschuldigung, ich habe dich nicht verstanden. Kannst du das wiederholen?', 'Sophie');
                addRobotMessage('💬 Sophie не поняла. Нажми 💡 для подсказки.');
            }, 500);
            return;
        }

        disableInput();

        await sleep(800);
        addMainMessage('sophie', step.sophie.response, 'Sophie', step.sophie.responseRu);

        await sleep(1200);
        addMainMessage('sophie', step.sophie.counter, 'Sophie', step.sophie.counterRu);

        await sleep(1200);
        addMainMessage('lukas', step.lukas.response, 'Lukas', step.lukas.responseRu);

        await sleep(1200);
        addMainMessage('lukas', step.lukas.counter, 'Lukas', step.lukas.counterRu);

        const info = state.collectedInfo;
        if (step.infoKey === 'name') {
            info.sophie.name = sophie.fullName;
            info.lukas.name = lukas.fullName;
        } else if (step.infoKey === 'city') {
            info.sophie.city = sophie.city;
            info.lukas.city = lukas.city;
        } else if (step.infoKey === 'age') {
            info.sophie.age = sophie.age;
            info.lukas.age = lukas.age;
        } else if (step.infoKey === 'job') {
            info.sophie.job = sophie.job;
            info.lukas.job = lukas.job;
        } else if (step.infoKey === 'hobby') {
            info.sophie.hobby = sophie.hobby;
            info.lukas.hobby = lukas.hobby;
        } else if (step.infoKey === 'weather') {
            info.sophie.weather = step.sophie.response;
            info.lukas.weather = step.lukas.response;
        }

        state.subPhase = 'answer_both';
        state.currentInputFirstTry = true;

        await sleep(800);
        enableInput(`📝 Ответь на вопросы Sophie и Lukas: <strong>"${step.sophie.counterRu}"</strong>`);

    } else if (state.subPhase === 'answer_both') {
        const matched = matchesKeywords(text, step.counterKeywords);

        if (!matched) {
            setTimeout(() => {
                addMainMessage('sophie', '??? Ich habe nicht verstanden. Was meinst du?', 'Sophie');
                addRobotMessage('💬 Sophie не поняла. Нажми 💡 для подсказки.');
            }, 500);
            return;
        }

        disableInput();

        await sleep(800);
        addMainMessage('sophie', step.sophie.reaction, 'Sophie', step.sophie.reactionRu);

        await sleep(1000);
        addMainMessage('lukas', step.lukas.reaction, 'Lukas', step.lukas.reactionRu);

        await sleep(1000);

        state.dialogueStep++;

        if (state.dialogueStep >= dialogueSteps.length) {
            await sleep(1000);
            startNpcDialogue();
        } else {
            state.subPhase = 'ask_both';
            startDialogueStep();
        }
    }
}

function tag2ShowHint() {
    if (state.phase !== 'dialogue') return;

    const step = dialogueSteps[state.dialogueStep];

    if (state.subPhase === 'ask_both') {
        addRobotMessage(`💡 Подсказка (вопрос обоим): <strong>${step.askHint}</strong>`);
    } else {
        addRobotMessage(`💡 Подсказка (ответ Sophie и Lukas): <strong>${step.counterHint}</strong>`);
    }

    state.hintUsed = true;
    state.currentInputFirstTry = false;

    if (window.innerWidth <= 900) {
        switchTab('robot');
        setTimeout(() => switchTab('chat'), 3000);
    }
}

/* ---------- ДИАЛОГ МЕЖДУ NPC ---------- */
async function startNpcDialogue() {
    state.phase = 'npc_chat';

    addMainMessage('system', '⚠ SOPHIE И LUKAS ОБЩАЮТСЯ МЕЖДУ СОБОЙ');

    await sleep(1500);
    addMainMessage('sophie', 'Lukas, wie ist das Wetter bei dir in Hamburg?', 'Sophie',
        'Lukas, какая у тебя погода в Гамбурге?');

    await sleep(2000);
    addMainMessage('lukas', 'Hallo Sophie! Bei uns ist es heute windig und bewölkt, aber zum Glück regnet es nicht. Und bei dir in München?', 'Lukas',
        'Привет Sophie! У нас сегодня ветрено и облачно, но, к счастью, не идёт дождь. А у тебя в Мюнхене?');

    await sleep(2000);
    addMainMessage('sophie', 'Oh, bei uns regnet es stark! Es gibt viele graue Wolken und es ist kühl. Man braucht einen Regenschirm!', 'Sophie',
        'О, у нас сильный дождь! Много серых облаков и прохладно. Нужен зонт!');

    await sleep(2000);
    addMainMessage('lukas', 'Das klingt nicht gut! Man sagt, im Süden regnet es öfter. Bei uns in Hamburg ist es windig, aber wir sind das gewohnt.', 'Lukas',
        'Звучит не очень! Говорят, на юге чаще идёт дождь. У нас в Гамбурге ветрено, но мы привыкли.');

        await sleep(2000);
    addMainMessage('sophie', 'Haha, ja! Es gibt in München auch schöne Tage. Morgen soll es sonnig werden!', 'Sophie',
        'Хаха, да! В Мюнхене тоже бывают красивые дни. Завтра обещают солнце!');

    await sleep(2000);
    addMainMessage('lukas', 'Super! Dann können wir uns vielleicht treffen, wenn du mal in Hamburg bist!', 'Lukas',
        'Супер! Тогда, может, встретимся, если ты будешь в Гамбурге!');

    await sleep(2000);
    startFinalTest();
}

/* ---------- ФИНАЛЬНЫЙ ТЕСТ ---------- */
async function startFinalTest() {
    state.phase = 'final_test';

    addMainMessage('system', '⚠ ВХОДЯЩЕЕ СООБЩЕНИЕ ОТ WERTHER');

    await sleep(1000);
    addMainMessage('verter',
        'Ты поговорил с <strong>Sophie</strong> и <strong>Lukas</strong>. Теперь проверю, что ты запомнил. <strong>5 вопросов на немецком.</strong>',
        'WERTHER');

    await sleep(1500);

    const finalTests = [
        {
            question: 'Wie heißt die Gärtnerin mit Nachnamen?',
            options: [
                { text: 'Sophie Fischer', correct: false },
                { text: 'Sophie Bauer', correct: true },
                { text: 'Lisa Bauer', correct: false },
                { text: 'Sophie Müller', correct: false }
            ]
        },
        {
            question: 'Woher kommt Lukas?',
            options: [
                { text: 'Aus München', correct: false },
                { text: 'Aus Berlin', correct: false },
                { text: 'Aus Hamburg', correct: true },
                { text: 'Aus Wien', correct: false }
            ]
        },
        {
            question: 'Wie alt ist Sophie?',
            options: [
                { text: 'Fünfundzwanzig', correct: false },
                { text: 'Achtundzwanzig', correct: true },
                { text: 'Dreißig', correct: false },
                { text: 'Fünfunddreißig', correct: false }
            ]
        },
        {
            question: 'Was ist Lukas von Beruf?',
            options: [
                { text: 'Er ist Gärtner.', correct: false },
                { text: 'Er ist Student.', correct: false },
                { text: 'Er ist Koch.', correct: true },
                { text: 'Er ist Lehrer.', correct: false }
            ]
        },
        {
            question: 'Was ist das Hobby von Sophie?',
            options: [
                { text: 'Fahrrad fahren', correct: false },
                { text: 'Kräutertee trinken und im Garten arbeiten', correct: true },
                { text: 'Bücher lesen', correct: false },
                { text: 'Fußball spielen', correct: false }
            ]
        }
    ];

    let currentTestIdx = 0;

    async function askNextTest() {
        if (currentTestIdx >= finalTests.length) {
            await tag2Finale();
            return;
        }

        const test = finalTests[currentTestIdx];
        const allOptions = shuffle(test.options);

        addMainMessage('verter', `Frage ${currentTestIdx + 1} von 5:`, 'WERTHER');

        const container = document.getElementById('main-messages');
        const block = document.createElement('div');
        block.className = 'msg system';
        block.innerHTML = `
            <div class="msg-avatar">⚠</div>
            <div class="msg-body">
                <div class="test-block">
                    <div class="test-q">${test.question}</div>
                    <div class="test-opts">
                        ${allOptions.map((opt, i) => `<button class="test-opt" data-idx="${i}">${opt.text}</button>`).join('')}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(block);
        container.scrollTop = container.scrollHeight;

        state.currentTestFirstTry = true;

        await new Promise(resolve => {
            block.querySelectorAll('.test-opt').forEach(btn => {
                btn.onclick = () => {
                    const idx = parseInt(btn.dataset.idx);
                    handleFinalAnswer(idx, allOptions, block, resolve);
                };
            });
        });

        currentTestIdx++;
        await sleep(800);
        askNextTest();
    }

    askNextTest();
}

async function handleFinalAnswer(idx, options, block, resolve) {
    state.totalAttempts++;
    const buttons = block.querySelectorAll('.test-opt');

    if (options[idx].correct) {
        buttons[idx].classList.add('correct');
        buttons.forEach(b => b.classList.add('locked'));
        state.testsPassed++;

        if (state.currentTestFirstTry) {
            state.score += 50;
            addMainMessage('verter', '✅ Richtig! <strong>+50 очков</strong>', 'WERTHER');
        } else {
            addMainMessage('verter', '✅ Richtig! (Очки не начислены)', 'WERTHER');
        }

        updateStats();
        resolve();
    } else {
        buttons[idx].classList.add('wrong');
        buttons[idx].classList.add('locked');
        state.errors++;
        state.currentTestFirstTry = false;
        updateStats();

        freezeTime();

        await sleep(3000);
        addMainMessage('verter', '❌ Falsch! Zeit eingefroren. Versuch es nochmal.', 'WERTHER');
    }
}

/* ---------- ФИНАЛ ---------- */
async function tag2Finale() {
    state.phase = 'finale';

    addMainMessage('system', '⚠ КРИТИЧЕСКОЕ СООБЩЕНИЕ ОТ WERTHER');

    await sleep(1000);
    addMainMessage('verter',
        'Задание выполнено. Ты научился говорить о погоде и знакомиться с людьми из разных городов.',
        'WERTHER');

    await sleep(1500);
    addMainMessage('user', 'Почему это важно? Что будет дальше?', 'ВЫ');

    await sleep(1500);
    addMainMessage('verter', '...Узнаешь в Tag 3. А пока — отдыхай. Петля ждёт.', 'WERTHER');

    await sleep(1500);
    addMainMessage('verter', 'До встречи...', 'WERTHER');

    await sleep(2000);
    showFinalStats();
}

/* ---------- КОНФИГ ДНЯ ---------- */
initGame({
    dayTag: 'TAG 2',
    chatHeader: '◈ КАНАЛ СВЯЗИ // TAG 2',
    bootMessages: [
        'TAG 2 // RECONNECTION...',
        'ВРЕМЕННАЯ ПЕТЛЯ СТАБИЛЬНА',
        'ПОДКЛЮЧЕНИЕ К КАНАЛУ WERTHER...',
        'CONNECTION ESTABLISHED'
    ],
    avatars: {
        verter: '🎭',
        sophie: '🌿',
        lukas:  '🏔'
    },
    maxScore: MAX_SCORE,
    nextUrl: 'tags.html?tag=3',
    nextLabel: '▶ ПЕРЕХОД К TAG 3',
    pointsPerTest: 20,
    finalTitle: '◢ TAG 2 ABGESCHLOSSEN ◣',
    finalRows: () => [
        { label: 'Познакомился с:',  value: 'Sophie & Lukas' },
        { label: 'Новых тем:',       value: '5' },
        { label: 'Тестов пройдено:', value: state.testsPassed },
        { label: 'Ошибок:',          value: state.errors },
        { label: 'Заморозок:',       value: state.freezes },
        { label: 'Счёт:',            value: state.score },
        { label: 'Макс. счёт:',      value: MAX_SCORE },
        { label: 'Процент:',         value: Math.round((state.score / MAX_SCORE) * 100) + '%' }
    ],
    onBoot: tag2Intro,
    onAskRobot: tag2AskRobot,
    onSubmitInput: tag2SubmitInput,
    onShowHint: tag2ShowHint
});