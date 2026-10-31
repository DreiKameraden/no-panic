/* ============================================================
   MENU.JS — экран выбора дня (отдельная страница menu.html)
   Зависит от utils.js (прогресс, TOTAL_DAYS).
   ============================================================ */

const DAY_TITLES = {
    1: 'ЗНАКОМСТВО',
    2: 'ПОГОДА',
    3: 'ФИНАЛ ПЕТЛИ'
};

function renderMenu() {
    const completed = getCompletedDays();
    const statusEl = document.getElementById('start-status');
    const daysEl = document.getElementById('start-days');

    const defaultStatus = completed.length === 0
        ? 'ПРОГРЕСС НЕ ОБНАРУЖЕН. ДОСТУПЕН СЕКТОР 1.'
        : `ОБНАРУЖЕН ПРОГРЕСС: ПРОЙДЕНО ${completed.length} ИЗ ${TOTAL_DAYS}`;

    statusEl.innerText = defaultStatus;
    statusEl.style.color = '';
    statusEl.classList.add('ready');

    daysEl.innerHTML = '';

    for (let n = 1; n <= TOTAL_DAYS; n++) {
        const btn = document.createElement('button');
        btn.className = 'day-btn';
        btn.dataset.tag = n;

        const isCompleted = completed.includes(n);
        const isUnlocked = isDayUnlocked(n);
        const isCurrent = isUnlocked && !isCompleted &&
            (n === 1 || completed.includes(n - 1));

        if (isCompleted) btn.classList.add('completed');
        else if (!isUnlocked) btn.classList.add('locked');
        else if (isCurrent) btn.classList.add('current');

        let statusText = '';
        if (isCompleted) statusText = '✓ ПРОЙДЕНО';
        else if (!isUnlocked) statusText = '🔒 ЗАБЛОКИРОВАНО';
        else if (isCurrent) statusText = '▶ ТЕКУЩИЙ';
        else statusText = '▶ ДОСТУПНО';

        btn.innerHTML = `
            <span class="day-num">0${n}</span>
            <span class="day-label">TAG ${n} — ${DAY_TITLES[n] || '...'}</span>
            <span class="day-status">${statusText}</span>
        `;

        if (!isUnlocked) {
            btn.onclick = () => {
                statusEl.innerText = `⚠ СЕКТОР ${n} ЗАБЛОКИРОВАН. СНАЧАЛА ПРОЙДИТЕ TAG ${n - 1}.`;
                statusEl.style.color = '#ff3333';
                setTimeout(() => {
                    statusEl.innerText = defaultStatus;
                    statusEl.style.color = '';
                }, 2000);
            };
        } else {
            btn.onclick = () => {
                location.href = `tags.html?tag=${n}`;
            };
        }

        daysEl.appendChild(btn);
    }
}

renderMenu();