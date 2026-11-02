/* =========================================
   hub.js — динамическая загрузка списков
   Структура: manifest.items = [{ id, material, test, groups }]
   ========================================= */

let currentGroup = 'all';
let manifestData = null;
let currentSection = '';

function initHub(sectionName) {
  currentSection = sectionName;
  fetch('manifest.json')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: manifest.json не найден`);
      return r.json();
    })
    .then(manifest => {
      manifestData = manifest;

      const allGroups = new Set();
      (manifest.items || []).forEach(item => {
        (item.groups || []).forEach(g => allGroups.add(g));
      });
      if (manifest.finalTest?.groups) {
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
      renderContent(currentSection);
    });
  });
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
  const items = filterByGroup(manifestData.items || []);
  renderItems(items, sectionName);
  renderFinalTest(manifestData.finalTest, sectionName);
}

// ===== РЕНДЕР ПАР (материал + тест) =====
function renderItems(items, sectionName) {
  const container = document.getElementById('materialsList');

  if (items.length === 0) {
    container.innerHTML = `<div class="empty">📭 Для группы "${currentGroup}" материалов пока нет</div>`;
    return;
  }

  container.innerHTML = items.map(item => renderItem(item, sectionName)).join('');
}

function renderItem(item, sectionName) {
  const mat = item.material;
  const test = item.test;

  // Если материала нет — рисуем только тест
  if (!mat) {
    return renderTestOnly(item, sectionName);
  }

  const isHtml = mat.file.toLowerCase().endsWith('.html');
  const matHref = isHtml
    ? `${mat.file}`
    : `../lesson.html?file=${sectionName}/${mat.file}&section=${sectionName}&back=${sectionName}/${sectionName}.html`;

  const formatBadge = isHtml
    ? '<span class="hub-tag format-badge html">HTML</span>'
    : '<span class="hub-tag format-badge md">MD</span>';

  const testButton = test
    ? `<a href="../quiz.html?test=${sectionName}/${test.file}" target="_blank" class="pair-test-btn">
         🎯 Тест: ${test.title}
         <span class="pair-test-meta">${test.questions || '?'} вопр. · ${test.time || 15} мин</span>
       </a>`
    : `<div class="pair-no-test">📝 Тест пока не добавлен</div>`;

  return `
    <div class="pair-card">
      <div class="pair-material">
        <a href="${matHref}" class="pair-material-link">
          <div class="pair-num">📄</div>
          <div class="pair-content">
            <div class="pair-type">📚 Материал</div>
            <h3>${mat.title}</h3>
            <p>${mat.description || ''}</p>
            <div class="hub-card-meta">
              <span class="hub-tag">${mat.type || 'Материал'}</span>
              ${formatBadge}
              ${renderGroupBadges(item.groups)}
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
}

function renderTestOnly(item, sectionName) {
  const test = item.test;
  return `
    <a href="../quiz.html?test=${sectionName}/${test.file}" target="_blank" class="hub-card">
      <div class="hub-card-num">★</div>
      <div class="hub-card-content">
        <h3>${test.title}</h3>
        <p>${test.description || ''}</p>
        <div class="hub-card-meta">
          <span class="hub-tag">${test.questions || '?'} вопросов</span>
          <span class="hub-tag">${test.time || 15} минут</span>
          ${renderGroupBadges(item.groups)}
        </div>
      </div>
      <div class="hub-card-arrow">Пройти →</div>
    </a>
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

  if (currentGroup !== 'all' && finalTest.groups && !finalTest.groups.includes(currentGroup)) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <a href="../quiz.html?test=${sectionName}/${finalTest.file}" target="_blank" class="final-test-card">
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
  const ml = document.getElementById('materialsList');
  const tl = document.getElementById('testsList');
  const fl = document.getElementById('finalTestList');
  if (ml) ml.innerHTML = errorMsg;
  if (tl) tl.innerHTML = '';
  if (fl) fl.innerHTML = '';
}