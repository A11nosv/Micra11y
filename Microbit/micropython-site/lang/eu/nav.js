const PAGES=[
  {id:'index',file:"index.html",num:'',title:'Hasiera',icon:'🏠'},
  {id:'dua',file:"dua.html",num:'00',title:'DBU eskuliburuan',icon:'♿'},
  {id:'cap1',file:"cap1.html",num:'01',title:'Ingurunea prestatzen',icon:'🖥️'},
  {id:'cap2',file:"cap2.html",num:'02',title:'Aldagaiak eta datu motak',icon:'📦'},
  {id:'cap3',file:"cap3.html",num:'03',title:'Baldintzazkoak',icon:'🚦'},
  {id:'cap4',file:"cap4.html",num:'04',title:'Begiztak',icon:'🔄'},
  {id:'cap5',file:"cap5.html",num:'05',title:'Zerrendak eta funtzioak',icon:'🧩'},
  {id:'cap6',file:"cap6.html",num:'06',title:'Sentsoreak',icon:'🌡️'},
  {id:'cap7',file:"cap7.html",num:'07',title:'Soinua eta musika',icon:'🎵'},
  {id:'cap8',file:"cap8.html",num:'08',title:'Irrati komunikazioa',icon:'📡'},
  {id:'cap9',file:"cap9.html",num:'09',title:'Proiektu osoak',icon:'🚀'},
  {id:'cap10',file:"cap10.html",num:'10',title:'Gida pedagogikoa DUA',icon:'🎓'},
  {id:'cap11',file:"cap11.html",num:'11',title:'Irisgarritasuna eta Diseinua',icon:'♿'},
  {id:'apendice',file:"apendice.html",num:'A',title:'Erreferentzia azkarra',icon:'📋'},
  ];
  const SECS=[
  {title:'Orokorra',ids:['index','dua']},
  {title:'Kapituluak',ids:['cap1','cap2','cap3','cap4','cap5','cap6','cap7','cap8']},
  {title:'Proiektuak eta Gida',ids:['cap9','cap10','cap11']},
  {title:'Erreferentzia',ids:['apendice']},
  ];
function buildSidebar(a){
  let h=`<div class="sidebar-logo"><div class="logo-mark">micro<span style='color:var(--coral)'>Python</span><br>Ikasgelan</div><div class="logo-sub">DBU ikuspegidun eskuliburua</div></div><nav>`;
  SECS.forEach(s=>{h+=`<div class="sidebar-section-title">${s.title}</div>`;s.ids.forEach(id=>{const p=PAGES.find(x=>x.id===id);if(!p)return;const ac=id===a?' active':'';h+=`<a href="${p.file}" class="nav-item${ac}"><span class="nav-num">${p.num||p.icon}</span><span>${p.title}</span></a>`;});});
  h+='</nav>';return h;
}
function buildPageNav(a){
  const i=PAGES.findIndex(p=>p.id===a);let h='<div class="page-nav">';
  const pv=PAGES[i-1],nx=PAGES[i+1];
  if(pv)h+=`<a href="${pv.file}"><span>←</span><div><span class="nav-label">Aurrekoa</span><span class="nav-title">${pv.icon} ${pv.title}</span></div></a>`;
  else h+=`<span></span>`;
  if(nx)h+=`<a href="${nx.file}" class="nav-next"><div><span class="nav-label">Hurrengoa</span><span class="nav-title">${nx.icon} ${nx.title}</span></div><span>→</span></a>`;
  h+='</div>';return h;
}
function initPage(a){
  const sb=document.getElementById('sidebar');if(sb)sb.innerHTML=buildSidebar(a);
  const pn=document.getElementById('page-nav');if(pn)pn.innerHTML=buildPageNav(a);
  const btn=document.getElementById('menu-btn'),ov=document.getElementById('overlay');
  if(btn&&sb&&ov){btn.addEventListener('click',()=>{sb.classList.toggle('open');ov.classList.toggle('open');});ov.addEventListener('click',()=>{sb.classList.remove('open');ov.classList.remove('open');});}
}
function codeBlock(fn,lines){
  const esc=lines.map(l=>l.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/(#.*)$/gm,'<span class="cm">$1</span>')
    .replace(/\b(from|import|while|for|if|elif|else|def|return|True|False|None|and|or|not|in|global|pass)\b/g,'<span class="kw">$1</span>')
    .replace(/('[^']*'|"[^"]*")/g,'<span class="str">$1</span>')).join('\n');
  return `<div class="code-block"><div class="code-block-header"><div class="code-dots"><span></span><span></span><span></span></div><span class="code-block-title">${fn}</span></div><pre><code>${esc}</code></pre></div>`;
}
function duaBox(type,items){
  const cfg={rep:{cls:'dua-rep-group',icon:'🟥',label:'DBU — Irudikapena'},ace:{cls:'dua-ace-group',icon:'🟦',label:'DBU — Ekintza eta Adierazpena'},imp:{cls:'dua-imp-group',icon:'🟩',label:'DBU — Inplikazioa'}}[type];
  return `<details class="dua-group ${cfg.cls}"><summary>${cfg.icon} ${cfg.label}</summary><div class="dua-content"><ul>${items.map(i=>`<li>${i}</li>`).join('')}</ul></div></details>`;
}
function box(type,icon,title,items){
  return `<div class="box box-${type}"><span class="box-icon">${icon}</span><div class="box-body"><div class="box-title">${title}</div>${items.map(i=>`<p>${i}</p>`).join('')}</div></div>`;
}
function noteBox(i){return box('note','📝','Irakaslearentzako oharra',i);}
function tipBox(i){return box('tip','💡','Aholku didaktikoa',i);}
function warnBox(i){return box('warn','⚠️','Kontuz',i);}
function conceptBox(i){return box('concept','🔑','Kontzeptu gakoa',i);}
function exerciseBox(ti,i){return box('exercise','✏️',ti,i);}
function challengeBox(ti,i){return box('challenge','🚀',ti,i);}
function table(hds,rows){
  const ths=hds.map(h=>`<th>${h}</th>`).join('');
  const trs=rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
  return `<div class="table-wrap"><table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
}
const LVL=['', '🟢 Hasiera (6-8)', '🟡 Oinarrizkoa (9-11)', '🟠 Ertaina (12-13)', '🔴 Aurreratua (14-16)'];
function level(n){return `<span class="level-badge level-${n}">${LVL[n]}</span>`;}
