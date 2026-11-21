/* South Pole — Kiraboos hub. Layout and visual system copied from North Pole.
   Runs entirely on example data in data.js. No backend, no tokens, no real PII. */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const f = n => '$' + Math.round(n).toLocaleString();
const f2 = n => '$' + Number(n).toLocaleString(undefined, {minimumFractionDigits: n % 1 ? 2 : 2, maximumFractionDigits: 2});
const fmt = n => (+n).toLocaleString();
const D = window.SPDATA;
const I = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  ads:  '<path d="M4 10v4h3l6 4V6L7 10zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
  cust: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6L12 16.8 6.6 19.6l1.1-6L3.2 9.4l6.1-.8z"/>',
  sales:'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  inv:  '<path d="M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10"/>'
};
const TABS = [['home','Home'],['ads','Meta'],['cust','Customers'],['sales','Sales'],['inv','Inventory']];
const STORE_OPTS = [['all','All'],['stp','St. Peters'],['ev','Ellisville']];
const RANGE_OPTS = [['7d','7D'],['30d','30D'],['ytd','YTD'],['custom','Custom']];
const GEAR = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0 1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1-.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l.1-.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';

let cur = 'home', store = 'all', range = '30d', cq = '', cfilt = 'all', icat = 'all';
let customFrom = '2026-10-01', customTo = '2026-10-24';
let sub = null; // 'staff' | 'tasks' | null

function nav() {
  $('#t').innerHTML = TABS.map(([k,l]) =>
    `<button class="${k===cur && !sub ? 'on' : ''}" onclick="go('${k}')" aria-label="${l}"><svg viewBox="0 0 24 24">${I[k]}</svg>${l}</button>`
  ).join('');
}
function go(k) {
  cur = k; sub = null; closeSheet(); closeSettings(true); nav(); render();
  const sc = $('#v'); if (sc) sc.scrollTop = 0;
  try { history.replaceState(null, '', '#' + k); } catch (e) {}
}
function setStore(k) { store = k; render(); }
function setRange(k) {
  if (k === 'custom') { range = 'custom'; render(); openCustom(); return; }
  range = k; render();
}
function storeName(id) { return (D.stores[id] || D.stores.all).name; }
function adsRange() {
  if (range === 'custom') return D.ads[store]['30d']; // example snapshot; custom is a UI only until live data exists
  return D.ads[store][range] || D.ads[store]['30d'];
}
function rangeLabel() {
  if (range === '7d') return '7 days';
  if (range === 'ytd') return 'Year to date';
  if (range === 'custom') return fmtDate(customFrom) + ' – ' + fmtDate(customTo);
  return '30 days';
}
function fmtDate(iso) {
  if (!iso) return '—';
  const [y,m,d] = iso.split('-').map(Number);
  return new Date(y, m-1, d).toLocaleDateString(undefined, {month:'short', day:'numeric'});
}
function isoToShort(iso) {
  if (!iso) return '—';
  const [y,m,d] = iso.split('-').map(Number);
  return new Date(y, m-1, d).toLocaleDateString(undefined, {month:'short', day:'numeric'});
}
function dateSpan(a,b){
  if(!b) return isoToShort(a)+' · not redeemed';
  const A=isoToShort(a), B=isoToShort(b);
  const [am,ad]=A.split(' '), [bm,bd]=B.split(' ');
  if(am===bm) return am+' '+ad+'–'+bd;
  return A+' → '+B;
}
function delta(n, money) {
  if (n == null) return '';
  const up = n >= 0;
  const v = money ? f2(Math.abs(n)).replace(/\.00$/,'') : (Math.abs(n) + (Number.isInteger(n) || String(n).includes('.') && Math.abs(n) >= 1 ? (String(n).includes('.') ? '' : '') : '') + (money ? '' : '%'));
  // simplify: percentages already passed as numbers like 12 or 11.4; money like 0.40 or 0.22
  let label;
  if (money) label = f2(Math.abs(n)).replace(/\.00$/, '');
  else label = (Math.abs(n) % 1 ? Math.abs(n).toFixed(1) : Math.abs(n)) + '%';
  return `<span class="${up ? 'up' : 'dn'}">${up ? '▲' : '▼'} ${label}</span>`;
}
function dlt(n, money) { // alias used below
  return delta(n, money);
}

