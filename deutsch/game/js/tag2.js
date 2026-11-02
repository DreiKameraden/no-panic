/* ============================================================
   TAG2.JS — Лиза + Марк; день 2 «Лес». Один NPC duo.
   ============================================================ */

const duo = {
    name: 'Duo',
    emoji: '👥',
    intro: {
        firstMessage: 'Bist du hier?',
        firstMessage_tr: 'Ты здесь?'
    },
    steps: [
        /* ---------- 1. ЛИЗА ОДНА ---------- */
        {
            id: 'intro',
            keywords: ['was ist passiert', 'was ist los', 'alles okay', 'was ist mit dir', 'was hast du'],
            context: '📝 Спроси, что случилось',
            hint: 'Was ist passiert? / Alles okay?',
            messages: [
                { type: 'lisa', text: 'Nichts… alles gut.', text_tr: 'Ничего… всё хорошо.', sender: 'Lisa' },
                { type: 'lisa', text: 'Nein. Eigentlich… ich wollte mich entschuldigen. Gestern war ich ziemlich unhöflich. Ich sollte so nicht mit dir reden. Kannst du mir verzeihen?', text_tr: 'Нет. Вообще-то… я хотела извиниться. Вчера я была довольно невежлива. Мне не следовало так с тобой разговаривать. Ты можешь меня простить?', sender: 'Lisa' }
            ],
            next: 'where'
        },
        {
            id: 'where',
            keywords: ['wo', 'bist', 'helfen', 'kann'],
            context: '📝 Спроси, где она / можешь ли помочь',
            hint: 'Wo bist du? / Kann ich helfen?',
            messages: [
                { type: 'lisa', text: 'Ich gehe durch die Stadt. Ich überlege, ob ich in den Wald gehen soll. Es gibt einen Weg dort. Wir sind oft mit Jonas gegangen. Aber ich bin so traurig…', text_tr: 'Я гуляю по городу. Думаю, стоит ли пойти в лес. Там есть тропинка. Мы часто гуляли по ней с Йонасом. Но мне так грустно…', sender: 'Lisa' }
            ],
            next: 'modal_answer'
        },
        {
            id: 'modal_answer',
            keywords: ['kann', 'helfen', 'möchte', 'will'],
            context: '📝 Спросите, можете ли вы помочь',
            hint: 'Kann ich helfen? / Ich möchte helfen.',
            messages: [
                { type: 'lisa', text: 'Danke...', text_tr: 'Спасибо...', sender: 'Lisa' },
                { type: 'lisa', text: 'Ich muss jetzt entscheiden. Ich kann nicht allein gehen. Aber ich will nicht warten.', text_tr: 'Мне нужно решить. Я не могу идти одна. Но я не хочу ждать.', sender: 'Lisa' }
            ],
            next: 'trigger_lesson_1'
        },

        /* ---------- 2. УРОК 1 ---------- */
        {
            id: 'trigger_lesson_1',
            lesson: 1,
            keywords: ['ja', 'okay', 'gut', 'weiter'],
            context: '📝 Продолжай',
            hint: 'Ja / Okay',
            messages: [],
            next: 'mark_scene_start'
        },

        /* ---------- 3. СЦЕНА С МАРКОМ ---------- */
        {
            id: 'mark_scene_start',
            keywords: ['ja', 'okay', 'gut', 'mark', 'was', 'wer', 'hallo'],
            context: '📝 Ответь Марку',
            hint: 'Hallo Mark!',
            messages: [
                { type: 'system', text: '⚠ ПОДКЛЮЧЕНИЕ: MARK' },
                { type: 'mark', text: 'Hallo.', text_tr: 'Привет.', sender: 'Mark' },
                { type: 'mark', text: 'Lisa, bist du auch hier? Wie geht es dir? Was machst du?', text_tr: 'Лиза, ты тоже тут? Как у тебя дела? Что делаешь?', sender: 'Mark' }
            ],
            next: 'mark_scene_mid'
        },
        {
            id: 'mark_scene_mid',
            keywords: ['ja', 'okay', 'gut', 'weiter'],
            context: '📝 Продолжай',
            hint: 'Ja / Okay',
            messages: [
                { type: 'system', text: '⚠ СВЯЗЬ С LISA ВОССТАНОВЛЕНА' },
                { type: 'lisa', text: 'Ich gehe durch die Stadt. Mark, wo bist du?', text_tr: 'Гуляю по городу. Марк, а ты где?', sender: 'Lisa' },
                { type: 'mark', text: 'Ich bin in der Werkstatt. Ich sortiere alte Sachen. Übrigens, hier ist etwas Interessantes.', text_tr: 'Я в мастерской. Разбираю старые вещи. Кстати, тут есть кое-что интересное.', sender: 'Mark' },
                { type: 'lisa', text: 'Was denn?', text_tr: 'Что именно?', sender: 'Lisa' },
                { type: 'mark', text: 'Nicht am Telefon. *(пауза)* Erinnerst du dich, wie wir zu dritt in diesem Wald waren? Jonas, du und ich.', text_tr: 'Не по телефону. *(пауза)* Ты помнишь, как мы втроём ходили в тот лес? Йонас, ты и я.', sender: 'Mark' }
            ],
            next: 'mark_scene_lemory'
        },
        {
            id: 'mark_scene_lemory',
            keywords: ['ja', 'erinnere', 'erinnere mich', 'was', 'jonas'],
            context: '📝 Ответь про воспоминание',
            hint: 'Ich erinnere mich.',
            messages: [
                { type: 'lisa', text: 'Ich erinnere mich. Es hat geregnet. Stark. Wir waren nass, aber Jonas hat gelacht.', text_tr: 'Помню. Шёл дождь. Сильный. Мы промокли, а Йонас смеялся.', sender: 'Lisa' },
                { type: 'mark', text: 'Er hat immer gelacht, wenn es schlimm war. *(пауза)* Ich habe etwas gefunden. Es gehörte ihm.', text_tr: 'Он всегда смеялся, когда было плохо. *(пауза)* Я нашёл одну вещь. Она принадлежала ему.', sender: 'Mark' },
                { type: 'lisa', text: 'Was für eine Sache?', text_tr: 'Что за вещь?', sender: 'Lisa' },
                { type: 'mark', text: 'Ein alter USB-Stick. Ich weiß nicht, was drauf ist. Vielleicht nichts. Vielleicht etwas Wichtiges.', text_tr: 'Старая флешка. Я не знаю, что на ней. Может, ничего. Может, что-то важное.', sender: 'Mark' },
                { type: 'lisa', text: 'Öffne ihn.', text_tr: 'Открой её.', sender: 'Lisa' },
                { type: 'mark', text: 'Ich kann nicht. Er ist beschädigt. *(пауза)* Ich muss gehen. Ich schreibe später.', text_tr: 'Не могу. Она повреждена. *(пауза)* Мне нужно идти. Позже напишу.', sender: 'Mark' },
                { type: 'system', text: '⚠ MARK ОТКЛЮЧИЛСЯ' }
            ],
            next: 'mark_scene_end'
        },
        {
            id: 'mark_scene_end',
            keywords: ['ja', 'okay', 'gut', 'weiter'],
            context: '📝 Продолжай',
            hint: 'Ja / Okay',
            messages: [
                { type: 'system', text: '⚠ СВЯЗЬ С LISA ВОССТАНОВЛЕНА' },
                { type: 'lisa', text: 'Er ist immer so. Er findet etwas — und schweigt. Als ob er Angst hätte. *(пауза)* Egal. Ich gehe in den Wald. Kommst du mit?', text_tr: 'Он всегда так. Находит что-то — и молчит. Как будто боится. *(пауза)* Ладно. Я иду в лес. Ты со мной?', sender: 'Lisa' }
            ],
            next: 'forest_entry'
        },

        /* ---------- 4. ЛЕС ---------- */
        {
            id: 'forest_entry',
            keywords: ['ja', 'komme', 'mit', 'gehe', 'nein', 'wald'],
            context: '📝 Ответь: пойдёшь в лес?',
            hint: 'Ja, ich komme mit.',
            messages: [
                { type: 'lisa', text: 'Danke. *(пауза)* Dann gehen wir zusammen. Der Weg ist nicht weit.', text_tr: 'Спасибо. *(пауза)* Тогда идём вместе. Тропинка недалеко.', sender: 'Lisa' }
            ],
            next: 'forest_weg'
        },
        {
            id: 'forest_weg',
            keywords: ['wetter', 'kalt', 'wind', 'regen', 'sonne', 'herbst', 'wie', 'ist'],
            context: '📝 Спроси о погоде / опиши, что видишь',
            hint: 'Wie ist das Wetter? / Es ist kalt.',
            messages: [
                { type: 'lisa', text: 'Ja, es ist kalt. Der Wind weht stark. Aber der Wald ist schön. Besonders im Herbst. Die Blätter sind rot und gelb.', text_tr: 'Да, холодно. Ветер дует сильно. Но лес красивый. Особенно осенью. Листья красные и жёлтые.', sender: 'Lisa' }
            ],
            next: 'forest_baum'
        },
        {
            id: 'forest_baum',
            keywords: ['weg', 'wald', 'jonas', 'oft', 'gegangen', 'was', 'passiert'],
            context: '📝 Спроси про тропинку / Йонаса',
            hint: 'Was ist mit Jonas? / Seid ihr oft hier?',
            messages: [
                { type: 'lisa', text: 'Wir sind hier oft gegangen. Jeden Sonntag. Jonas und ich. *(пауза)* Er sagte, der Wald ist wie ein Buch. Man muss nur lesen lernen.', text_tr: 'Мы часто здесь ходили. Каждое воскресенье. Йонас и я. *(пауза)* Он говорил, лес — как книга. Просто надо научиться читать.', sender: 'Lisa' },
                { type: 'lisa', text: 'Schau. Am Baum. Die Initialen. J. und L. *(пауза)* Er hat sie geschnitzt. Vor drei Jahren. Kurz bevor er verschwunden ist.', text_tr: 'Смотри. На дереве. Инициалы. J. и L. *(пауза)* Он их вырезал. Три года назад. Незадолго до того, как исчез.', sender: 'Lisa' }
            ],
            next: 'forest_initialen'
        },
        {
            id: 'forest_initialen',
            keywords: ['verschwunden', 'was', 'passiert', 'warum', 'wo', 'ist'],
            context: '📝 Спроси: что случилось? Почему он исчез?',
            hint: 'Was ist passiert? / Warum ist er verschwunden?',
            messages: [
                { type: 'lisa', text: 'Ich weiß nicht. *(пауза)* Er sagte immer: «Ich komme zurück». Und ich warte. Ich warte immer noch. *(тихо)* Ich kann das nicht vergessen. Ich will es nicht vergessen.', text_tr: 'Я не знаю. *(пауза)* Он всегда говорил: «Я вернусь». И я жду. Я всё ещё жду. *(тихо)* Я не могу это забыть. Я не хочу это забывать.', sender: 'Lisa' }
            ],
            next: 'trigger_lesson_2'
        },

        /* ---------- 5. УРОК 2 ---------- */
        {
            id: 'trigger_lesson_2',
            lesson: 2,
            keywords: ['ja', 'okay', 'gut', 'weiter'],
            context: '📝 Продолжай',
            hint: 'Ja / Okay',
            messages: [],
            next: 'forest_allein'
        },

        {
            id: 'forest_allein',
            keywords: ['nicht allein', 'bleiben', 'kann', 'bin da', 'du bist', 'verstehe'],
            context: '📝 Ответь Лизе: она не одна',
            hint: 'Du bist nicht allein. / Ich kann bleiben.',
            messages: [
                { type: 'lisa', text: 'Danke. *(пауза)* Es wird kalt. Der Wind weht stärker. Ich muss jetzt gehen. *(тихо)* Ich will nicht allein sein. Aber ich bin allein.', text_tr: 'Спасибо. *(пауза)* Становится холодно. Ветер дует сильнее. Мне нужно идти. *(тихо)* Я не хочу быть одна. Но я одна.', sender: 'Lisa' }
            ],
            next: 'forest_ende'
        },
        {
            id: 'forest_ende',
            keywords: ['kann', 'bleiben', 'bin da', 'nicht allein', 'du bist nicht', 'ja'],
            context: '📝 Ответь Лизе',
            hint: 'Du bist nicht allein. / Ich kann bleiben.',
            messages: [
                { type: 'lisa', text: 'Danke. *(пауза)* Vielleicht können wir morgen wieder hierher kommen. *(тихо)* Tschüss.', text_tr: 'Спасибо. *(пауза)* Может, завтра мы сможем снова прийти сюда. *(тихо)* Пока.', sender: 'Lisa' },
                { type: 'system', text: '⚠ LISA ОТКЛЮЧИЛАСЬ' }
            ],
            next: 'trigger_lesson_3'
        },

        /* ---------- 6. УРОК 3 ---------- */
        {
            id: 'trigger_lesson_3',
            lesson: 3,
            keywords: ['ja', 'okay', 'gut', 'weiter'],
            context: '📝 Продолжай',
            hint: 'Ja / Okay',
            messages: [],
            next: 'finale_question'
        },

        /* ---------- 7. ФИНАЛ ---------- */
        {
            id: 'finale_question',
            keywords: ['ja', 'nein', 'okay', 'gut'],
            context: '📝 Ответь VERTER',
            hint: 'Ja / Nein',
            messages: [],
            next: null
        }
    ]
};

