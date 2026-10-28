/* =========================================
   lesson.js — Метаданные СТРОГО из manifest.json
   ========================================= */

const urlParams = new URLSearchParams(window.location.search);
const filePath = urlParams.get('file');   // например: english/materials/lesson-01-routine.md
const section = urlParams.get('section'); // например: english
const backUrl = urlParams.get('back') || (section ? `${section}/${section}.html` : 'index.html');

if (!filePath || !section) {
  document.getElementById('lessonContent').innerHTML = `<div class="error-box">❌ Ошибка: не указан файл или раздел в URL.</div>`;
  document.getElementById('lessonTitle').textContent = 'Ошибка';
} else {
  // 1. Загружаем manifest.json нужного раздела
  fetch(`${section}/manifest.json`)
    .then(res => {
      if (!res.ok) throw new Error(`Не найден файл ${section}/manifest.json`);
      return res.json();
    })
    .then(manifest => {
      // 2. Находим нужный материал в manifest по имени файла
      const fileName = filePath.split('/').pop(); // получаем "lesson-01-routine.md"
      const material = manifest.materials.find(m => m.file === fileName);

      if (!material) {
        throw new Error(`Материал "${fileName}" не найден в manifest.json`);
      }

      // 3. Загружаем сам текст урока (.md)
      return fetch(filePath).then(res => {
        if (!res.ok) throw new Error(`Файл урока не найден: ${filePath}`);
        return res.text().then(text => ({ material, text }));
      });
    })
    .then(({ material, text }) => {
      // 4. Рендерим заголовок и мета-информацию СТРОГО из manifest.json
      document.getElementById('lessonTitle').textContent = material.title || 'Урок';
      document.getElementById('lessonSubtitle').textContent = material.description || '';
      document.title = (material.title || 'Урок') + ' — Digital College';

      const metaHtml = [];
      if (material.time) metaHtml.push(`<span class="meta-tag">⏱️ ${material.time} мин</span>`);
      if (material.type) metaHtml.push(`<span class="meta-tag">📂 ${material.type}</span>`);
      document.getElementById('lessonMeta').innerHTML = metaHtml.join(' ');

      // 5. Очищаем текст от возможного front matter (--- ... ---), если он вдруг там есть, и рендерим
      const cleanText = text.replace(/^---[\s\S]*?---\n/, '');
      document.getElementById('lessonContent').innerHTML = marked.parse(cleanText);

      // Настраиваем кнопки "Назад"
      const backLink = document.getElementById('backLink');
      const backBtn2 = document.getElementById('backBtn2');
      if (backLink) backLink.href = backUrl;
      if (backBtn2) backBtn2.href = backUrl;
    })
    .catch(err => {
      console.error(err);
      document.getElementById('lessonContent').innerHTML = `<div class="error-box">❌ ${err.message}</div>`;
      document.getElementById('lessonTitle').textContent = 'Ошибка загрузки';
    });
}