function seg(opts, on, fn) {
  return `<div class="seg" role="group">${opts.map(([k,l]) =>
    `<button type="button" class="seg-b${k===on?' on':''}" onclick="${fn}('${k}')">${l}</button>`
  ).join('')}</div>`;
}
function storeSeg() { return seg(STORE_OPTS, store, 'setStore'); }
function rangeSeg() { return seg(RANGE_OPTS, range, 'setRange'); }
function tile(lbl, big, sm, cls) {
  return `<div class="card"><div class="lbl">${lbl}</div><div class="big${cls?' '+cls:''}">${big}</div><div class="sm">${sm}</div></div>`;
}
function g2(a,b,c,d) { return `<div class="g2">${a}${b}${c||''}${d||''}</div>`; }
function exbadge() { return `<span class="pill pr exb">Example data</span>`; }
function gearBtn() {
  return `<button class="npgear" onclick="openSettings()" aria-label="Settings">${GEAR}</button>`;
}
function head(title, subline, extra) {
  return `<div class="hd">${gearBtn()}${exbadge()}
    ${extra||''}<h1>${title}</h1>
    <div class="sub">${subline}</div></div>`;
}
function sbox(val, ph, fn) {
  return `<div class="srch"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
    <input id="q" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
      placeholder="${esc(ph)}" aria-label="${esc(ph)}" value="${esc(val)}" oninput="${fn}(this.value)">
    <button type="button" aria-label="Clear search" onclick="var i=document.getElementById('q');i.value='';i.focus();${fn}('')">×</button></div>`;
}
function setQ(v) { cq = v; render(); const i=$('#q'); if(i){i.focus(); const n=i.value.length; i.setSelectionRange(n,n);} }
function setFilt(k) { cfilt = k; render(); }
function setCat(k) { icat = k; render(); }

function updatedLine() {
  const t = new Date(D.updated);
  const s = t.toLocaleString(undefined, {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});
  return `Example data · updated ${esc(s)}`;
}

/* ---------- screens ---------- */
function home() {
  const h = D.home[store];
  const fn = h.funnel;
  const fbar = (n,v,p,w,col) =>
    `<div style="margin:8px 0"><div class="row"><span style="font-size:14px">${n}</span><span class="sm"><b style="color:var(--np-text)">${v}</b> ${p||''}</span></div><div class="bar"><i style="width:${w}%;background:${col}"></i></div></div>`;
  const poolNote = h.pool <= 300
    ? (store==='all'
        ? `<span class="red">low</span> at ${esc(h.poolStore)}`
        : `codes left · <span class="red">low</span>`)
    : 'codes left';
  return head('Hi Nick 🍧', updatedLine(), `<div class="sub">Season ${D.season} so far</div>`)
    + storeSeg()
    + `<div class="card"><div class="lbl">Revenue ${D.season}</div><div class="big">${f(h.revenue)}</div>
        <span class="up">▲ ${h.vsPrev}% vs ${D.season-1} (example)</span>
        <div class="sm">${fmt(h.tickets)} tickets · ${f2(h.avg).replace(/\.00$/,'')} avg ticket</div></div>`
    + `<div class="card"><div class="lbl">Coupon funnel</div>
        ${fbar('Loaded', fmt(fn.loaded), '', 100, 'var(--np-steel)')}
        ${fbar('Claimed', fmt(fn.claimed), fn.claimedPct.toFixed(1)+'%', Math.max(8, fn.claimed/fn.loaded*100), 'var(--np-gold)')}
        ${fbar('Redeemed', fmt(fn.redeemed), fn.redeemPct + '% of claimed', Math.max(6, fn.redeemed/fn.loaded*100), 'var(--np-green)')}
      </div>`
    + g2(
        tile('Customers', fmt(h.customers), `${fmt(h.neu)} new · ${fmt(h.ret)} returning`),
        tile('Meta ROAS', h.roas.toFixed(1)+'x', `${f(h.spend)} spend · ${f2(h.cpr)} / redeem`, 'up'),
        tile('Code pool', fmt(h.pool), poolNote),
        tile('Low stock', h.low, h.lowItems, h.low ? 'red' : '')
      );
}