const npcs = { duo };

async function tag2Intro() {
    state.phase = 'intro';
    state.collectedInfo = { duo: {} };
    state.robotExplained = { 1: false, 2: false, 3: false };
    state.currentNPC = 'duo';
    state.currentStepId = 'intro';

    await sleep(500);
    addMainMessage('system', '⚠ СИСТЕМА НЕСТАБИЛЬНА. ОЖИДАНИЕ...');
    await sleep(1500);
    addRobotMessage('Здравствуй, игрок. Пока система нестабильна, я не могу подключиться. Нажми кнопку «Спросить робота», чтобы получить правила.');
    await sleep(1000);

    state.phase = 'await_robot';
    state.pendingLesson = 1;
    disableInput();
    enableAskRobot(true, 'НАЖМИТЕ ДЛЯ ОБУЧЕНИЯ');
    await waitForRobotButton();

    addMainMessage('system', '⚠ СВЯЗЬ ВОССТАНОВЛЕНА');
    await sleep(1000);
    startNPCMeeting(0);
}

function waitForRobotButton() {
    return new Promise(resolve => {
        state._robotResolver = resolve;
    });
}

async function startNPCMeeting(npcIdx) {
    currentNPCIndex = npcIdx;
    state.currentNPC = 'duo';
    state.currentStepId = 'intro';
    state.phase = `npc${npcIdx + 1}_meeting`;

    addMainMessage('system', `⚠ ПОДКЛЮЧЕНИЕ К СУБЪЕКТУ #${npcIdx + 1}: LISA`);
    await sleep(1500);
    addMainMessage('lisa', duo.intro.firstMessage, 'Lisa', duo.intro.firstMessage_tr);
    await sleep(1000);

    enableAskRobot(false, 'ОБЩАЙТЕСЬ');
    setTimeout(() => startDialogue(), 800);

    if (window.innerWidth <= 900) switchTab('chat');
}

