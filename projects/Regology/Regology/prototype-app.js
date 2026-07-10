/* Regology prototype — app logic */
(function(){
  'use strict';

  // ───────── icons ─────────
  const I = {
    chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>',
    back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    kebab:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>',
    caret:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>',
    sort:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9l4-4 4 4M16 15l-4 4-4-4"/></svg>',
    filter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.5 10 19 14 21 14 12.5 22 3"/></svg>',
    refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.5 15a9 9 0 1 1-2.1-9.4L23 10"/></svg>',
    caretDown:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><polyline points="14 3 14 8 19 8"/></svg>',
    saveExp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
    empty:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
    cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    bang:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16.5" x2="12" y2="16.6"/></svg>',
    clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/></svg>',
    lend:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5a2.5 2.5 0 0 0-2.5-1.5c-1.4 0-2.5.8-2.5 2s1.1 2 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2a2.5 2.5 0 0 1-2.5-1.5M12 6.5v1.5M12 16v1.5"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6z"/><polyline points="9 12 11 14 15 10"/></svg>',
    scale:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M7 21h10M5 7h14M5 7l-2.5 6h5zM19 7l-2.5 6h5z"/></svg>',
    lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    card:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
    chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="20" x2="20" y2="20"/><rect x="6" y="11" width="3" height="7"/><rect x="11" y="6" width="3" height="12"/><rect x="16" y="14" width="3" height="4"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="10 8 16 12 10 16" fill="currentColor" stroke="none"/></svg>',
    up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 14 12 8 18 14"/></svg>',
    down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 10 12 16 18 10"/></svg>',
    x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>',
    edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
    copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    comment:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    outdent:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="6" x2="9" y2="6"/><line x1="21" y1="12" x2="13" y2="12"/><line x1="21" y1="18" x2="9" y2="18"/><polyline points="7 9 4 12 7 15"/></svg>',
    indent:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="15" y2="6"/><line x1="11" y1="12" x2="3" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/><polyline points="17 9 20 12 17 15"/></svg>',
    merge:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="17" x2="21" y2="17"/><polyline points="9 11 12 14 15 11"/></svg>',
  };

  // search-results filter drawer data
  const FILT_CORPUS = [
    { region:'US Federal', items:['7 CFR','12 CFR','12 USC','15 USC','Reg Z','Reg E','Reg X','FCRA'] },
    { region:'Arizona',    items:['ARS Title 6','ARS Title 44','AAC R20','AZ Banking Dept','AZ Consumer Lender'] },
    { region:'Alabama',    items:['Ala. Code Title 5','Ala. Code Title 8','AL State Banking','AL Consumer Credit'] },
    { region:'California',  items:['Cal. Fin. Code','Cal. Civ. Code','CCR Title 10','CA DFPI'] },
  ];
  const FILT_KW = ['APR','finance charge','disclosure','escrow','rescission','beneficial ownership','incident reporting','high cost','Tier 1 capital','error resolution','permissible purpose','servicing'];

  // ───────── state ─────────
  const S = {
    screen:'dashboard',
    resultMode:'table',          // table | lawtype | jurisdiction
    view:'list',                 // list | chapter
    filter:'all',                // all | unread
    selected:new Set(),
    rowState:{},                 // idx -> included | excluded
    cardState:{},
    expTitle:'7 CFR 1786.151',
    selState:'CA',
    savedFlash:null,
    expFilterCorpus:new Set(),
    expFilterKw:new Set(),
    resFilterCorpus:new Set(),
    resFilterKw:new Set(),
    resFiltTab:'corpus',
    fromSearch:false,
    ltOpen:{0:true},
    diffView:'compared',
    diffVersion:'Version 3.7',
    decompose:false,
    diffPage:1,
    diffSel:null,
    crumbSel:'Collection and Recovery',
  };

  // version-difference document (Task 11)
  const REGDOC = {
    no:'7 CFR 1786.151',
    title:'Collection and Recovery of Penalty',
    crumb:[
      {t:'CFR', go:'regulations'},
      {t:'Labour', go:'regulations'},
      {t:'Regulations Relating…', go:'regulations'},
      {t:'Wage and Hour Division', go:'regulations', root:true},
      {t:'Regulations', go:'regulations'},
      {t:'Civil Money Penalties', go:'results', dd:true},
      {t:'Collection and Recovery', cur:true},
    ],
    ddOpts:['Assessment of Penalties','Collection and Recovery','Administrative Review','Judicial Review'],
    additions:11, deletions:10,
    paras:[
      { tag:'Title', segs:[['§ 580.12  Collection and recovery of civil money penalties.']] },
      { tag:'Requirement', segs:[
        ['Pursuant to section 16(e) of the Fair Labor Standards Act, the Administrator may assess and recover a civil money penalty from any person who repeatedly or willfully violates the minimum wage or overtime requirements of sections 6 and 7 of the Act. '],
        ['Effective January 15, 2025, the maximum penalty amounts prescribed in this section are adjusted for inflation in accordance with the Federal Civil Penalties Inflation Adjustment Act Improvements Act of 2015. ','add'],
        ['The civil money penalty for each such violation shall not exceed '],
        ['$2,374','del'],
        ['$2,515','add'],
        [', and in determining the amount the Administrator shall give due consideration to the seriousness of the violation and the size of the employer\u2019s business.'],
      ]},
      { tag:'Sanction', block:true, segs:[
        ['A civil money penalty assessed under this part becomes final and unappealable if the person against whom it is assessed fails to file an exception within 15 days of receipt of the notice of assessment. ','del'],
        ['The Administrator shall notify the affected person of the amount of the penalty, and of the violations for which it is assessed, by certified mail. '],
        ['A person desiring review of a penalty assessment must file a written exception with the Administrator within 30 days of the date of the notice of assessment; failure to file a timely exception renders the assessment final and not subject to further administrative or judicial review. ','add'],
        ['Amounts assessed under this section are recoverable in a civil action brought by the Secretary in any court of competent jurisdiction. '],
        ['Any penalty not paid within 30 days after it becomes final shall accrue interest at the rate established under 28 U.S.C. 1961 from the date the assessment becomes final until the date of payment.','add'],
      ]},
      { tag:'Sanction', segs:[
        ['Sums recovered under this section shall be deposited in the Treasury of the United States as miscellaneous receipts. '],
        ['Penalties collected for child labor violations may be retained by the Department to offset the costs of enforcement.','del'],
        [' The assessment or recovery of a civil money penalty under this section does not preclude the Secretary from pursuing any other remedy available under the Act.'],
      ]},
    ],
  };

  const inner = document.getElementById('pageInner');
  const page  = document.getElementById('page');

  // ───────── router ─────────
  const NAV_OF = {dashboard:'dashboard',results:'dashboard',regdiff:'dashboard',explorations:'explorations',regulations:'regulations',
                  regareas:'regareas',risks:'risks',controls:'controls',tasks:'tasks',crun:'crun',cdash:'cdash'};
  window.go = function(screen, arg){
    S.screen = screen;
    const navKey = NAV_OF[screen];
    document.querySelectorAll('#topnav a').forEach(a=>a.classList.toggle('active', a.dataset.nav===navKey));
    page.scrollTop = 0;
    page.classList.toggle('has-sticky', screen==='results');
    const R = {dashboard:renderDashboard,results:renderResults,regdiff:renderRegDiff,explorations:renderExplorations,regulations:renderRegulations,
               regareas:renderRegAreas,risks:renderRisks,controls:renderControls,tasks:renderTasks,crun:renderCRun,cdash:renderCDash};
    (R[screen]||renderDashboard)(arg);
    wireSearch();
  };

  // ───────── toast ─────────
  let toastT;
  function toast(msg, ms){
    const t=document.getElementById('toast');
    t.innerHTML=I.check+'<span>'+msg+'</span>';
    t.classList.add('show');
    clearTimeout(toastT);
    toastT=setTimeout(()=>t.classList.remove('show'), ms||2200);
  }
  window.toastFav=()=>toast('Added to favourites');

  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // ───────── shared header ─────────
  function header(title){
    return `<div class="apphead">
      <div class="ptitle">${esc(title)}</div>
      <div class="searchbox">
        <input id="gSearch" type="text" placeholder="Search by keyword/phrases" autocomplete="off" />
        <span class="si">${I.search}</span>
        <div class="ac" id="gAc"></div>
      </div>
      <div class="btn-exp">
        <span class="lbl" onclick="go('explorations')">Explorations</span>
        <span class="div"></span>
        <span class="pl" onclick="newExploration()" title="Create new exploration">${I.plus}</span>
      </div>
    </div>`;
  }
  window.newExploration=()=>{ go('dashboard'); setTimeout(()=>{const i=document.getElementById('gSearch'); if(i){i.focus();}},80); toast('Search a keyword to build a new exploration'); };

  function wireSearch(){
    const input=document.getElementById('gSearch');
    const ac=document.getElementById('gAc');
    if(!input) return;
    let cur=-1;
    function build(){
      ac.innerHTML = AUTOCOMPLETE.map((a,i)=>`<div class="ac-item" data-i="${i}"><div class="t">${a.no}</div><div class="d">${a.d}</div></div>`).join('');
      ac.querySelectorAll('.ac-item').forEach(el=>el.addEventListener('mousedown',e=>{e.preventDefault();pick(el.dataset.i);}));
    }
    function open(){ build(); ac.classList.add('show'); }
    function close(){ ac.classList.remove('show'); cur=-1; }
    function pick(i){ input.value=AUTOCOMPLETE[i].no; S.expTitle=AUTOCOMPLETE[i].no; S.resultMode='table'; S.fromSearch=true; close(); go('results'); }
    input.addEventListener('focus',open);
    input.addEventListener('input',()=>{ if(input.value.trim()) open(); else close(); });
    input.addEventListener('keydown',e=>{
      const items=ac.querySelectorAll('.ac-item');
      if(e.key==='ArrowDown'){e.preventDefault();cur=Math.min(cur+1,items.length-1);hi(items);}
      else if(e.key==='ArrowUp'){e.preventDefault();cur=Math.max(cur-1,0);hi(items);}
      else if(e.key==='Enter'){e.preventDefault(); if(cur>=0) pick(cur); else{ S.expTitle=input.value.trim()||S.expTitle; S.resultMode='table'; S.fromSearch=true; close(); go('results'); }}
      else if(e.key==='Escape'){close();}
    });
    function hi(items){ items.forEach((el,i)=>el.classList.toggle('cur',i===cur)); }
    input.addEventListener('blur',()=>setTimeout(close,140));
  }

  // ════════════════════════ DASHBOARD ════════════════════════
  function renderDashboard(){
    inner.innerHTML = header('Dashboard') + `
      <div class="stat-row">
        <div class="stat s-red"><div class="stat-ic">${I.bang}</div><div><div class="sv">26 Overdue Tasks</div><div class="ss">Pending Since 11 Aug 2019</div></div></div>
        <div class="stat s-blue"><div class="stat-ic">${I.cal}</div><div><div class="sv">23 Tasks Due Today</div><div class="ss">Tasks Assigned on 08 Dec 2019</div></div></div>
        <div class="stat s-green"><div class="stat-ic">${I.clock}</div><div><div class="sv">189 Tasks Due In A Week</div><div class="ss">Pending Since 11 Aug 2019</div></div></div>
        <div class="stat s-blue"><div class="stat-ic">${I.doc}</div><div><div class="sv">244 Overdue Tasks</div><div class="ss">Pending Since 11 Aug 2019</div></div></div>
      </div>

      <div class="dash-grid">
        <div class="panel g-reg">
          <div class="panel-head"><span class="ph-t">Regulations</span><span class="ph-x">6 Regulations</span></div>
          <div class="minis">
            <div class="mini" onclick="openSearch('Implemented regulations')"><div class="mn">4</div><div class="ml">Implemented</div></div>
            <div class="mini" onclick="openSearch('Non-implemented regulations')"><div class="mn">2</div><div class="ml">Non Implemented</div></div>
            <div class="mini" onclick="openSearch('Under review')"><div class="mn">4</div><div class="ml">Under Review</div></div>
            <div class="mini" onclick="openSearch('Newly assigned')"><div class="mn">2</div><div class="ml">Newly Assigned</div></div>
          </div>
        </div>

        <div class="panel g-chg">
          <div class="panel-head"><span class="ph-t">Regulatory Changes</span><span class="ph-x">288 Regulations</span></div>
          <div class="minis tall">
            <div class="mini" onclick="openSearch('Regulatory updates')"><div class="mn">4</div><div class="ml">Updates</div></div>
            <div class="mini" onclick="openSearch('Regulatory changes')"><div class="mn">2</div><div class="ml">Changes</div></div>
          </div>
        </div>

        <div class="panel g-fav">
          <div class="panel-head"><span class="ph-t">My Favourites</span><span class="ph-x link" onclick="toastFav()">+ Add Favourites</span></div>
          <div class="fav-list">
            ${FAVS.map(f=>`<div class="fav" onclick="openDoc('${esc(f.no)}')"><span class="fav-no">${esc(f.no)}</span><span class="fav-t">${esc(f.t)}</span></div>`).join('')}
          </div>
        </div>

        <div class="panel g-risk">
          <div class="panel-head"><span class="ph-t">Risk Test</span><span class="ph-x">5 Regulations</span></div>
          <div class="minis">
            <div class="mini" onclick="go('risks')"><div class="mn">3</div><div class="ml">No Control</div></div>
            <div class="mini" onclick="go('risks')"><div class="mn">2</div><div class="ml">Non Implemented</div></div>
          </div>
        </div>

        <div class="panel g-ctrl">
          <div class="panel-head"><span class="ph-t">Controls</span><span class="ph-x">14 Controls</span></div>
          <div class="minis">
            <div class="mini" onclick="go('controls')"><div class="mn">5</div><div class="ml">Implemented</div></div>
            <div class="mini" onclick="go('controls')"><div class="mn">7</div><div class="ml">Non Implemented</div></div>
            <div class="mini span2" onclick="go('controls')"><div class="mn">2</div><div class="ml">Changes</div></div>
          </div>
        </div>
      </div>`;
  }
  window.openSearch=(q)=>{ S.expTitle=q; S.resultMode='table'; S.view='list'; S.fromSearch=false; go('results'); };
  window.openDoc=(no)=>{
    const row=RESULTS.find(r=>!r.chapter && r.no===no);
    if(row) row.unread=false;
    REGDOC.no=no;
    S.diffView='compared'; S.decompose=false; S.diffPage=1; S.diffSel=null;
    go('regdiff');
  };

  // ════════════════════════ SEARCH RESULTS ════════════════════════
  function renderResults(){
    const selN=S.selected.size;
    const viewbyVal = S.resultMode==='lawtype'?'lawtype':S.resultMode==='jurisdiction'?'jurisdiction':'';
    inner.innerHTML = header('Search Results') + `
      <div class="res-bar">
        <div class="back-chip" onclick="go('dashboard')" style="flex:0 0 auto">${I.back}</div>
        <span class="res-count">Showing <b>83 results</b> for &ldquo;${esc(S.expTitle)}&rdquo;</span>
        <div class="res-actions">
          <div class="vtab" id="vtab">
            <button data-v="list" class="${S.resultMode==='table'&&S.view==='list'?'active':''}">List View</button>
            <button data-v="chapter" class="${S.resultMode==='table'&&S.view==='chapter'?'active':''}">Chapter View</button>
          </div>
          ${S.resultMode==='table'? `<div class="seg" id="seg">
            <button data-f="all" class="${S.filter==='all'?'active':''}">Show All</button>
            <button data-f="unread" class="${S.filter==='unread'?'active':''}">Unread</button>
          </div>`:''}
          <select class="select-sm" id="viewby">
            <option value="">View by</option>
            <option value="lawtype" ${viewbyVal==='lawtype'?'selected':''}>Law Type</option>
            <option value="jurisdiction" ${viewbyVal==='jurisdiction'?'selected':''}>Jurisdiction</option>
          </select>
          <button class="icon-btn filt-btn ${(S.resFilterCorpus.size+S.resFilterKw.size)?'has-filt':''}" title="Filter" onclick="openResultFilter()">${I.filter}</button>
        </div>
      </div>
      ${S.fromSearch? `<div class="save-prompt" id="savePrompt">
        <span class="sp-txt">${I.saveExp}<span>Save this search as an exploration to reuse it later.</span></span>
        <span class="sp-actions">
          <button class="btn btn-primary btn-sm" onclick="openSaveModal()">${I.saveExp}Save Exploration</button>
          <button class="sp-x" onclick="dismissSavePrompt()" title="Dismiss">${I.x}</button>
        </span>
      </div>`:''}
      <div id="resBody"></div>`;

    document.getElementById('vtab').querySelectorAll('button').forEach(b=>b.onclick=()=>{ S.resultMode='table'; S.view=b.dataset.v; renderResults(); });
    const seg=document.getElementById('seg'); if(seg) seg.querySelectorAll('button').forEach(b=>b.onclick=()=>{ S.filter=b.dataset.f; renderResults(); });
    document.getElementById('viewby').onchange=(e)=>{ const v=e.target.value; if(v==='lawtype'){S.resultMode='lawtype';} else if(v==='jurisdiction'){S.resultMode='jurisdiction';} else {S.resultMode='table';} renderResults(); };

    if(S.resultMode==='lawtype') renderLawType();
    else if(S.resultMode==='jurisdiction') renderJurisdiction();
    else renderTable();

    if(S.resultMode==='table' && S.selected.size){
      const n=S.selected.size;
      const ab=document.createElement('div'); ab.className='action-bar';
      ab.innerHTML=`<div class="ab-inner">
        <span class="ab-count"><b>${n}</b> item${n>1?'s':''} selected</span>
        <button class="ab-clear" onclick="clearSel()">Clear selection</button>
        <span class="ab-btns">
          <button class="btn-exc-lg" onclick="confirmBulk('excluded')">${I.trash}Exclude</button>
          <button class="btn-inc-lg" onclick="confirmBulk('included')">${I.plus}Include</button>
        </span>
      </div>`;
      inner.appendChild(ab);
    }
  }
  window.clearSel=()=>{ S.selected.clear(); renderResults(); };
  window.dismissSavePrompt=()=>{ S.fromSearch=false; const p=document.getElementById('savePrompt'); if(p)p.remove(); };

  function dataRows(){ return RESULTS.map((r,i)=>({r,i})).filter(x=>!x.r.chapter); }
  function visRows(){ return dataRows().filter(x=>rowVisible(x.r) && S.rowState[x.i]!=='excluded'); }
  function allSelected(){ const d=visRows(); return d.length && d.every(x=>S.selected.has(x.i)); }
  function someSelected(){ const d=visRows(); const sel=d.filter(x=>S.selected.has(x.i)).length; return sel>0 && !allSelected(); }
  function rowVisible(r){ return S.filter==='all' ? true : !!r.unread; }

  function renderTable(){
    let body=''; let any=false;
    RESULTS.forEach((r,idx)=>{
      if(r.chapter){
        if(S.view==='chapter') body+=`<tr class="chapter"><td colspan="6">${esc(r.chapter)}<span class="ch-r">${esc(r.note)}</span></td></tr>`;
        return;
      }
      if(!rowVisible(r)) return;
      if(S.rowState[idx]==='excluded') return;
      any=true;
      const on=S.selected.has(idx);
      const st=S.rowState[idx];
      const stTag = st==='included'?'<span class="chip chip-inc on" style="pointer-events:none;padding:2px 8px;font-size:10px;margin-left:6px">Included</span>':'';
      const mark = /1786/.test(r.no) ? ' mark':'';
      body+=`<tr class="row ${r.hi?'hi':''}">
        <td class="col-chk"><div class="chk-cell"><span class="cbx ${on?'on':''}" onclick="toggleRow(${idx})">${I.check}</span>${r.unread?'<span class="unread-dot" title="Unread"></span>':''}</div></td>
        <td class="col-no"><span class="docno${mark}" onclick="openDoc('${esc(r.no)}')">${esc(r.no)}</span></td>
        <td><span class="ttl">${esc(r.title)}</span>${stTag}</td>
        <td><span class="desc">${r.desc}</span></td>
        <td class="col-type"><span class="badge-type">${esc(r.type)}</span></td>
        <td class="col-act"><button class="kebab" onclick="rowMenu(event,${idx})">${I.kebab}</button></td>
      </tr>`;
    });
    if(!any) body=`<tr><td colspan="6"><div class="empty">${I.empty}<h3>No unread results</h3><p>Switch to “Show All” to see every matching regulation.</p></div></td></tr>`;
    document.getElementById('resBody').innerHTML = `
      <div class="tbl-wrap"><table class="rt">
        <thead><tr>
          <th class="col-chk"><span class="chk-head" onclick="openChkMenu(event)"><span class="cbx ${allSelected()?'on':someSelected()?'ind':''}">${I.check}<i class="dashln"></i></span><span class="ca">${I.caretDown}</span></span></th>
          <th class="col-no"><span class="sortable">Doc. No ${I.sort}</span></th>
          <th><span class="sortable">Title ${I.sort}</span></th>
          <th><span class="sortable">Description ${I.sort}</span></th>
          <th class="col-type"><span class="sortable">Law Type ${I.sort}</span></th>
          <th class="col-act">Actions</th>
        </tr></thead>
        <tbody>${body}</tbody>
      </table></div>`;
  }

  window.toggleRow = idx => { if(S.selected.has(idx)) S.selected.delete(idx); else S.selected.add(idx); renderResults(); };
  window.confirmBulk = st => {
    const n=S.selected.size; if(!n) return;
    const danger = st==='excluded';
    const noun = n>1?'regulations':'regulation';
    const subj = n>1?'These regulations':'This regulation';
    const bg=document.getElementById('modalBg');
    bg.innerHTML=`<div class="modal confirm-modal">
      <div class="cm-hero ${danger?'cm-danger':'cm-pos'}"><span class="cm-ic">${danger?I.trash:I.check}</span></div>
      <div class="cm-body">
        <h3>${danger?`Exclude ${n} ${noun}?`:`Include ${n} ${noun}?`}</h3>
        <p>${danger
          ? `${subj} will be removed from this exploration and will no longer be tracked for changes. This action is final.`
          : `${subj} will be added to your exploration and tracked for changes from now on — you're building a sharper watchlist.`}</p>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn ${danger?'btn-danger':'btn-primary'}" onclick="applyBulk('${st}')">${danger?I.trash+'Exclude':I.check+'Include'} ${n}</button>
      </div>
    </div>`;
    bg.classList.add('show');
  };
  window.applyBulk = st => {
    const n=S.selected.size; if(!n){ closeModal(); return; }
    S.selected.forEach(i=>S.rowState[i]=st); S.selected.clear();
    closeModal(); renderResults();
    toast(n+' regulation'+(n>1?'s':'')+' '+(st==='included'?'included':'excluded'));
  };

  window.openChkMenu=(e)=>{ e.stopPropagation(); closeMenus();
    const r=e.currentTarget.getBoundingClientRect();
    const m=document.createElement('div'); m.className='menu show';
    m.style.left=(r.left+window.scrollX)+'px'; m.style.top=(r.bottom+window.scrollY+6)+'px';
    const opts=[['all','Select All'],['included','Included'],['unread','Unread']];
    m.innerHTML=opts.map(o=>`<button data-k="${o[0]}">${o[1]}<span class="mk">${I.check}</span></button>`).join('');
    document.body.appendChild(m);
    m.querySelectorAll('button').forEach(b=>b.onclick=()=>{ selectBy(b.dataset.k); closeMenus(); });
  };
  function selectBy(kind){
    S.selected.clear();
    dataRows().forEach(({r,i})=>{
      if(kind==='all') S.selected.add(i);
      else if(kind==='unread' && r.unread) S.selected.add(i);
      else if(kind==='included' && S.rowState[i]==='included') S.selected.add(i);
      else if(kind==='excluded' && S.rowState[i]==='excluded') S.selected.add(i);
    });
    const labels={all:'',unread:'Unread ',included:'Included ',excluded:'Excluded '};
    toast('Selected '+S.selected.size+' '+labels[kind]+'item'+(S.selected.size!==1?'s':''));
    renderResults();
  }

  window.rowMenu=(e,idx)=>{ e.stopPropagation(); closeMenus();
    const r=e.currentTarget.getBoundingClientRect();
    const m=document.createElement('div'); m.className='menu show';
    m.style.left=(r.right+window.scrollX-170)+'px'; m.style.top=(r.bottom+window.scrollY+4)+'px';
    m.innerHTML=`<button onclick="(function(){closeMenus();openDoc('${esc(RESULTS[idx].no)}')})()">Open regulation</button>
      <button onclick="rowAct(${idx},'included')">Include in exploration</button>
      <button onclick="rowAct(${idx},'excluded')">Exclude from exploration</button>
      <div class="sep"></div>
      <button onclick="(function(){closeMenus();toast('Marked as read')})()">Mark as read</button>
      <button onclick="(function(){closeMenus();toast('Added to favourites')})()">Add to favourites</button>`;
    document.body.appendChild(m);
  };
  window.rowAct=(idx,st)=>{ closeMenus(); S.selected.clear(); S.selected.add(idx); confirmBulk(st); };
  function closeMenus(){ document.querySelectorAll('.menu,.filt-panel').forEach(m=>{ if(m.classList.contains('filt-panel')) m.classList.remove('show'); else m.remove(); }); }
  document.addEventListener('click',closeMenus);

  // ───── View by: Law Type accordion ─────
  function renderLawType(){
    document.getElementById('resBody').innerHTML = `<div class="acc">${
      LAW_TYPES.map((lt,i)=>`<div class="acc-group ${S.ltOpen[i]?'open':''}" data-lt="${i}">
        <div class="acc-head" onclick="toggleLT(${i})"><span class="car">${I.caret}</span>${esc(lt.code)} — ${esc(lt.name)}<span class="acc-count">${lt.count} regulations</span></div>
        <div class="acc-body">${lt.regs.map(r=>`<div class="lt-reg"><span class="lt-no">${esc(r.no)}</span><span class="lt-ttl">${esc(r.title)}</span><span class="lt-jur">${esc(r.jur)}</span></div>`).join('')}</div>
      </div>`).join('')
    }</div>`;
  }
  window.toggleLT=(i)=>{ S.ltOpen[i]=!S.ltOpen[i]; const el=document.querySelector('.acc-group[data-lt="'+i+'"]'); if(el) el.classList.toggle('open'); };

  // ───── View by: Jurisdiction map ─────
  function renderJurisdiction(){
    const tiles = US_TILES.map(([ab,r,c])=>{
      const hasLaws = !!STATE_LAWS[ab];
      const cls = 'tile'+(S.selState===ab?' active':(hasLaws?' has':''));
      return `<div class="${cls}" style="grid-column:${c+1};grid-row:${r+1}" onclick="selState('${ab}')" title="${esc(STATE_NAMES[ab]||ab)}">${ab}</div>`;
    }).join('');
    const usStates = Object.keys(STATE_LAWS).map(ab=>`<div class="rt-node l3 ${S.selState===ab?'active':''}" onclick="selState('${ab}')">${esc(STATE_NAMES[ab])}</div>`).join('');
    document.getElementById('resBody').innerHTML = `
      <h3 style="font-size:16px;font-weight:700;color:#1f2733;margin:4px 0 16px">Explore the regulatory landscape of a region</h3>
      <div class="jur-wrap">
        <div>
          <div class="map-card">
            <div class="usmap">${tiles}</div>
            <div class="map-legend"><span><i style="background:#bcd4ff"></i>Has regulations</span><span><i style="background:#dbe7ff"></i>No content yet</span><span><i style="background:var(--rb)"></i>Selected</span></div>
          </div>
          <div class="jur-laws" id="jurLaws"></div>
        </div>
        <div class="region-tree">
          <div class="rt-h">Region</div>
          <div class="rt-node">Europe</div>
          <div class="rt-node">Asia Pacific</div>
          <div class="rt-node active">North America</div>
          <div class="rt-node l2">United States</div>
          <div class="rt-node l3" onclick="toast('US Federal corpus')">US Federal</div>
          <div class="rt-node l2">US States</div>
          ${usStates}
        </div>
      </div>`;
    renderJurLaws();
  }
  window.selState=(ab)=>{ S.selState=ab; renderJurisdiction(); };
  function renderJurLaws(){
    const ab=S.selState, laws=STATE_LAWS[ab];
    const el=document.getElementById('jurLaws'); if(!el) return;
    if(!laws){ el.innerHTML=`<div class="empty">${I.empty}<h3>No regulations for ${esc(STATE_NAMES[ab]||ab)}</h3><p>This jurisdiction has not been loaded into the corpus yet.</p></div>`; return; }
    el.innerHTML = `<div class="jl-h">${esc(STATE_NAMES[ab])} — State Regulations</div>
      <div class="jl-sub">${laws.length} regulations in this jurisdiction</div>
      <div class="tbl-wrap"><table class="rt"><thead><tr><th class="col-no">Doc. No</th><th>Title</th><th class="col-type">Law Type</th><th class="col-act">Actions</th></tr></thead>
      <tbody>${laws.map(l=>`<tr class="row"><td class="col-no"><span class="docno" onclick="openDoc('${esc(l.no)}')">${esc(l.no)}</span></td><td><span class="ttl">${esc(l.title)}</span></td><td class="col-type"><span class="badge-type">${esc(l.type)}</span></td><td class="col-act"><button class="kebab" onclick="toast('More actions')">${I.kebab}</button></td></tr>`).join('')}</tbody></table></div>`;
  }

  // ───── card view (kept, accessible via explorations open) ─────
  function renderCards(target){
    target.innerHTML = `<div class="cards">${CARDS.map((c,i)=>{
      const st=S.cardState[i];
      return `<div class="rcard">
        <div class="rc-top"><span class="rc-no">${esc(c.no)}</span><span class="rc-reg">${esc(c.regs)}</span></div>
        <div class="rc-ttl">${esc(c.title)}</div>
        <div class="rc-src">${esc(c.src)}</div>
        <div class="rc-acts">
          <span class="chip chip-inc ${st==='included'?'on':''}" onclick="cardAct(${i},'included')">+ Include</span>
          <span class="chip chip-exc ${st==='excluded'?'on':''}" onclick="cardAct(${i},'excluded')">Exclude</span>
          <span class="chip chip-con" onclick="toast('Connecting regulation')">Connect</span>
        </div></div>`;
    }).join('')}</div>`;
  }
  window.cardAct=(i,st)=>{ S.cardState[i]= S.cardState[i]===st?null:st; toast('Regulation '+(st==='included'?'included':'excluded')); renderResults(); };

  // ════════════════════════ SAVE EXPLORATION MODAL ════════════════════════
  window.openSaveModal=()=>{
    const bg=document.getElementById('modalBg');
    bg.innerHTML=`<div class="modal">
      <div class="modal-head"><h3>Save Exploration</h3><button class="mx" onclick="closeModal()">${I.x}</button></div>
      <div class="modal-body">
        <div class="fld"><label>Exploration name</label><input class="f" id="expName" value="${esc(S.expTitle)}" placeholder="e.g. Consumer Lending — APR Disclosures" /></div>
        <div class="fld" style="display:flex;gap:12px">
          <div style="flex:1"><label>Corpus</label><select class="f" id="expCorpus"><option>CFR</option><option>USC</option><option>State</option><option>Guidance</option></select></div>
          <div style="flex:1"><label>Jurisdiction</label><select class="f" id="expJur"><option>US Federal</option><option>California</option><option>New York</option><option>Texas</option><option>Florida</option></select></div>
        </div>
        <div class="fld"><label>Keywords</label><input class="f" id="expKw" value="${esc(S.expTitle)}" placeholder="comma-separated keywords" />
          <div class="kwchips" id="kwchips"></div></div>
        <div class="fld"><label>Description <span style="color:#9aa2ae;font-weight:400">(optional)</span></label><textarea class="f" id="expDesc" placeholder="What does this exploration track?"></textarea></div>
      </div>
      <div class="modal-foot"><button class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveExp()">Save Exploration</button></div>
    </div>`;
    bg.classList.add('show');
    renderKwChips();
    const kw=document.getElementById('expKw'); kw.addEventListener('input',renderKwChips);
  };
  function renderKwChips(){
    const v=document.getElementById('expKw').value;
    const chips=v.split(',').map(s=>s.trim()).filter(Boolean);
    document.getElementById('kwchips').innerHTML=chips.map(c=>`<span class="kwchip">${esc(c)}</span>`).join('');
  }
  window.closeModal=()=>document.getElementById('modalBg').classList.remove('show');
  window.saveExp=()=>{
    const name=(document.getElementById('expName').value.trim())||'Untitled Exploration';
    const corpus=document.getElementById('expCorpus').value;
    const jur=document.getElementById('expJur').value;
    const kw=document.getElementById('expKw').value.trim()||S.expTitle;
    const desc=document.getElementById('expDesc').value.trim()||'Saved from search results.';
    EXPLORATIONS.unshift({name,kw,jur,corpus,desc});
    S.savedFlash=name;
    closeModal();
    go('explorations');
    toast('Exploration “'+name+'” saved to your library.', 3000);
  };

  // ════════════════════════ EXPLORATIONS (Saved page + filter) ════════════════════════
  function expFiltered(){
    return EXPLORATIONS.filter(e=>{
      if(S.expFilterCorpus.size && !S.expFilterCorpus.has(e.corpus)) return false;
      if(S.expFilterKw.size){ const hay=(e.kw+' '+e.name).toLowerCase(); let ok=false; S.expFilterKw.forEach(k=>{ if(hay.includes(k.toLowerCase())) ok=true; }); if(!ok) return false; }
      return true;
    });
  }
  function renderExplorations(){
    const list=expFiltered();
    const activeFilters=S.expFilterCorpus.size+S.expFilterKw.size;
    inner.innerHTML = header('Explorations') + `
      <div class="res-bar">
        <span class="res-count"><b>${list.length} Saved Exploration${list.length!==1?'s':''}</b></span>
        <div class="res-actions">
          <button class="btn btn-ghost btn-sm" onclick="newExploration()">${I.plus}New Exploration</button>
          <span class="filt-wrap"><button class="icon-btn filt-btn" id="expFiltBtn" title="Filter" style="${activeFilters?'border-color:var(--rb)':''}" onclick="toggleExpFilter(event)">${I.filter}</button></span>
        </div>
      </div>
      <div class="tbl-wrap"><table class="rt exp-tbl">
        <thead><tr><th><span class="sortable">Name ${I.sort}</span></th><th><span class="sortable">Keywords ${I.sort}</span></th><th><span class="sortable">Jurisdiction ${I.sort}</span></th><th>Corpus</th><th>Description</th><th class="col-act">Actions</th></tr></thead>
        <tbody>${ list.length? list.map((e,i)=>`<tr class="row" onclick="openExp(${i})" style="cursor:pointer">
          <td><span class="ex-name">${esc(e.name)}</span></td>
          <td class="ex-kw">${esc(e.kw)}</td>
          <td class="ex-jur">${esc(e.jur)}</td>
          <td><span class="badge-type">${esc(e.corpus)}</span></td>
          <td class="ex-desc">${esc(e.desc)}</td>
          <td class="col-act"><button class="kebab" onclick="event.stopPropagation();toast('More actions')">${I.kebab}</button></td>
        </tr>`).join('') : `<tr><td colspan="6"><div class="empty">${I.empty}<h3>No explorations match your filter</h3><p>Clear the Corpus / Keyword filters to see all saved explorations.</p></div></td></tr>` }</tbody>
      </table></div>`;
  }
  window.openExp=(i)=>{ const list=expFiltered(); S.expTitle=list[i].name; S.resultMode='table'; S.view='chapter'; S.filter='all'; S.fromSearch=false; go('results'); };

  // explorations filter panel (Corpuses / Keywords)
  window.toggleExpFilter=(e)=>{
    e.stopPropagation();
    let p=document.getElementById('expFiltPanel');
    if(p){ p.remove(); return; }
    const wrap=e.currentTarget.closest('.filt-wrap');
    p=document.createElement('div'); p.id='expFiltPanel'; p.className='filt-panel show';
    const corpuses=[...new Set(EXPLORATIONS.map(x=>x.corpus))];
    const kws=[...new Set(EXPLORATIONS.flatMap(x=>x.kw.split(',').map(s=>s.trim())))].slice(0,10);
    p.innerHTML=`
      <div class="filt-tabs"><button data-t="corpus" class="active">Corpuses</button><button data-t="kw">Keywords</button></div>
      <div class="filt-body" id="filtBody"></div>
      <div class="filt-foot"><button class="btn btn-primary" onclick="applyExpFilter()">Apply Filter</button></div>`;
    wrap.appendChild(p);
    p.addEventListener('click',ev=>ev.stopPropagation());
    function paint(tab){
      const b=p.querySelector('#filtBody');
      if(tab==='corpus'){ b.innerHTML=`<div class="fb-h">Filter by Corpus</div>`+corpuses.map(c=>`<label class="filt-opt"><span class="cbx ${S.expFilterCorpus.has(c)?'on':''}" data-c="${esc(c)}">${I.check}</span>${esc(c)}</label>`).join(''); }
      else { b.innerHTML=`<div class="fb-h">Filter by Keyword</div>`+kws.map(k=>`<label class="filt-opt"><span class="cbx ${S.expFilterKw.has(k)?'on':''}" data-k="${esc(k)}">${I.check}</span>${esc(k)}</label>`).join(''); }
      b.querySelectorAll('.cbx').forEach(cb=>cb.onclick=()=>{
        if(cb.dataset.c!=null){ const c=cb.dataset.c; S.expFilterCorpus.has(c)?S.expFilterCorpus.delete(c):S.expFilterCorpus.add(c); }
        else { const k=cb.dataset.k; S.expFilterKw.has(k)?S.expFilterKw.delete(k):S.expFilterKw.add(k); }
        cb.classList.toggle('on');
      });
    }
    paint('corpus');
    p.querySelectorAll('.filt-tabs button').forEach(b=>b.onclick=()=>{ p.querySelectorAll('.filt-tabs button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); paint(b.dataset.t); });
  };
  window.applyExpFilter=()=>{ const p=document.getElementById('expFiltPanel'); if(p)p.remove(); renderExplorations(); toast('Filter applied'); };

  // ════════════════════════ SEARCH RESULTS — Filters drawer (Task 6) ════════════════════════
  window.openResultFilter=()=>{
    if(document.getElementById('rfDrawer')) return;
    const back=document.createElement('div'); back.className='rf-backdrop'; back.id='rfBackdrop';
    back.onclick=closeResultFilter;
    const d=document.createElement('aside'); d.className='rf-drawer'; d.id='rfDrawer';
    d.innerHTML=`
      <div class="rf-head">
        <span class="rf-title">Filters</span>
        <button class="rf-reset" onclick="resetResultFilter()">Reset Filter</button>
        <button class="rf-close" onclick="closeResultFilter()" title="Close">${I.x}</button>
      </div>
      <div class="rf-tabs">
        <button data-t="corpus" class="${S.resFiltTab==='corpus'?'active':''}">Corpuses</button>
        <button data-t="kw" class="${S.resFiltTab==='kw'?'active':''}">Keywords</button>
      </div>
      <div class="rf-body" id="rfBody"></div>
      <div class="rf-foot"><button class="btn btn-primary rf-apply" onclick="applyResultFilter()">Apply filter</button></div>`;
    document.body.appendChild(back);
    document.body.appendChild(d);
    requestAnimationFrame(()=>{ back.classList.add('show'); d.classList.add('show'); });
    paintResFilter();
    d.querySelectorAll('.rf-tabs button').forEach(b=>b.onclick=()=>{ S.resFiltTab=b.dataset.t;
      d.querySelectorAll('.rf-tabs button').forEach(x=>x.classList.toggle('active',x.dataset.t===S.resFiltTab));
      paintResFilter(); });
  };
  function paintResFilter(){
    const b=document.getElementById('rfBody'); if(!b) return;
    if(S.resFiltTab==='corpus'){
      b.innerHTML=`<div class="rf-sub"><span>Filter by Corpuses</span><a class="rf-edit" onclick="toast('Edit corpus list')">Edit ${I.edit}</a></div>`+
        FILT_CORPUS.map(g=>`<div class="rf-region">${esc(g.region)}</div>
          <div class="rf-pills">${g.items.map(it=>`<button class="rf-pill ${S.resFilterCorpus.has(it)?'on':''}" data-c="${esc(it)}">${esc(it)}</button>`).join('')}</div>`).join('');
    } else {
      b.innerHTML=`<div class="rf-sub"><span>Filter by Keywords</span></div>
        <div class="rf-pills rf-pills-kw">${FILT_KW.map(k=>`<button class="rf-pill ${S.resFilterKw.has(k)?'on':''}" data-k="${esc(k)}">${esc(k)}</button>`).join('')}</div>`;
    }
    b.querySelectorAll('.rf-pill').forEach(p=>p.onclick=()=>{
      if(p.dataset.c!=null){ const c=p.dataset.c; S.resFilterCorpus.has(c)?S.resFilterCorpus.delete(c):S.resFilterCorpus.add(c); }
      else { const k=p.dataset.k; S.resFilterKw.has(k)?S.resFilterKw.delete(k):S.resFilterKw.add(k); }
      p.classList.toggle('on');
    });
  }
  window.closeResultFilter=()=>{
    const d=document.getElementById('rfDrawer'), back=document.getElementById('rfBackdrop');
    if(d){ d.classList.remove('show'); setTimeout(()=>d.remove(),260); }
    if(back){ back.classList.remove('show'); setTimeout(()=>back.remove(),260); }
  };
  window.resetResultFilter=()=>{ S.resFilterCorpus.clear(); S.resFilterKw.clear(); paintResFilter(); };
  window.applyResultFilter=()=>{
    const n=S.resFilterCorpus.size+S.resFilterKw.size;
    closeResultFilter();
    renderResults();
    toast(n? `Filter applied · ${n} active`:'Filter cleared');
  };

  // ════════════════════════ VERSION DIFFERENCE PAGE (Task 11) ════════════════════════
  function renderRegDiff(){
    const d=REGDOC, compared=S.diffView==='compared';
    const crumbs=d.crumb.map((c,i)=>{
      const root=c.root?`<span class="rg-root">Root</span>`:'';
      const dd=c.dd?`<span class="rg-ca" onclick="openCrumbDD(event)">${I.caretDown}</span>`:'';
      const click=(!c.cur&&c.go)?`onclick="crumbGo('${c.go}')"`:'';
      return `<span class="rg-crumb ${c.cur?'cur':''} ${(!c.cur&&c.go)?'link':''}" ${click}>${root}${esc(c.t)}${dd}</span>`;
    }).join('<span class="rg-sep">/</span>');

    inner.innerHTML=`
      <div class="rg-breadcrumb">${crumbs}</div>
      <div class="rg-card">
        <div class="rg-head">
          <div class="rg-title">${esc(d.title)}</div>
          <div class="rg-page"><button onclick="diffPage(-1)" title="Previous">${I.back}</button><span>${S.diffPage}/18</span><button onclick="diffPage(1)" title="Next">${I.chev}</button></div>
        </div>
        <div class="rg-controls">
          <div class="vtab rg-vtab">
            <button class="${compared?'active':''}" onclick="setDiffView('compared')">Compared View</button>
            <button class="${!compared?'active':''}" onclick="setDiffView('current')">Current View</button>
          </div>
          <div class="rg-right">
            ${compared?`<span class="ver-cmp">Current Version <span class="vs">vs</span> <button class="ver-btn" onclick="openVerDD(event)">${esc(S.diffVersion)}${I.caretDown}</button></span>
              <span class="df-pill df-add-pill">${d.additions} Additions</span>
              <span class="df-pill df-del-pill">${d.deletions} Deletions</span>`:''}
            <span class="dcmp"><span class="dcmp-lbl">Decompose</span><button class="switch ${S.decompose?'on':''}" onclick="toggleDecompose()" title="Toggle decompose"><span class="knob"></span></button></span>
          </div>
        </div>
        <div class="rg-body ${S.decompose?'decomp':''}">
          ${d.paras.map((p,pi)=>regPara(p,pi,compared)).join('')}
        </div>
      </div>
      ${S.decompose?`<div class="rg-actionbar">
        <button class="rg-ab-btn" onclick="toast('Copied to clipboard')">${I.copy}Copy to clipboard</button>
        <button class="rg-ab-btn" onclick="toast('Comment added')">${I.comment}Add Comment</button>
        <button class="rg-ab-btn" onclick="toast('Risk added')">${I.bang}Add Risk</button>
      </div>`:''}`;
  }
  function regPara(p,pi,compared){
    let html='';
    p.segs.forEach(([t,kind])=>{
      if(kind==='del'){ if(compared) html+=`<span class="df-del">${esc(t)}</span>`; }
      else if(kind==='add'){ html+= compared?`<mark class="df-add">${esc(t)}</mark>`:esc(t); }
      else html+=esc(t);
    });
    const tag=`<div class="rg-tagcol"><span class="rg-tag">${esc(p.tag)}</span></div>`;
    const tools=`<div class="rg-tools"><button onclick="event.stopPropagation();toast('Outdented paragraph')" title="Outdent">${I.outdent}</button><button onclick="event.stopPropagation();toast('Indented paragraph')" title="Indent">${I.indent}</button><button onclick="event.stopPropagation();toast('Merged paragraph')" title="Merge">${I.merge}</button></div>`;
    const cls=`rg-para${p.block?' df-block':''}${S.diffSel===pi?' on':''}`;
    return `<div class="rg-prow">${tag}<div class="${cls}" ${S.decompose?`onclick="selPara(${pi})"`:''}>${S.decompose?tools:''}<p>${html}</p></div></div>`;
  }
  window.setDiffView=(v)=>{ S.diffView=v; S.diffSel=null; renderRegDiff(); };
  window.toggleDecompose=()=>{ S.decompose=!S.decompose; S.diffSel=null; renderRegDiff(); };
  window.diffPage=(dir)=>{ S.diffPage=Math.min(18,Math.max(1,S.diffPage+dir)); S.diffSel=null; renderRegDiff(); };
  window.selPara=(pi)=>{ S.diffSel = S.diffSel===pi?null:pi; document.querySelectorAll('.rg-para').forEach((el,i)=>el.classList.toggle('on', i===S.diffSel)); };
  window.openVerDD=(e)=>{ e.stopPropagation(); closeMenus();
    const r=e.currentTarget.getBoundingClientRect();
    const m=document.createElement('div'); m.className='menu vermenu show'; m.style.minWidth='148px';
    m.style.left=(r.left+window.scrollX)+'px'; m.style.top=(r.bottom+window.scrollY+6)+'px';
    m.innerHTML=['Version 3.5','Version 3.6','Version 3.7','Version 3.8'].map(v=>`<button class="${v===S.diffVersion?'sel':''}" data-v="${v}">${v}</button>`).join('');
    document.body.appendChild(m);
    m.querySelectorAll('button').forEach(b=>b.onclick=()=>{ S.diffVersion=b.dataset.v; closeMenus(); renderRegDiff(); });
  };
  window.openCrumbDD=(e)=>{ e.stopPropagation(); closeMenus();
    const r=e.currentTarget.getBoundingClientRect();
    const m=document.createElement('div'); m.className='menu vermenu show'; m.style.minWidth='178px';
    m.style.left=(r.left+window.scrollX-120)+'px'; m.style.top=(r.bottom+window.scrollY+8)+'px';
    m.innerHTML=REGDOC.ddOpts.map(o=>`<button class="${o===S.crumbSel?'sel':''}" data-o="${esc(o)}">${esc(o)}</button>`).join('');
    document.body.appendChild(m);
    m.querySelectorAll('button').forEach(b=>b.onclick=()=>{ S.crumbSel=b.dataset.o; closeMenus(); toast('Switched to “'+b.dataset.o+'”'); });
  };
  window.crumbGo=(screen)=>{
    if(screen==='results'){ S.expTitle='Civil Money Penalties'; S.resultMode='table'; S.view='chapter'; S.filter='all'; S.fromSearch=false; }
    go(screen);
  };

  // ════════════════════════ REGULATIONS HIERARCHY ════════════════════════
  function renderRegulations(){
    inner.innerHTML = header('Regulations') + `
      <div class="res-bar">
        <span class="res-count">Grouped regulatory inventory across all jurisdictions</span>
        <div class="res-actions">
          <span class="reg-updated">Last updated on<br>08 May 2020</span>
          <button class="icon-btn" onclick="toast('Refreshing…')">${I.refresh}</button>
          <select class="select-sm"><option>Group by Location</option><option>Group by Reg Area</option><option>Group by Risk</option></select>
          <button class="icon-btn filt-btn" title="Filter">${I.filter}</button>
        </div>
      </div>
      <div class="acc">${REGIONS.map((rg,i)=>regionHtml(rg,i)).join('')}</div>`;
  }
  function regionHtml(rg,i){
    return `<div class="acc-group ${rg.open?'open':''}" data-r="${i}">
      <div class="acc-head" onclick="toggleRegion(${i})"><span class="car">${I.caret}</span>${esc(rg.name)}</div>
      <div class="acc-body">${rg.states.length? rg.states.map((s,si)=>stateHtml(s,i,si)).join('') : `<div style="padding:16px 30px;color:#9aa2ae;font-size:12px">No jurisdictions configured for this region.</div>`}</div>
    </div>`;
  }
  function stateHtml(s,ri,si){
    const badges=`<div class="state-badges">
      ${s.docs?`<span class="rbadge rb-doc">${s.docs} Documents</span>`:''}
      ${s.risks?`<span class="rbadge rb-risk">${s.risks} Risk${s.risks>1?'s':''}</span>`:''}
      <span class="rbadge rb-ctrl">${s.ctrls} Control${s.ctrls!==1?'s':''}</span>
    </div>`;
    return `<div class="state ${s._open?'open':''}" data-s="${ri}-${si}">
      <div class="state-head" onclick="toggleState(${ri},${si})"><span class="car">${I.caret}</span>${esc(s.name)}${badges}</div>
      <div class="state-body">${s.regs.length? s.regs.map(regRowHtml).join('') : `<div class="reg-row" style="color:#9aa2ae;padding-left:50px">No detailed regulations loaded for ${esc(s.name)}.</div>`}</div>
    </div>`;
  }
  function regRowHtml(r){
    const rb=`${r.risks?`<span class="rbadge rb-risk">${r.risks} Risk${r.risks>1?'s':''}</span>`:''}${r.ctrls?`<span class="rbadge rb-ctrl">${r.ctrls} Control${r.ctrls>1?'s':''}</span>`:''}`;
    const items=r.items.map(it=>`<div class="nested ${it.type}"><span class="nk">${it.k}</span><span>${esc(it.t)}</span></div>`).join('');
    return `<div class="reg-row"><span class="rr-no">${esc(r.no)}</span><span class="rr-txt">${esc(r.txt)}${rb?`<span class="rr-badges">${rb}</span>`:''}</span></div>${items}`;
  }
  window.toggleRegion=(i)=>{ REGIONS[i].open=!REGIONS[i].open; const el=document.querySelector('.acc-group[data-r="'+i+'"]'); if(el)el.classList.toggle('open'); };
  window.toggleState=(ri,si)=>{ const s=REGIONS[ri].states[si]; s._open=!s._open; const el=document.querySelector('.state[data-s="'+ri+'-'+si+'"]'); if(el)el.classList.toggle('open'); };

  // ════════════════════════ NAV PAGES ════════════════════════
  function renderRegAreas(){
    const areas=[
      {ic:I.lend,name:'Consumer Lending',desc:'Truth in Lending, mortgage origination and servicing, ability-to-repay.',regs:42,risks:9},
      {ic:I.shield,name:'BSA / AML',desc:'Customer due diligence, beneficial ownership, SAR and CTR reporting.',regs:31,risks:14},
      {ic:I.scale,name:'Fair Lending',desc:'ECOA, Fair Housing Act and HMDA fair-access requirements.',regs:18,risks:5},
      {ic:I.card,name:'Payments & EFT',desc:'Regulation E, remittance transfers and same-day ACH rules.',regs:24,risks:6},
      {ic:I.lock,name:'Data Privacy & Security',desc:'GLBA Safeguards, CCPA and state breach-notification statutes.',regs:27,risks:11},
      {ic:I.chart,name:'Capital & Liquidity',desc:'Risk-based capital, leverage ratios and liquidity coverage.',regs:16,risks:4},
    ];
    inner.innerHTML = header('Reg Areas') + `
      <div class="res-bar"><span class="res-count">6 regulatory areas mapped to your business lines</span></div>
      <div class="area-grid">${areas.map(a=>`<div class="area-card" onclick="openSearch('${esc(a.name)}')">
        <div class="ac-ic">${a.ic}</div><h4>${esc(a.name)}</h4><p>${esc(a.desc)}</p>
        <div class="ac-meta"><span><b>${a.regs}</b> Regulations</span><span><b>${a.risks}</b> Risks</span></div></div>`).join('')}</div>`;
  }

  function renderRisks(){
    const rows=[
      ['Inaccurate APR disclosure','12 CFR 1026.18','High','Open'],
      ['Missed rescission window','12 CFR 1026.23','High','In Progress'],
      ['Late SAR filing','31 CFR 1010.320','High','Open'],
      ['Beneficial ownership not collected','31 CFR 1010.230','Medium','In Progress'],
      ['Cyber incident reporting delay','23 NYCRR 500.17','Medium','Mitigated'],
      ['Escrow analysis errors','12 CFR 1024.17','Low','Mitigated'],
      ['Adverse-action notice omitted','15 USC 1681m','Medium','Open'],
    ];
    const sev=s=>`<span class="sev sev-${s==='High'?'high':s==='Medium'?'med':'low'}">${s}</span>`;
    const st=s=>`<span class="pill-status ${s==='Open'?'ps-open':s==='In Progress'?'ps-prog':s==='Mitigated'?'ps-done':'ps-rev'}">${s}</span>`;
    inner.innerHTML = header('Risks') + `
      <div class="res-bar"><span class="res-count"><b>${rows.length} Risks</b> across the regulatory inventory</span></div>
      <div class="tbl-wrap"><table class="rt"><thead><tr><th>Risk</th><th class="col-no">Linked Regulation</th><th class="col-type">Severity</th><th>Status</th><th class="col-act">Actions</th></tr></thead>
      <tbody>${rows.map(r=>`<tr class="row"><td><span class="ttl">${esc(r[0])}</span></td><td class="col-no"><span class="docno" onclick="openDoc('${esc(r[1])}')">${esc(r[1])}</span></td><td class="col-type">${sev(r[2])}</td><td>${st(r[3])}</td><td class="col-act"><button class="kebab" onclick="toast('More actions')">${I.kebab}</button></td></tr>`).join('')}</tbody></table></div>`;
  }

  function renderControls(){
    const rows=[
      ['Automated APR validation','Preventive','Implemented','Compliance Eng'],
      ['Pre-funding disclosure checklist','Detective','Implemented','Lending Ops'],
      ['Beneficial-ownership workflow','Preventive','Implemented','BSA Team'],
      ['SAR filing monitor','Detective','Non Implemented','BSA Team'],
      ['72-hour incident router','Preventive','Implemented','InfoSec'],
      ['Escrow analysis reconciliation','Detective','Non Implemented','Servicing'],
      ['Adverse-action auto-notice','Corrective','Implemented','Credit Risk'],
    ];
    const st=s=>`<span class="pill-status ${s==='Implemented'?'ps-done':'ps-open'}">${s}</span>`;
    inner.innerHTML = header('Controls') + `
      <div class="res-bar"><span class="res-count"><b>14 Controls</b> · 5 implemented · 7 non-implemented · 2 changed</span></div>
      <div class="tbl-wrap"><table class="rt"><thead><tr><th>Control</th><th class="col-type">Type</th><th>Status</th><th>Owner</th><th class="col-act">Actions</th></tr></thead>
      <tbody>${rows.map(r=>`<tr class="row"><td><span class="ttl">${esc(r[0])}</span></td><td class="col-type"><span class="badge-type">${esc(r[1])}</span></td><td>${st(r[2])}</td><td style="color:#5b6675">${esc(r[3])}</td><td class="col-act"><button class="kebab" onclick="toast('More actions')">${I.kebab}</button></td></tr>`).join('')}</tbody></table></div>`;
  }

  function renderTasks(){
    const rows=[
      ['Review Reg Z disclosure templates','12 CFR 1026.18','Maria Chen','Overdue','ps-open'],
      ['Update CDD onboarding script','31 CFR 1010.230','James Okoro','Due Today','ps-prog'],
      ['Validate escrow analysis logic','12 CFR 1024.17','Priya Nair','Due in 3 days','ps-rev'],
      ['Confirm 72-hour incident routing','23 NYCRR 500.17','Sam Lentz','Due in 5 days','ps-rev'],
      ['Close adverse-action gap','15 USC 1681m','Maria Chen','Overdue','ps-open'],
      ['Annual fair-lending review','12 CFR 1002','Dana White','Completed','ps-done'],
    ];
    inner.innerHTML = header('Tasks') + `
      <div class="res-bar"><span class="res-count"><b>26 Overdue</b> · 23 Due Today · 189 Due This Week</span></div>
      <div class="tbl-wrap"><table class="rt"><thead><tr><th>Task</th><th class="col-no">Regulation</th><th>Assignee</th><th>Due</th><th class="col-act">Actions</th></tr></thead>
      <tbody>${rows.map(r=>`<tr class="row"><td><span class="ttl">${esc(r[0])}</span></td><td class="col-no"><span class="docno" onclick="openDoc('${esc(r[1])}')">${esc(r[1])}</span></td><td style="color:#5b6675">${esc(r[2])}</td><td><span class="pill-status ${r[4]}">${esc(r[3])}</span></td><td class="col-act"><button class="kebab" onclick="toast('More actions')">${I.kebab}</button></td></tr>`).join('')}</tbody></table></div>`;
  }

  function renderCRun(){
    const runs=[
      ['Q2 2020 Consumer Lending Run','Completed','98%','12 May 2020','ps-done'],
      ['BSA/AML Quarterly Run','In Progress','61%','In progress','ps-prog'],
      ['NY DFS Cybersecurity Attestation','Scheduled','—','01 Jun 2020','ps-rev'],
      ['Fair Lending Annual Run','Completed','100%','28 Feb 2020','ps-done'],
    ];
    inner.innerHTML = header('Compliance Run') + `
      <div class="kpi-row">
        <div class="kpi"><div class="kn">4</div><div class="kl">Active Runs</div></div>
        <div class="kpi"><div class="kn">92%</div><div class="kl">Avg. Completion</div><div class="kt up">${I.up}6% vs last quarter</div></div>
        <div class="kpi"><div class="kn">7</div><div class="kl">Open Findings</div><div class="kt down">${I.down}3 since last run</div></div>
        <div class="kpi"><div class="kn">14</div><div class="kl">Controls Tested</div></div>
      </div>
      <div class="tbl-wrap"><table class="rt"><thead><tr><th>Run</th><th>Status</th><th class="col-type">Completion</th><th>Date</th><th class="col-act">Actions</th></tr></thead>
      <tbody>${runs.map(r=>`<tr class="row"><td><span class="ttl">${esc(r[0])}</span></td><td><span class="pill-status ${r[4]}">${esc(r[1])}</span></td><td class="col-type" style="font-weight:700;color:#1f2733">${esc(r[2])}</td><td style="color:#5b6675">${esc(r[3])}</td><td class="col-act"><button class="kebab" onclick="toast('Open run')">${I.play}</button></td></tr>`).join('')}</tbody></table></div>`;
  }

  function renderCDash(){
    const areas=[['Consumer Lending',94],['BSA / AML',76],['Fair Lending',99],['Payments & EFT',88],['Data Privacy',71],['Capital & Liquidity',96]];
    inner.innerHTML = header('Compliance Dashboard') + `
      <div class="kpi-row">
        <div class="kpi"><div class="kn">87%</div><div class="kl">Overall Compliance</div><div class="kt up">${I.up}4% this month</div></div>
        <div class="kpi"><div class="kn">26</div><div class="kl">Overdue Tasks</div><div class="kt down">${I.down}needs attention</div></div>
        <div class="kpi"><div class="kn">7</div><div class="kl">Open Risks</div></div>
        <div class="kpi"><div class="kn">12 / 14</div><div class="kl">Controls Implemented</div><div class="kt up">${I.up}2 this week</div></div>
      </div>
      <div class="panel" style="padding:20px"><div class="panel-head"><span class="ph-t">Compliance by Regulatory Area</span><span class="ph-x">Live</span></div>
        ${areas.map(a=>`<div style="display:flex;align-items:center;gap:14px;margin:11px 0">
          <span style="flex:0 0 170px;font-size:12.5px;font-weight:600;color:#3d434d">${esc(a[0])}</span>
          <span style="flex:1;height:9px;border-radius:6px;background:#eef0f3;position:relative;overflow:hidden"><span style="position:absolute;left:0;top:0;bottom:0;width:${a[1]}%;background:${a[1]>=90?'var(--green)':a[1]>=80?'var(--rb)':'#f0a02a'};border-radius:6px"></span></span>
          <span style="flex:0 0 40px;text-align:right;font-size:12.5px;font-weight:700;color:#1f2733">${a[1]}%</span>
        </div>`).join('')}
      </div>`;
  }

  // ───────── boot ─────────
  S.expTitle='7 CFR 1786.151';
  go('dashboard');
})();