function ads() {
  const a = adsRange();
  const cprUp = a.cprDelta <= 0; // down cost is good
  const fun = D.funnels[store];
  const tests = D.tests.filter(t => store==='all' || t.store==='all' || t.store===store);
  return head('Meta ads', 'Coupon campaigns · Example data')
    + storeSeg() + rangeSeg()
    + g2(
        tile('Spend', f(a.spend), rangeLabel()),
        tile('ROAS', a.roas.toFixed(1)+'x', `${f(a.redeemerRev)} from redeemers`, 'up'),
        tile('Cost / redeem', f2(a.cpr), `<span class="${cprUp?'up':'dn'}">${a.cprDelta<=0?'▼':'▲'} ${f2(Math.abs(a.cprDelta))}</span>`),
        tile('Claim → redeem', a.rate+'%', `${fmt(a.redeemed)} of ${fmt(a.claimed)}`)
      )
    + `<div class="card"><div class="lbl">Funnel by store</div>`
    + fun.map(r => {
        const s = D.stores[r.id];
        return `<div class="li"><div class="av">${s.short}</div>
          <div style="flex:1">${esc(s.name)} <span class="sf">${esc(s.code)}</span>
            <div class="sm">${fmt(r.loaded)} loaded · ${fmt(r.claimed)} claimed · ${fmt(r.redeemed)} redeemed</div>
          </div><span class="up">${r.roas.toFixed(1)}x</span></div>`;
      }).join('')
    + `</div>`
    + `<div class="card"><div class="lbl">A/B splits</div>`
    + tests.map(t => {
        const pill = t.variant==='A' ? 'pb' : 'pw';
        const right = t.cpa == null ? `<span class="sm">${esc(t.note||'—')}</span>` : `<span class="sm">${f2(t.cpa)} CPA</span>`;
        const claim = t.claim == null ? '—' : (t.claim+'% claim');
        return `<div class="li"><span class="pill ${pill}">${t.variant}</span>
          <div style="flex:1">${esc(t.name)}<div class="sm">${fmt(t.shown)} shown · ${claim}</div></div>${right}</div>`;
      }).join('')
    + `</div>`;
}