function tag2AskRobot() {
    if (state.phase === 'await_robot' && state.pendingLesson) {
        const lesson = state.pendingLesson;
        state.pendingLesson = null;
        enableAskRobot(false, 'ОБУЧЕНИЕ В ПРОЦЕССЕ...');
        if (lesson === 1) robotLesson1_Modal();
        else if (lesson === 2) robotLesson2_WordOrder();
        else if (lesson === 3) robotLesson3_Questions();
        const resolve = state._robotResolver;
        state._robotResolver = null;
        if (resolve) resolve();
        return;
    }
}

async function robotLesson1_Modal() {
    addRobotMessage('🔍 Анализирую собеседника: <strong>Lisa</strong>. <strong>Тема:</strong> модальные глаголы.');
    await sleep(600);
    addRobotMessage(`
        <div class="grammar-block">
            <h4>📖 МОДАЛЬНЫЕ ГЛАГОЛЫ</h4>
            <p class="rule">Модальный глагол на 2-м месте, инфинитив — в конце.</p>
            <ul>
                <li><strong>können</strong> — мочь: ich kann, du kannst, er kann, wir können, ihr könnt, sie können</li>
                <li><strong>wollen</strong> — хотеть: ich will, du willst, er will, wir wollen, ihr wollt, sie wollen</li>
                <li><strong>müssen</strong> — быть должным: ich muss, du musst, er muss, wir müssen, ihr müsst, sie müssen</li>
                <li><strong>möchten</strong> — хотел бы: ich möchte, du möchtest, er möchte, wir möchten, ihr möchtet, sie möchten</li>
            </ul>
            <div class="example">Ich <strong>kann</strong> nicht <strong>kommen</strong>.</div>
            <div class="example">Ich <strong>will</strong> <strong>gehen</strong>.</div>
            <div class="example">Wir <strong>müssen</strong> ihn <strong>erinnern</strong>.</div>
        </div>
    `);

    await sleep(500);
    await new Promise(resolve => addTestToRobot('«Ich ___ nicht kommen.»', [{ text: 'kann', correct: true }, { text: 'kannst', correct: false }, { text: 'können', correct: false }, { text: 'willst', correct: false }], resolve, 1, 4));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('«Du ___ gehen.»', [{ text: 'will', correct: false }, { text: 'willst', correct: true }, { text: 'wollen', correct: false }, { text: 'kann', correct: false }], resolve, 2, 4));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('«Wir ___ ihn erinnern.»', [{ text: 'muss', correct: false }, { text: 'müssen', correct: true }, { text: 'müsst', correct: false }, { text: 'möchte', correct: false }], resolve, 3, 4));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('«Ich ___ helfen.»', [{ text: 'möchte', correct: true }, { text: 'möchtest', correct: false }, { text: 'möchten', correct: false }, { text: 'muss', correct: false }], resolve, 4, 4));

    await sleep(500);
    finishLesson(1, 'МОДАЛЬНЫЕ ГЛАГОЛЫ');
}

