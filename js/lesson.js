/* =========================================
   lesson.js — Метаданные + Нативное оглавление
   ========================================= */

const urlParams = new URLSearchParams(window.location.search);
const filePath = urlParams.get('file');
const section = urlParams.get('section');
const backUrl = urlParams.get('back') || (section ? `${section}/${section}.html` : 'index.html');

if (!filePath || !section) {
  document.getElementById('lessonContent').innerHTML = `<div class="error-box">❌ Ошибка: не указан файл или раздел в URL.</div>`;
  document.getElementById('lessonTitle').textContent = 'Ошибка';
} else {
  fetch(`${section}/manifest.json`)
    .then(res => {
      if (!res.ok) throw new Error(`Не найден файл ${section}/manifest.json`);
      return res.json();
    })
    .then(manifest => {
      const relPath = filePath.replace(`${section}/`, '');
      let found = null;
      
      for (const item of manifest.items || []) {
        if (item.material?.file === relPath) {
          found = { material: item.material };
          break;
        }
        const branch = (item.branches || []).find(b => b.file === relPath);
        if (branch) {
          found = {
            material: {
              title: branch.title,
              description: item.material?.title || '',
              type: 'Ветка',
              time: item.material?.time
            }
          };
          break;
        }
      }

      if (!found) throw new Error(`Материал "${relPath}" не найден в manifest.json`);
      const material = found.material;

      return fetch(filePath).then(res => {
        if (!res.ok) throw new Error(`Файл урока не найден: ${filePath}`);
        return res.text().then(text => ({ material, text }));
      });
    })
    .then(({ material, text }) => {
      document.getElementById('lessonTitle').textContent = material.title || 'Урок';
      document.getElementById('lessonSubtitle').textContent = material.description || '';
      document.title = (material.title || 'Урок');

      const metaHtml = [];
      if (material.time) metaHtml.push(`<span class="meta-tag">⏱️ ${material.time} мин</span>`);
      if (material.type) metaHtml.push(`<span class="meta-tag">📂 ${material.type}</span>`);
      document.getElementById('lessonMeta').innerHTML = metaHtml.join(' ');

      const cleanText = text.replace(/^---[\s\S]*?---\n/, '');
      document.getElementById('lessonContent').innerHTML = marked.parse(cleanText);

      // Строим оглавление!
      buildTocTree();

      // Инициализируем интерактивный квиз!
      initInteractiveQuiz();

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

/* ===== ПОСТРОЕНИЕ ДЕРЕВА ОГЛАВЛЕНИЯ (БЕЗ JS-КЛИКОВ) ===== */
function buildTocTree() {
  const content = document.getElementById('lessonContent');
  const listContainer = document.getElementById('tocList');
  if (!content || !listContainer) return;

  const headings = Array.from(content.querySelectorAll('h2, h3'));
  if (headings.length === 0) return;

  listContainer.innerHTML = '';
  
  let currentLi = null;
  let currentUl = null;

  headings.forEach((h, i) => {
    // Генерируем ID для заголовка
    const id = slugifyHeading(h.textContent) || `heading-${i}`;
    h.id = id;

    const link = document.createElement('a');
    link.textContent = h.textContent;
    link.href = `#${id}`; // Браузер сам всё сделает!

    if (h.tagName === 'H2') {
      currentLi = document.createElement('li');
      currentLi.appendChild(link);
      currentUl = document.createElement('ul');
      currentLi.appendChild(currentUl);
      listContainer.appendChild(currentLi);
    } 
    else if (h.tagName === 'H3' && currentLi) {
      const subLi = document.createElement('li');
      subLi.appendChild(link);
      currentUl.appendChild(subLi);
    }
  });

  // Убираем пустые <ul>
  listContainer.querySelectorAll('ul').forEach(ul => {
    if (ul.children.length === 0) ul.remove();
  });

  // Подсветка активного пункта при скролле (IntersectionObserver)
  const allLinks = Array.from(listContainer.querySelectorAll('a'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        allLinks.forEach(a => {
          if (a.getAttribute('href') === `#${id}`) {
            a.classList.add('active');
          } else {
            a.classList.remove('active');
          }
        });
      }
    });
  }, { rootMargin: '-100px 0px -70% 0px' }); // Срабатывает, когда заголовок под навбаром

  headings.forEach(h => observer.observe(h));
}

function slugifyHeading(s) {
  const map = {
    а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'yo', ж:'zh', з:'z', и:'i',
    й:'y', к:'k', л:'l', м:'m', н:'n', о:'o', п:'p', р:'r', с:'s', т:'t',
    у:'u', ф:'f', х:'h', ц:'ts', ч:'ch', ш:'sh', щ:'sch', ъ:'', ы:'y', ь:'',
    э:'e', ю:'yu', я:'ya'
  };
  return (s || '').toString().toLowerCase().trim()
    .split('').map(ch => map[ch] !== undefined ? map[ch] : ch).join('')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-|-$/g, '');
}




/* ===== ИНТЕРАКТИВНЫЙ КВИЗ (добавить в конец lesson.js) ===== */
function initInteractiveQuiz() {
  // Функция проверки отдельного блока
  window.checkQuizBlock = function(btn) {
    const block = btn.closest('.quiz-block');
    const inputs = block.querySelectorAll('.quiz-input, .quiz-select');
    let correct = 0;
    let total = inputs.length;

    inputs.forEach(input => {
      // Очищаем значение: убираем пробелы, приводим к нижнему регистру
      const userAnswer = input.value.trim().toLowerCase();
      // Правильный ответ из data-атрибута тоже чистим
      const correctAnswer = input.dataset.answer.trim().toLowerCase();

      // Сбрасываем классы
      input.classList.remove('correct', 'incorrect');

      if (userAnswer === correctAnswer) {
        input.classList.add('correct');
        correct++;
      } else if (userAnswer !== '') {
        input.classList.add('incorrect');
      }
    });

    // Обновляем статистику в блоке
    const statsSpan = block.querySelector('.quiz-stats');
    const wrong = total - correct;
    statsSpan.innerHTML = `<span class="ok">✓ ${correct}</span> <span class="err">✗ ${wrong}</span>`;
    
    // Если всё верно, подсвечиваем весь блок
    if (correct === total && total > 0) {
      block.style.borderColor = 'rgba(34,197,94,0.5)';
      block.style.background = 'rgba(34,197,94,0.03)';
    }
  };
}

// !!! ВАЖНО: Вызовите эту функцию ПОСЛЕ marked.parse и buildTocTree
// Найдите в вашем коде место после: document.getElementById('lessonContent').innerHTML = marked.parse(cleanText);
// И добавьте туда вызов:
// initInteractiveQuiz();