function statusPill(st) {
  if (st==='repeat') return '<span class="pill pg">Repeat</span>';
  if (st==='redeemed') return '<span class="pill pb">Redeemed</span>';
  return '<span class="pill pw">Claimed</span>';
}
function cust() {
  const list = D.customers.filter(c => store==='all' || c.store===store);
  const neu = list.filter(c => c.status!=='repeat').length;
  const ret = list.filter(c => c.status==='repeat').length;
  // Scorecards stay at the example totals for the selected store (list is a sample).
  const totals = store==='all' ? {n:412, neu:318, ret:94, avg:2.7}
              : store==='stp' ? {n:248, neu:186, ret:62, avg:2.8}
              : {n:164, neu:132, ret:32, avg:2.5};
  const q = cq.trim().toLowerCase();
  let rows = list.filter(c => {
    if (cfilt==='redeemed' && !c.redeemed) return false;
    if (cfilt==='claimed' && c.redeemed) return false;
    if (cfilt==='repeat' && c.status!=='repeat') return false;
    if (q && !((c.name+' '+c.code).toLowerCase().includes(q))) return false;
    return true;
  });
  const chips = [['all','All'],['redeemed','Redeemed'],['claimed','Claimed only'],['repeat','Repeat']]
    .map(([k,l]) => `<button type="button" class="chip${cfilt===k?' on':''}" onclick="setFilt('${k}')">${l}</button>`).join('');
  const cards = rows.map(c => {
    const when = dateSpan(c.claimed, c.redeemed);
    return `<div class="li tap" onclick="openCust('${c.id}')">
      <div class="av">${esc(c.initials)}</div>
      <div style="flex:1;min-width:0">${esc(c.name)} ${statusPill(c.status)}
        <div class="sm">${esc(storeName(c.store))} · ${esc(c.codeFamily)} · ${when}</div>
      </div>
      <span class="sm">${c.spent ? f2(c.spent) : '$0'} ›</span>
    </div>`;
  }).join('');
  return head(`Customers<span class="cnum">${totals.n}</span>`, 'From Meta campaigns · Example data')
    + storeSeg()
    + g2(tile('New', fmt(totals.neu), Math.round(totals.neu/totals.n*100)+'% of customers'),
         tile('Returning', fmt(totals.ret), 'avg '+totals.avg+' visits'))
    + sbox(cq, 'Search name or code', 'setQ')
    + `<div class="chips">${chips}</div>`
    + `<div class="card">${cards || '<div class="sm" style="padding:12px 0">No customers match.</div>'}</div>`;
}

function openCust(id) {
  const c = D.customers.find(x => x.id===id); if (!c) return;
  const visits = (c.visitsList||[]).map(v =>
    `<div class="li"><span style="flex:1">${esc(v.date)}</span><span class="sm" style="flex:1.4">${esc(v.item)}</span><span>${f2(v.amt)}</span></div>`
  ).join('');
  const body = `<div class="bd" onclick="if(event.target===this)closeSheet()">
    <div class="pn" role="dialog" aria-label="${esc(c.name)}">
      <div class="grab"></div>
      <div class="row"><b style="font-size:22px">${esc(c.name)}</b><span class="pill pr">Example data</span></div>
      <div class="sub" style="margin-top:4px">${esc(storeName(c.store))} · Meta campaign · variant ${esc(c.variant)}</div>
      ${g2(tile('Visits', c.visits, c.claimed ? 'since '+isoToShort(c.claimed) : ''),
           tile('Spent', c.spent?f2(c.spent):'$0', c.avg?f2(c.avg)+' avg ticket':''))}
      <div class="card"><div class="lbl">Coupon</div>
        <div class="li"><span style="flex:1">Code</span><span class="sm" style="color:var(--np-blue)">${esc(c.code)}</span></div>
        <div class="li"><span style="flex:1">Claimed</span><span class="sm">${isoToShort(c.claimed)}</span></div>
        <div class="li"><span style="flex:1">Redeemed</span><span class="sm">${c.redeemed?isoToShort(c.redeemed):'—'}</span></div>
      </div>
      ${visits?`<div class="card"><div class="lbl">Visits</div>${visits}</div>`:''}
      <button type="button" class="btn2" onclick="toast('Square isn’t connected yet — this is example data.')">Open in Square</button>
    </div>
  </div>`;
  $('#sheet').innerHTML = body;
  requestAnimationFrame(() => $('#sheet .bd') && $('#sheet .bd').classList.add('in'));
}
function closeSheet() { const s=$('#sheet'); if (s) s.innerHTML=''; }