async function robotLesson2_WordOrder() {
    addRobotMessage('🔍 Сбой системы. <strong>Тема:</strong> порядок слов.');
    await sleep(600);
    addRobotMessage(`
        <div class="grammar-block">
            <h4>📖 ПОРЯДОК СЛОВ</h4>
            <p class="rule">Глагол на 2-м месте.</p>
            <ul>
                <li><strong>Прямой:</strong> Ich <strong>gehe</strong> in den Wald.</li>
                <li><strong>Обратный:</strong> Heute <strong>gehe</strong> ich in den Wald.</li>
            </ul>
            <h4>🌲 ЛЕКСИКА</h4>
            <ul>
                <li><strong>der Wald</strong> — лес</li>
                <li><strong>der Baum</strong> — дерево</li>
                <li><strong>der Weg</strong> — тропинка</li>
                <li><strong>der Regen</strong> — дождь</li>
                <li><strong>der Wind</strong> — ветер</li>
                <li><strong>die Sonne</strong> — солнце</li>
                <li><strong>der Herbst</strong> — осень</li>
            </ul>
        </div>
    `);

    await sleep(500);
    await new Promise(resolve => addTestToRobot('«Heute ___ ich in den Wald.»', [{ text: 'gehe', correct: true }, { text: 'gehen', correct: false }, { text: 'gehst', correct: false }, { text: 'geht', correct: false }], resolve, 1, 4));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('«Ich ___ heute in den Wald.»', [{ text: 'gehe', correct: true }, { text: 'gehen', correct: false }, { text: 'gehst', correct: false }, { text: 'geht', correct: false }], resolve, 2, 4));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('«___ ist der Weg?»', [{ text: 'Wo', correct: true }, { text: 'Was', correct: false }, { text: 'Wie', correct: false }, { text: 'Wer', correct: false }], resolve, 3, 4));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('«___ Wetter ist heute?»', [{ text: 'Wie', correct: true }, { text: 'Was', correct: false }, { text: 'Wo', correct: false }, { text: 'Wer', correct: false }], resolve, 4, 4));

    await sleep(500);
    finishLesson(2, 'ПОРЯДОК СЛОВ И ЛЕКСИКА');
}

