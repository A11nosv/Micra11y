// ── Navigation data ─────────────────────────────────────────────
const PAGES = [
  { id: 'index',    file: 'index.html',    num: '',    title: 'Inicio',                       icon: '🏠' },
  { id: 'dua',      file: 'dua.html',      num: '00',  title: 'DUA en este manual',           icon: '♿' },
  { id: 'cap1',     file: 'cap1.html',     num: '01',  title: 'Entorno de trabajo',           icon: '🖥️' },
  { id: 'cap2',     file: 'cap2.html',     num: '02',  title: 'Variables y tipos de datos',   icon: '📦' },
  { id: 'cap3',     file: 'cap3.html',     num: '03',  title: 'Condicionales',                icon: '🚦' },
  { id: 'cap4',     file: 'cap4.html',     num: '04',  title: 'Bucles',                       icon: '🔄' },
  { id: 'cap5',     file: 'cap5.html',     num: '05',  title: 'Listas y funciones',           icon: '🧩' },
  { id: 'cap6',     file: 'cap6.html',     num: '06',  title: 'Sensores',                     icon: '🌡️' },
  { id: 'cap7',     file: 'cap7.html',     num: '07',  title: 'Sonido y música',              icon: '🎵' },
  { id: 'cap8',     file: 'cap8.html',     num: '08',  title: 'Comunicación radio',           icon: '📡' },
  { id: 'cap9',     file: 'cap9.html',     num: '09',  title: 'Proyectos completos',          icon: '🚀' },
  { id: 'cap11',    file: 'cap11.html',    num: '10',  title: 'Accesibilidad y Diseño',       icon: '♿' },
  { id: 'cap10',    file: 'cap10.html',    num: '11',  title: 'Guía Pedagógica DUA',          icon: '🎓' },
  { id: 'apendice', file: 'apendice.html', num: 'A',   title: 'Referencia rápida',            icon: '📋' },
];

// ── Build sidebar HTML ───────────────────────────────────────────
function buildSidebar(activeId) {
  const sections = [
    { title: 'General', ids: ['index', 'dua'] },
    { title: 'Capítulos', ids: ['cap1','cap2','cap3','cap4','cap5','cap6','cap7','cap8'] },
    { title: 'Proyectos y Guía', ids: ['cap9','cap10','cap11'] },
    { title: 'Referencia', ids: ['apendice'] },
  ];

  let html = `
    <div class="sidebar-logo">
      <div class="logo-mark">micro<span style="color:var(--coral)">Python</span><br>en el Aula</div>
      <div class="logo-sub">Manual con enfoque DUA</div>
    </div>
    <nav>`;

  sections.forEach(sec => {
    html += `<div class="sidebar-section-title">${sec.title}</div>`;
    sec.ids.forEach(id => {
      const page = PAGES.find(p => p.id === id);
      if (!page) return;
      const active = id === activeId ? ' active' : '';
      html += `
        <a href="${page.file}" class="nav-item${active}">
          <span class="nav-num">${page.num || page.icon}</span>
          <span>${page.title}</span>
        </a>`;
    });
  });

  html += `</nav>`;
  return html;
}

// ── Build prev/next ──────────────────────────────────────────────
function buildPageNav(activeId) {
  const idx = PAGES.findIndex(p => p.id === activeId);
  let html = '<div class="page-nav">';

  const prev = PAGES[idx - 1];
  const next = PAGES[idx + 1];

  if (prev) {
    html += `<a href="${prev.file}"><span>←</span><div><span class="nav-label">Anterior</span><span class="nav-title">${prev.icon} ${prev.title}</span></div></a>`;
  } else {
    html += `<span></span>`;
  }

  if (next) {
    html += `<a href="${next.file}" class="nav-next"><div><span class="nav-label">Siguiente</span><span class="nav-title">${next.icon} ${next.title}</span></div><span>→</span></a>`;
  }

  html += '</div>';
  return html;
}

// ── Init page ────────────────────────────────────────────────────
function initPage(activeId) {
  // Sidebar
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = buildSidebar(activeId);

  // Page nav
  const pageNavEl = document.getElementById('page-nav');
  if (pageNavEl) pageNavEl.innerHTML = buildPageNav(activeId);

  // Hamburger
  const btn = document.getElementById('menu-btn');
  const overlay = document.getElementById('overlay');
  if (btn && sidebar && overlay) {
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}

// ── Code block helper ────────────────────────────────────────────
function codeBlock(filename, lines) {
  const escaped = lines
    .map(l => l
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      // Comment
      .replace(/(#.*)$/gm, '<span class="cm">$1</span>')
      // Keywords
      .replace(/\b(from|import|while|for|if|elif|else|def|return|True|False|None|and|or|not|in|global|pass)\b/g, '<span class="kw">$1</span>')
      // Strings (single and double quoted)
      .replace(/('[^']*'|"[^"]*")/g, '<span class="str">$1</span>')
    )
    .join('\n');

  return `
    <div class="code-block">
      <div class="code-block-header">
        <div class="code-dots"><span></span><span></span><span></span></div>
        <span class="code-block-title">${filename}</span>
      </div>
      <pre><code>${escaped}</code></pre>
    </div>`;
}

// ── DUA accordion helper ─────────────────────────────────────────
function duaBox(type, items) {
  const cfg = {
    rep: { cls: 'dua-rep-group', icon: '🟥', label: 'DUA — Representación' },
    ace: { cls: 'dua-ace-group', icon: '🟦', label: 'DUA — Acción y Expresión' },
    imp: { cls: 'dua-imp-group', icon: '🟩', label: 'DUA — Implicación' },
  }[type];
  const listItems = items.map(i => `<li>${i}</li>`).join('');
  return `
    <details class="dua-group ${cfg.cls}">
      <summary>${cfg.icon} ${cfg.label}</summary>
      <div class="dua-content"><ul>${listItems}</ul></div>
    </details>`;
}

// ── Generic box helper ────────────────────────────────────────────
function box(type, icon, title, items) {
  const listItems = items.map(i => `<p>${i}</p>`).join('');
  return `
    <div class="box box-${type}">
      <span class="box-icon">${icon}</span>
      <div class="box-body">
        <div class="box-title">${title}</div>
        ${listItems}
      </div>
    </div>`;
}

function noteBox(items)      { return box('note',     '📝', 'Nota para el educador', items); }
function tipBox(items)       { return box('tip',      '💡', 'Consejo didáctico', items); }
function warnBox(items)      { return box('warn',     '⚠️', 'Atención', items); }
function conceptBox(items)   { return box('concept',  '🔑', 'Concepto clave', items); }
function exerciseBox(t,items){ return box('exercise', '✏️', t, items); }
function challengeBox(t,items){return box('challenge','🚀', t, items); }

// ── Table helper ─────────────────────────────────────────────────
function table(headers, rows) {
  const ths = headers.map(h => `<th>${h}</th>`).join('');
  const trs = rows.map(r =>
    `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`
  ).join('');
  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${ths}</tr></thead>
        <tbody>${trs}</tbody>
      </table>
    </div>`;
}

// ── Level badge ──────────────────────────────────────────────────
function level(n) {
  const labels = ['', '🟢 Iniciación (6-8)', '🟡 Básico (9-11)', '🟠 Intermedio (12-13)', '🔴 Avanzado (14-16)'];
  return `<span class="level-badge level-${n}">${labels[n]}</span>`;
}