function sales() {
  const s = D.sales[store];
  return head('Sales', 'Square · Example data')
    + storeSeg()
    + g2(
        tile('Today', f(s.today), `${dlt(s.todayDelta)} · ${fmt(s.todayTickets)} tickets`),
        tile('This week', f(s.week), `${dlt(s.weekDelta)} · ${fmt(s.weekTickets)} tickets`),
        tile('This month', f(s.month), `${dlt(s.monthDelta)} · ${fmt(s.monthTickets)} tickets`),
        tile('Avg ticket', f2(s.avg), dlt(s.avgDelta, true))
      )
    + `<div class="card"><div class="lbl">Coupon vs organic</div>
        <div class="bar" style="height:10px;background:var(--np-steel)"><i style="width:${s.couponPct}%;background:var(--np-gold)"></i></div>
        <div class="row sm" style="margin-top:6px">
          <span class="warm">Coupon ${f(s.coupon)} · ${s.couponPct}%</span>
          <span>Organic ${f(s.organic)} · ${s.organicPct}%</span>
        </div>
      </div>`
    + `<div class="card"><div class="lbl">Top items</div>`
    + s.items.map(i => `<div class="li"><span style="flex:1">${esc(i.name)}</span><span class="sm">${fmt(i.qty)} · ${f(i.rev)}</span></div>`).join('')
    + `</div>`;
}

function qtyLabel(it) {
  const unit = it.unit ? ' ' + it.unit : '';
  return `${fmt(it.have)} / ${fmt(it.max)}${unit}`;
}
function inv() {
  const keys = store==='all' ? ['stp','ev'] : [store];
  let items = [];
  keys.forEach(k => (D.inventory[k]||[]).forEach(it => items.push({...it, store:k})));
  if (icat!=='all') items = items.filter(it => it.cat===icat);
  const low = items.filter(it => it.low);
  // Unique item count for the "tracked" tile: use example totals
  const tracked = store==='all' ? 42 : (store==='stp' ? 22 : 20);
  const lowN = store==='all' ? 4 : low.length;
  const chips = [['all','All'],['syrups','Syrups'],['ice','Ice'],['cups','Cups'],['toppings','Toppings']]
    .map(([k,l]) => `<button type="button" class="chip${icat===k?' on':''}" onclick="setCat('${k}')">${l}</button>`).join('');
  const groups = keys.map(k => {
    const list = items.filter(it => it.store===k);
    if (!list.length) return '';
    return `<div class="card"><div class="lbl">${esc(storeName(k))} stock</div>`
      + list.map(it => {
          const pct = Math.max(3, Math.round(it.have / it.max * 100));
          return `<div style="margin:9px 0"><div class="row"><span style="font-size:14px">${esc(it.name)}${it.low?" <span class='pill pr'>Low</span>":''}</span>
            <span class="sm rem">${qtyLabel(it)}</span></div>
            <div class="bar"><i style="width:${pct}%;background:${it.low?'var(--np-red)':'var(--np-green)'}"></i></div></div>`;
        }).join('')
      + `</div>`;
  }).join('');
  const reorder = items.filter(it => it.reorder);
  const rec = reorder.length
    ? `<div class="card"><div class="lbl">Reorder list</div>`
      + reorder.map(it => `<div class="li"><span style="flex:1">${esc(it.name)}${store==='all'?` <span class="sm">· ${esc(storeName(it.store))}</span>`:''}</span>
          <span class="sm">${esc(it.reorder.qty)} · ${f(it.reorder.cost)}</span></div>`).join('')
      + `</div>`
    : '';
  return head('Inventory', 'Example data')
    + storeSeg()
    + `<div class="chips">${chips}</div>`
    + g2(tile('Items', tracked, 'tracked'), tile('Low', lowN, '<span class="red">reorder</span>', 'red'))
    + groups + rec;
}

function staffView() {
  const list = D.staff.filter(p => store==='all' || p.store===store);
  return `<button class="cback" onclick="sub=null;render()">‹ Settings</button>
    <h1>Staff</h1>
    <div class="sub">Example roster · not connected to scheduling yet</div>
    ${storeSeg()}
    <div class="card">`
    + list.map(p => `<div class="li"><div class="av">${esc(p.name.split(' ').map(w=>w[0]).join('').slice(0,2))}</div>
        <div style="flex:1">${esc(p.name)}<div class="sm">${esc(p.role)} · ${esc(storeName(p.store))}</div></div>
        <span class="sm">${esc(p.shift)}</span></div>`).join('')
    + `</div>`;
}
function tasksView() {
  const list = D.tasks.filter(t => store==='all' || t.store==='all' || t.store===store);
  return `<button class="cback" onclick="sub=null;render()">‹ Settings</button>
    <h1>Tasks</h1>
    <div class="sub">Example list · nothing is live yet</div>
    <div class="card">`
    + list.map(t => `<div class="li"><div style="flex:1">${esc(t.title)}
        <div class="sm">${t.store==='all'?'Both stores':esc(storeName(t.store))} · ${esc(t.due)}</div></div>
        ${t.tone==='red'?'<span class="pill pr">Due</span>':t.tone==='gold'?'<span class="pill pw">Soon</span>':''}</div>`).join('')
    + `</div>`;
}