async function robotLesson3_Questions() {
    addRobotMessage('🔍 Сбой системы. <strong>Тема:</strong> вопросы.');
    await sleep(600);
    addRobotMessage(`
        <div class="grammar-block">
            <h4>📖 ВОПРОСЫ</h4>
            <p class="rule">Общий: глагол на 1-м месте.</p>
            <div class="example">Gehst du in den Wald?</div>
            <p class="rule">Специальный: W-слово + глагол + подлежащее.</p>
            <div class="example">Wohin gehst du?</div>
        </div>
    `);

    await sleep(500);
    await new Promise(resolve => addTestToRobot('«___ du in den Wald?»', [{ text: 'Gehst', correct: true }, { text: 'Gehe', correct: false }, { text: 'Gehen', correct: false }, { text: 'Geht', correct: false }], resolve, 1, 3));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('«___ gehst du?»', [{ text: 'Wohin', correct: true }, { text: 'Wo', correct: false }, { text: 'Was', correct: false }, { text: 'Wer', correct: false }], resolve, 2, 3));
    await sleep(400);
    await new Promise(resolve => addTestToRobot('«Heute ___ ich in den Wald.»', [{ text: 'gehe', correct: true }, { text: 'gehst', correct: false }, { text: 'gehen', correct: false }, { text: 'geht', correct: false }], resolve, 3, 3));

    await sleep(500);
    finishLesson(3, 'ВОПРОСЫ');
}

