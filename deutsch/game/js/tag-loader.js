/* ============================================================
   TAG-LOADER.JS — грузит tagN.js по ?tag=N.
   Если ?tag= нет → отправляет на menu.html.
   ============================================================ */

(function () {
    const urlTag = new URLSearchParams(location.search).get('tag');

    if (!urlTag) {
        location.replace('menu.html');
        return;
    }

    if (!isDayUnlocked(urlTag)) {
        document.getElementById('boot-text').innerText =
            `⚠ СЕКТОР ${urlTag} ЗАБЛОКИРОВАН. ПРОЙДИТЕ ПРЕДЫДУЩИЕ ДНИ.`;
        setTimeout(() => { location.replace('menu.html'); }, 2500);
        return;
    }

    const script = document.createElement('script');
    script.src = `js/tag${urlTag}.js`;
    script.onerror = () => {
        document.getElementById('boot-text').innerText = `⚠ TAG ${urlTag} НЕ НАЙДЕН`;
    };
    document.body.appendChild(script);
})();