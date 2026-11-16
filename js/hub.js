/* =========================================
   hub.js — динамическая загрузка списков
   Структура: manifest.items = [{ id, material, test, groups }]
   + поиск + фильтр по группам
   ========================================= */

let currentGroup = 'all';
let manifestData = null;
let currentSection = '';
let currentQuery = '';
let searchTimer = null;

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

      // Поиск
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          clearTimeout(searchTimer);
          searchTimer = setTimeout(() => {
            currentQuery = e.target.value.trim().toLowerCase();
            renderContent(currentSection);
          }, 200);
        });
      }

      renderContent(sectionName);
      renderMap(manifest);
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

  // Ищем именно секцию материалов по ID
  const materialsSection = document.getElementById('materials');
  // Если нашли — вставляем перед ней. Если нет — падаем обратно на первую секцию.
  const anchor = materialsSection || document.querySelector('.hub-section');
  if (anchor) anchor.parentNode.insertBefore(switcher, anchor);

  
  switcher.querySelectorAll('.group-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switcher.querySelectorAll('.group-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGroup = btn.dataset.group;

      // Сбрасываем поиск при смене группы
      currentQuery = '';
      const si = document.getElementById('searchInput');
      if (si) si.value = '';

      renderContent(currentSection);
    });
  });
}

// ===== ФИЛЬТРАЦИЯ (группа + поиск) =====
function filterItems(items) {
  let result = items;

  // 1. По группе
  if (currentGroup !== 'all') {
    result = result.filter(item => {
      if (!item.groups || item.groups.length === 0) return true;
      return item.groups.includes(currentGroup);
    });
  }

  // 2. По поиску
  if (currentQuery) {
    result = result.filter(item => {
      const haystack = [
        item.material?.title,
        item.material?.description,
        item.material?.type,
        item.test?.title,
        item.test?.description
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(currentQuery);
    });
  }

  return result;
}

// ===== ГЛАВНЫЙ РЕНДЕР =====
function renderContent(sectionName) {
  const items = filterItems(manifestData.items || []);
  renderItems(items, sectionName);
  renderFinalTest(manifestData.finalTest, sectionName);
}

// ===== РЕНДЕР ПАР (материал + тест) =====
function renderItems(items, sectionName) {
  const container = document.getElementById('materialsList');

  if (items.length === 0) {
    container.innerHTML = currentQuery
      ? `<div class="empty">🔍 Ничего не найдено по запросу «${currentQuery}»</div>`
      : `<div class="empty">📭 Для группы "${currentGroup}" материалов пока нет</div>`;
    return;
  }

  container.innerHTML = items.map(item => renderItem(item, sectionName)).join('');
}

function renderItem(item, sectionName) {
  const mat = item.material;
  const test = item.test;

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

// ===== КАРТА КУРСА (из manifest) =====
function renderMap(manifest) {
  const container = document.getElementById('courseMap');
  if (!container) return;

  const levelOrder = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
  const items = (manifest.items || [])
    .slice()
    .sort((a, b) => {
      if (levelOrder[a.level] !== levelOrder[b.level]) {
        return (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
      }
      return (a.unit || 0) - (b.unit || 0);
    });

  if (items.length === 0) return;

  let html = '<div class="timeline-track">';
  
  items.forEach((item, index) => {
    const level = item.level || 'A1';
    const isFirst = index === 0;
    const isLast = index === items.length - 1;
    
    const currentColor = `var(--${level.toLowerCase()}, #3b82f6)`;
    const nextLevel = items[index + 1]?.level || level;
    
    const leftLineClass = isFirst ? 'line-hidden' : `line-color-${level.toLowerCase()}`;
    const rightLineClass = isLast ? 'line-hidden' : (nextLevel === level ? `line-color-${level.toLowerCase()}` : `line-color-${level.toLowerCase()}-to-${nextLevel.toLowerCase()}`);

    const href = item.material?.file 
      ? `../lesson.html?file=deutsch/${item.material.file}&section=deutsch&back=deutsch/deutsch.html` 
      : '#';

    const branchesHtml = (item.branches || []).map(b => {
      const branchHref = `../lesson.html?file=deutsch/${b.file}&section=deutsch`;
      return `
        <div class="branch-node">
          <div class="branch-line"></div>
          <a href="${branchHref}" class="branch-dot" data-tooltip="${b.title}"></a>
        </div>
      `;
    }).join('');

    // Формируем HTML для тултипа
    const tooltipContent = `
      <div class="tooltip-title">${level}.${item.unit || '?'} — ${item.material?.title || ''}</div>
      ${item.canDo ? `<div class="tooltip-section"><h4>🎯 Can-Do</h4><p>${item.canDo}</p></div>` : ''}
      ${item.grammar ? `<div class="tooltip-section"><h4>🧩 Грамматика</h4><p>${item.grammar}</p></div>` : ''}
      ${item.vocabulary ? `<div class="tooltip-section"><h4>📚 Лексика</h4><p>${item.vocabulary}</p></div>` : ''}
      ${item.product ? `<div class="tooltip-section"><h4>🏆 Продукт</h4><p>${item.product}</p></div>` : ''}
    `;

    // Экранируем кавычки для атрибута data-tooltip-html
    const encodedTooltip = encodeURIComponent(tooltipContent);

    html += `
      <div class="timeline-node" style="--node-color: ${currentColor}">
        <div class="timeline-line-left ${leftLineClass}"></div>
        <div class="timeline-line-right ${rightLineClass}"></div>
        
        <a href="${href}" class="timeline-dot" data-tooltip-html="${encodedTooltip}" title="${item.material?.title || ''}"></a>
        
        <div class="timeline-label">${item.unit || ''}. ${item.material?.title || 'Модуль'}</div>
        
        ${branchesHtml ? `<div class="timeline-branches-container">${branchesHtml}</div>` : ''}
      </div>
    `;
  });

  if (manifest.finalTest) {
    const cpTooltip = `
      <div class="tooltip-title">Итоговый контроль</div>
      <div class="tooltip-section"><h4>📝 Формат</h4><p>${manifest.finalTest.questions} вопросов · ${manifest.finalTest.time} мин</p></div>
    `;
    html += `
      <div class="timeline-node timeline-checkpoint" style="--node-color: #94a3b8">
        <div class="timeline-line-left line-color-checkpoint"></div>
        <a href="../quiz.html?test=deutsch/${manifest.finalTest.file}" class="timeline-dot" data-tooltip-html="${encodeURIComponent(cpTooltip)}" title="Итоговый тест"></a>
        <div class="timeline-label">🏁 Финал</div>
      </div>
    `;
  }

  html += '</div>';
  container.innerHTML = html;

  // Инициализируем обработчики для всплывающих окон
  initMapTooltips();
}

// Глобальное окно (одно на всю страницу)
let globalTooltip = null;

function initMapTooltips() {
  if (!globalTooltip) {
    globalTooltip = document.createElement('div');
    globalTooltip.className = 'map-tooltip';
    document.body.appendChild(globalTooltip);
  }

  const dots = document.querySelectorAll('.timeline-dot, .branch-dot');
  dots.forEach(dot => {
    dot.addEventListener('mouseenter', (e) => {
      const htmlContent = dot.getAttribute('data-tooltip-html');
      const textContent = dot.getAttribute('data-tooltip');
      
      if (htmlContent) {
        globalTooltip.innerHTML = decodeURIComponent(htmlContent);
      } else if (textContent) {
        globalTooltip.innerHTML = `<div class="tooltip-title">${textContent}</div>`;
      } else {
        return;
      }

      globalTooltip.classList.add('visible');
      positionTooltip(e.target);
    });

    dot.addEventListener('mouseleave', () => {
      globalTooltip.classList.remove('visible');
    });
  });
}

function positionTooltip(target) {
  if (!globalTooltip) return;
  const rect = target.getBoundingClientRect();
  const tooltipRect = globalTooltip.getBoundingClientRect();
  
  // Позиционируем по центру над точкой
  let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
  let top = rect.top - tooltipRect.height - 12;

  // Защита от вылета за края экрана
  if (left < 10) left = 10;
  if (left + tooltipRect.width > window.innerWidth - 10) {
    left = window.innerWidth - tooltipRect.width - 10;
  }
  
  // Если не влезает сверху — показываем снизу
  if (top < 10) {
    top = rect.bottom + 12;
  }

  globalTooltip.style.left = `${left + window.scrollX}px`;
  globalTooltip.style.top = `${top + window.scrollY}px`;
}

function renderMapNode(item, level, color) {
  const mat = item.material || {};
  const href = mat.file ? `../lesson.html?file=deutsch/${mat.file}&section=deutsch&back=deutsch/deutsch.html` : '#';

  const canDo = item.canDo ? `<div class="tooltip-section"><h4>🎯 Can-Do</h4><p>${item.canDo}</p></div>` : '';
  const grammar = item.grammar ? `<div class="tooltip-section"><h4>🧩 Грамматика</h4><p>${item.grammar}</p></div>` : '';
  const vocab = item.vocabulary ? `<div class="tooltip-section"><h4>📚 Лексика</h4><p>${item.vocabulary}</p></div>` : '';
  const product = item.product ? `<div class="tooltip-section"><h4>🏆 Продукт</h4><p>${item.product}</p></div>` : '';

  return `
    <div class="node" style="--node-color:${color}">
      <div class="node-dot"></div>
      <div class="node-title">${item.unit || ''}. ${mat.title || 'Без названия'}</div>
      <div class="node-subtitle">${mat.description || ''}</div>
      <div class="tooltip">
        <div class="tooltip-title">${level}.${item.unit || '?'}</div>
        ${canDo}${grammar}${vocab}${product}
        <a href="${href}" class="tooltip-link">Открыть урок →</a>
      </div>
    </div>
  `;
}