function startDialogue() {
    state.phase = 'dialogue';
    const step = duo.steps.find(s => s.id === state.currentStepId);
    if (step) enableInput(step.context);
}

async function handleDialogueInput(text) {
    const step = duo.steps.find(s => s.id === state.currentStepId);

    if (step && step.lesson) {
        addMainMessage('user', text, 'ВЫ');
        document.getElementById('user-input').value = '';
        disableInput();

        addMainMessage('verter', 'Сбой системы. Обратиться к ассистенту.', 'VERTER [неизвестный]');
        await sleep(800);

        state.phase = 'await_robot';
        state.pendingLesson = step.lesson;
        enableAskRobot(true, 'НАЖМИТЕ ДЛЯ ОБУЧЕНИЯ');
        await waitForRobotButton();

        await sleep(1000);
        addMainMessage('system', '⚠ СВЯЗЬ ВОССТАНОВЛЕНА');
        await sleep(1000);

        state.currentStepId = step.next;
        state.phase = 'dialogue';
        const nextStep = duo.steps.find(s => s.id === state.currentStepId);
        enableInput(nextStep.context);
        return;
    }

    if (step && step.id === 'finale_question') {
        addMainMessage('user', text, 'ВЫ');
        document.getElementById('user-input').value = '';
        disableInput();
        await sleep(800);
        await dayTwoFinal();
        return;
    }

    await handleDialogueInputBase(text, npcs, async (step, npc) => {
        await sleep(800);
        await dayTwoFinal();
    });
}

