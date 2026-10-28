/* =========================================
   hub.js — Скрипт для динамической загрузки списков
   С поддержкой фильтрации по группам и связями материал↔тест
   ========================================= */

let currentGroup = 'all';
let manifestData = null;

function initHub(sectionName) {
  fetch('manifest.json')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: файл не найден`);
      return r.json();
    })
    .then(manifest => {
      manifestData = manifest;
      
      // Собираем уникальные группы
      const allGroups = new Set();
      [...(manifest.tests || []), ...(manifest.materials || [])].forEach(item => {
        if (item.groups) item.groups.forEach(g => allGroups.add(g));
      });
      if (manifest.finalTest && manifest.finalTest.groups) {
        manifest.finalTest.groups.forEach(g => allGroups.add(g));
      }
      
      if (allGroups.size > 1) {
        renderGroupSwitcher(Array.from(allGroups));
      }
      
      renderContent(sectionName);
    })
    .catch(err => {
      console.error('Ошибка загрузки manifest.json:', err);
      showError(err.message);
    });
}

// ===== ПЕРЕКЛЮЧАТЕЛЬ ГРУПП =====
function renderGroupSwitcher(groups) {
  const switcher = document.createElement('div');
  switcher.className = 'group-switcher';
  switcher.innerHTML = `
    <div class="group-buttons">
      <button class="group-btn active" data-group="all">Все</button>
      ${groups.map(g => `<button class="group-btn" data-group="${g}">${g}</button>`).join('')}
    </div>
  `;
  
  const firstSection = document.querySelector('.hub-section');
  if (firstSection) firstSection.parentNode.insertBefore(switcher, firstSection);
  
  switcher.querySelectorAll('.group-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switcher.querySelectorAll('.group-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGroup = btn.dataset.group;
      renderContent(getSectionName());
    });
  });
}

function getSectionName() {
  const path = window.location.pathname;
  if (path.includes('/english/')) return 'english';
  if (path.includes('/deutsch/')) return 'deutsch';
  if (path.includes('/linguistic/')) return 'linguistic';
  return '';
}

// ===== ФИЛЬТРАЦИЯ =====
function filterByGroup(items) {
  if (currentGroup === 'all') return items;
  return items.filter(item => {
    if (!item.groups || item.groups.length === 0) return true;
    return item.groups.includes(currentGroup);
  });
}

// ===== ГЛАВНЫЙ РЕНДЕР =====
function renderContent(sectionName) {
  const materials = filterByGroup(manifestData.materials || []);
  const tests = filterByGroup(manifestData.tests || []);
  const finalTest = manifestData.finalTest;
  
  // Создаём пары: материал + связанный тест
  const pairs = buildPairs(materials, tests, sectionName);
  renderPairs(pairs, sectionName);
  
  // Одинокие тесты (без связанного материала)
  const orphanTests = tests.filter(t => !t.relatedMaterial);
  renderOrphanTests(orphanTests, sectionName);
  
  // Итоговый тест
  renderFinalTest(finalTest, sectionName);
}

// ===== СОЗДАНИЕ ПАР =====
function buildPairs(materials, tests, sectionName) {
  const pairs = [];
  const usedTests = new Set();
  
  materials.forEach(mat => {
    const relatedTest = mat.relatedTest 
      ? tests.find(t => t.file === mat.relatedTest)
      : null;
    
    if (relatedTest) usedTests.add(relatedTest.file);
    
    pairs.push({ material: mat, test: relatedTest, sectionName });
  });
  
  return pairs;
}

// ===== РЕНДЕР ПАР =====
function renderPairs(pairs, sectionName) {
  const container = document.getElementById('materialsList');
  
  if (pairs.length === 0) {
    container.innerHTML = `<div class="empty">📭 Для группы "${currentGroup}" материалов пока нет</div>`;
    return;
  }
  
  container.innerHTML = pairs.map(pair => {
    const mat = pair.material;
    const test = pair.test;
    
    // Определяем ссылку на материал
    const isHtml = mat.file.toLowerCase().endsWith('.html');
    
    // ⚠️ ВОТ ЗДЕСЬ ДОБАВЛЕНО &section=${sectionName}
    const matHref = isHtml 
      ? `materials/${mat.file}`
      : `../lesson.html?file=${sectionName}/materials/${mat.file}&section=${sectionName}&back=${sectionName}/${sectionName}.html`;
      
    const formatBadge = isHtml 
      ? '<span class="hub-tag format-badge html">HTML</span>'
      : '<span class="hub-tag format-badge md">MD</span>';
    
    // Кнопка теста (если есть связанный)
    const testButton = test 
      ? `<a href="../quiz.html?test=${sectionName}/tests/${test.file}" target="_blank" class="pair-test-btn">
           🎯 Тест: ${test.title}
           <span class="pair-test-meta">${test.questions || '?'} вопр. · ${test.time || 15} мин</span>
         </a>`
      : `<div class="pair-no-test">📝 Тест пока не добавлен</div>`;
    
    return `
      <div class="pair-card">
        <div class="pair-material">
          <a href="${matHref}" class="pair-material-link">
            <div class="pair-num">${mat.num || '📄'}</div>
            <div class="pair-content">
              <div class="pair-type">📚 Материал</div>
              <h3>${mat.title}</h3>
              <p>${mat.description}</p>
              <div class="hub-card-meta">
                <span class="hub-tag">${mat.type || 'Материал'}</span>
                ${formatBadge}
                ${renderGroupBadges(mat.groups)}
              </div>
            </div>
          </a>
        </div>
        <div class="pair-arrow">→</div>
        <div class="pair-test">
          ${testButton}
        </div>
      </div>
    `;
  }).join('');
}

// ===== ОДИНОКИЕ ТЕСТЫ =====
function renderOrphanTests(tests, sectionName) {
  const container = document.getElementById('testsList');
  
  if (tests.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = `
    <div class="section-subtitle">🎯 Дополнительные тесты</div>
    ${tests.map(test => `
      <a href="../quiz.html?test=${sectionName}/tests/${test.file}" target="_blank" class="hub-card">
        <div class="hub-card-num">${test.num || '★'}</div>
        <div class="hub-card-content">
          <h3>${test.title}</h3>
          <p>${test.description}</p>
          <div class="hub-card-meta">
            <span class="hub-tag">${test.questions || '?'} вопросов</span>
            <span class="hub-tag">${test.time || 15} минут</span>
            ${renderGroupBadges(test.groups)}
          </div>
        </div>
        <div class="hub-card-arrow">Пройти →</div>
      </a>
    `).join('')}
  `;
}

// ===== ИТОГОВЫЙ ТЕСТ =====
function renderFinalTest(finalTest, sectionName) {
  const container = document.getElementById('finalTestList');
  if (!container) return;
  
  if (!finalTest) {
    container.innerHTML = '';
    return;
  }
  
  // Проверяем группу
  if (currentGroup !== 'all' && finalTest.groups && !finalTest.groups.includes(currentGroup)) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = `
    <a href="../quiz.html?test=${sectionName}/tests/${finalTest.file}" target="_blank" class="final-test-card">
      <div class="final-test-icon">🏆</div>
      <div class="final-test-content">
        <div class="final-test-label">ИТОГОВЫЙ ТЕСТ</div>
        <h3>${finalTest.title}</h3>
        <p>${finalTest.description}</p>
        <div class="hub-card-meta">
          <span class="hub-tag">${finalTest.questions || '?'} вопросов</span>
          <span class="hub-tag">${finalTest.time || 20} минут</span>
          ${renderGroupBadges(finalTest.groups)}
        </div>
      </div>
      <div class="final-test-arrow">Пройти →</div>
    </a>
  `;
}

// ===== МЕТОЧКИ =====
function renderGroupBadges(groups) {
  if (!groups || groups.length === 0) return '';
  return groups.map(g => `<span class="hub-tag group-badge">${g}</span>`).join('');
}

// ===== ОШИБКИ =====
function showError(message) {
  const errorMsg = `
    <div class="error" style="grid-column: 1/-1;">
      ❌ Не удалось загрузить manifest.json<br>
      <small>${message}</small>
    </div>
  `;
  document.getElementById('materialsList').innerHTML = errorMsg;
  document.getElementById('testsList').innerHTML = '';
  document.getElementById('finalTestList').innerHTML = '';
}