/* ---------- settings + custom range + toast ---------- */
function openSettings() {
  let n = document.getElementById('cnav');
  if (!n) {
    n = document.createElement('div'); n.id = 'cnav';
    n.innerHTML = `<div class="cnb" onclick="closeSettings()"></div>
      <aside>
        <div class="cnh">Settings</div>
        <button type="button" onclick="openSub('staff')"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c2.8 0 5 1.8 5 4.5"/></svg>Staff<span>›</span></button>
        <button type="button" onclick="openSub('tasks')"><svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg>Tasks<span>›</span></button>
        <div class="cns">About</div>
        <div class="npnm">South Pole is the Kiraboos hub, the sister app to North Pole. This build uses example data only — no live Square, Meta, or coupon sheets are connected yet.</div>
        <div class="cns">Home screen</div>
        <div class="npnm">In Safari, tap Share › Add to Home Screen. The icon is the snow globe with the little snowman.</div>
      </aside>`;
    document.body.appendChild(n);
  }
  requestAnimationFrame(() => n.classList.add('on'));
}
function closeSettings(instant) {
  const n = document.getElementById('cnav');
  if (n) n.classList.remove('on');
}
function openSub(k) { sub = k; closeSettings(); nav(); render(); const sc=$('#v'); if(sc) sc.scrollTop=0; }

function openCustom() {
  const body = `<div class="bd in" onclick="if(event.target===this)closeSheet()">
    <div class="pn" role="dialog" aria-label="Custom date range">
      <div class="grab"></div>
      <div class="row"><b style="font-size:20px">Custom range</b><span class="pill pr">Example data</span></div>
      <div class="sub">Dates only change the labels in this example build. Live numbers need a free data hookup later.</div>
      <div class="lbl">Start</div><input id="dfrom" type="date" value="${esc(customFrom)}">
      <div class="lbl">End</div><input id="dto" type="date" value="${esc(customTo)}">
      <button type="button" class="btn" onclick="applyCustom()">Apply</button>
    </div></div>`;
  $('#sheet').innerHTML = body;
}
function applyCustom() {
  const a = $('#dfrom') && $('#dfrom').value, b = $('#dto') && $('#dto').value;
  if (a) customFrom = a; if (b) customTo = b;
  if (customFrom && customTo && customFrom > customTo) { const t=customFrom; customFrom=customTo; customTo=t; }
  range = 'custom'; closeSheet(); render();
}

function toast(msg) {
  let t = document.getElementById('sptoast');
  if (!t) { t = document.createElement('div'); t.id='sptoast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toast._k); toast._k = setTimeout(() => t.classList.remove('on'), 2400);
}

function render() {
  nav();
  let html;
  if (sub==='staff') html = staffView();
  else if (sub==='tasks') html = tasksView();
  else if (cur==='home') html = home();
  else if (cur==='ads') html = ads();
  else if (cur==='cust') html = cust();
  else if (cur==='sales') html = sales();
  else if (cur==='inv') html = inv();
  else html = home();
  $('#v').innerHTML = html;
}

function boot() {
  const h = (location.hash||'').replace('#','');
  if (TABS.some(([k]) => k===h)) cur = h;
  nav(); render();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}
document.addEventListener('DOMContentLoaded', boot);