async function dayTwoFinal() {
    state.phase = 'finale';

    addMainMessage('system', '⚠ КРИТИЧЕСКОЕ СООБЩЕНИЕ ОТ VERTER');
    await sleep(1000);
    addMainMessage('verter', 'День завершён. Фрагмент 2 из 3 восстановлен.', 'VERTER [неизвестный]');
    await sleep(1500);
    addMainMessage('verter', 'Ответь на вопрос: как ты провёл день? Нравится ли тебе Лиза?', 'VERTER [неизвестный]');
    await sleep(1000);

    const container = document.getElementById('main-messages');
    const block = document.createElement('div');
    block.className = 'msg system';
    block.innerHTML = `
        <div class="msg-avatar">⚠</div>
        <div class="msg-body">
            <div class="test-block">
                <div class="test-q">Нравится ли тебе Лиза?</div>
                <div class="test-opts">
                    <button class="test-opt" data-answer="yes">Да, мне понравилось. Лиза — хороший человек.</button>
                    <button class="test-opt" data-answer="no">Нет, мне не понравилось.</button>
                </div>
            </div>
        </div>
    `;
    container.appendChild(block);
    container.scrollTop = container.scrollHeight;

    block.querySelectorAll('.test-opt').forEach(btn => {
        btn.onclick = async () => {
            const answer = btn.dataset.answer;
            block.querySelectorAll('.test-opt').forEach(b => b.classList.add('locked'));

            if (answer === 'yes') {
                btn.classList.add('correct');
                addMainMessage('user', 'Да, мне понравилось. Лиза — хороший человек.', 'ВЫ');
                await sleep(1000);

                document.getElementById('main-container').classList.add('screen-cracked');
                document.body.classList.add('screen-cracked');

                addMainMessage('system', '⚠ НЕСТАБИЛЬНОСТЬ СИСТЕМЫ.');
                await sleep(5000);
                addMainMessage('verter', '...', 'VERTER [неизвестный]');
                await sleep(3000);

                document.getElementById('main-container').classList.remove('screen-cracked');
                document.body.classList.remove('screen-cracked');

                await sleep(800);

                const overlay = document.getElementById('freeze-overlay');
                overlay.classList.add('active');
                document.getElementById('freeze-text').innerText = '⏳ ЗАГРУЗКА...';
                document.getElementById('freeze-sub').innerText = 'ВОССТАНОВЛЕНИЕ ФРАГМЕНТА';
                await sleep(3000);
                overlay.classList.remove('active');
                document.getElementById('freeze-text').innerText = '⏸ ZEIT EINGEFROREN ⏸';
                document.getElementById('freeze-sub').innerText = 'ВРЕМЯ ОСТАНОВИЛОСЬ';

                await sleep(800);
                showFinalStats();
            } else {
                btn.classList.add('wrong');
                addMainMessage('user', 'Нет, мне не понравилось.', 'ВЫ');
                await sleep(1000);

                addMainMessage('system', '⚠ VERTER НЕ ОТВЕЧАЕТ');
                await sleep(2000);

                showFinalStats();
            }
        };
    });
}

initGame({
    npcs: npcs,
    npcColors: {
        lisa: { color: '#ff66ff', bg: 'rgba(255, 102, 255, 0.2)', bgLight: 'rgba(255, 102, 255, 0.08)' },
        mark: { color: '#00c8ff', bg: 'rgba(0, 200, 255, 0.2)', bgLight: 'rgba(0, 200, 255, 0.08)' }
    },
    dayTag: 'TAG 2',
    chatHeader: '◈ КАНАЛ СВЯЗИ // ФРАГМЕНТ 2: ЛЕС',
    bootMessages: [
        'СИСТЕМА СПИТ...',
        'ПОПЫТКА ПОДКЛЮЧЕНИЯ...',
        'СВЯЗЬ НЕСТАБИЛЬНА...'
    ],
    avatars: { verter: '🎭' },
    npcAvatar: () => '👥',
    maxScore: 220,
    nextUrl: 'tags.html?tag=3',
    nextLabel: '▶ ПЕРЕХОД К TAG 3',
    pointsPerTest: 20,
    awardAlways: false,
    finalTitle: '◢ ФРАГМЕНТ 2 ВОССТАНОВЛЕН ◣',
    finalRows: () => [
        { label: 'Тестов пройдено:', value: state.testsPassed },
        { label: 'Всего попыток:',   value: state.totalAttempts },
        { label: 'Ошибок:',          value: state.errors },
        { label: 'Заморозок:',       value: state.freezes },
        { label: 'Счёт:',            value: state.score },
        { label: 'Макс. счёт:',      value: 220 },
        { label: 'Процент:',         value: Math.round((state.score / 220) * 100) + '%' }
    ],
    onBoot: tag2Intro,
    onAskRobot: tag2AskRobot,
    onSubmitInput: handleDialogueInput
});