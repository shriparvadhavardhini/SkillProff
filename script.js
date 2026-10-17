'use strict';
/* SkillProof prototype — vanilla JS. All data is sample/demo data kept in localStorage.
   Sections: 1 Data · 2 State · 3 Helpers · 4 i18n · 5 Auth · 6 Learner views · 7 Employer views · 8 Events · 9 Init */

/* ===== 1. DATA ===== */
const KEY = 'skillproof_demo_v1';
const STATUS = ['Applied', 'Under Review', 'Shortlisted', 'Completed'];
const STAGES = ['Challenge started', 'Evidence submitted', 'Assessment pending', 'Mentor review (simulated)', 'Verified / feedback'];
const ICON = { Electrical: '⚡', Plumbing: '🔧', Computer: '💻', 'Web Development': '🌐', 'Graphic Design': '🎨', 'Mobile Repair': '📱', Carpentry: '🪚', Tailoring: '🧵', Welding: '🔥' };
const CATS = Object.keys(ICON);

const mkC = (id, t, cat, lv, min, tools, steps, crit) =>
  ({ id, t, cat, lv, min, tools, steps, crit, pts: { Beginner: 50, Intermediate: 80, Advanced: 120 }[lv] });
const CH = [
  mkC('c1', 'Create a Responsive Personal Portfolio', 'Web Development', 'Beginner', 90, 'Laptop, code editor, browser',
    ['Build a basic portfolio using HTML and CSS.', 'Include an introduction, skills, and projects.', 'Make sure the page works on mobile screens.', 'Submit screenshots or a project link as evidence.'], ['Clean structure', 'Works on mobile', 'Readable design']),
  mkC('c2', 'Wire a Two-Way Switch Circuit', 'Electrical', 'Intermediate', 60, 'Practice board, switches, bulb, insulated tools',
    ['Switch off the supply. Wear insulated gloves.', 'Wire the circuit on the practice board.', 'Test the bulb from both switches.', 'Share a photo or video of it working.'], ['Correct wiring', 'Safety steps followed', 'Neat finishing']),
  mkC('c3', 'Fix a Leaking Tap Joint', 'Plumbing', 'Beginner', 45, 'Spanner, PTFE tape, washer',
    ['Close the water supply.', 'Remove the tap and replace the washer.', 'Wrap PTFE tape and refit.', 'Photo of the dry, fitted tap.'], ['No leakage', 'Correct tools', 'Clean work area']),
  mkC('c4', 'Set Up a New Computer', 'Computer', 'Beginner', 60, 'PC, OS installer, antivirus',
    ['Install the operating system.', 'Install updates and a browser.', 'Create a user account.', 'Share screenshots of the finished setup.'], ['Setup complete', 'Updates applied', 'Clear steps noted']),
  mkC('c5', 'Design a Local Shop Poster', 'Graphic Design', 'Beginner', 75, 'Free design tool, sample text',
    ['Pick a shop and a simple message.', 'Design an A4 poster with clear text.', 'Use at most three colours.', 'Upload the poster image.'], ['Readable text', 'Good layout', 'Fits the brief']),
  mkC('c6', 'Replace a Phone Screen (Practice Unit)', 'Mobile Repair', 'Intermediate', 60, 'Repair kit, practice phone',
    ['Power off and remove the old screen.', 'Fit the new screen carefully.', 'Test touch and display.', 'Share a video of the working phone.'], ['Phone works', 'Careful handling', 'Safety awareness']),
  mkC('c7', 'Build a Simple Wooden Stool', 'Carpentry', 'Intermediate', 180, 'Wood, saw, chisel, sandpaper',
    ['Measure and cut the pieces.', 'Join the legs and seat.', 'Sand all edges smooth.', 'Photos from front and side.'], ['Stable build', 'Smooth finish', 'Accurate cuts']),
  mkC('c8', 'Stitch a Cotton Blouse Sample', 'Tailoring', 'Advanced', 240, 'Fabric, machine, thread',
    ['Take measurements and cut the fabric.', 'Stitch the main seams.', 'Finish hems and neckline.', 'Photo of the finished piece.'], ['Even stitching', 'Right fit', 'Neat finishing']),
  mkC('c9', 'Weld a Straight Butt Joint', 'Welding', 'Advanced', 90, 'Welding set, plates, helmet, gloves',
    ['Wear full protective gear.', 'Tack the two plates.', 'Run a continuous weld bead.', 'Photo of the weld close-up.'], ['Even bead', 'Safety gear worn', 'Joint strength'])
];

const mkJ = (id, t, cat, loc, pay, unit, dur, type, lvl, emp) => ({ id, t, cat, loc, pay, unit, dur, type, lvl, emp });
const JOBS = [
  mkJ('j1', 'Website for a local bakery', 'Web Development', 'Coimbatore', 6000, 'per project', '2 weeks', 'Micro-job', 'Beginner', 'Annapoorna Sweets (demo)'),
  mkJ('j2', 'Computer installation assistant', 'Computer', 'Pollachi', 400, 'per day', '5 days', 'Part-time', 'Beginner', 'NetPoint Computers (demo)'),
  mkJ('j3', 'Electrical maintenance assistant', 'Electrical', 'Tiruppur', 12000, 'per month', '3 months', 'Apprenticeship', 'Intermediate', 'Sri Murugan Electricals (demo)'),
  mkJ('j4', 'Poster design for a tuition centre', 'Graphic Design', 'Madurai', 2500, 'per project', '3 days', 'Micro-job', 'Beginner', 'BrightPath Tuitions (demo)'),
  mkJ('j5', 'Mobile repair apprentice', 'Mobile Repair', 'Salem', 8000, 'per month', '6 months', 'Apprenticeship', 'Beginner', 'Cell Care Hub (demo)'),
  mkJ('j6', 'Tailoring assignments (school uniforms)', 'Tailoring', 'Erode', 9000, 'per month', '2 months', 'Part-time', 'Intermediate', 'Lakshmi Tailors (demo)'),
  mkJ('j7', 'Workshop assistant — welding', 'Welding', 'Coimbatore', 15000, 'per month', '6 months', 'Paid internship', 'Intermediate', 'Kovai Fabricators (demo)'),
  mkJ('j8', 'Part-time technical support', 'Computer', 'Chennai', 350, 'per hour', 'Ongoing', 'Part-time', 'Intermediate', 'HelpDesk Local (demo)'),
  mkJ('j9', 'Pipe fitting helper', 'Plumbing', 'Trichy', 700, 'per day', '10 days', 'Micro-job', 'Beginner', 'AquaFix Services (demo)')
];
const CANDS = [
  { id: 'k1', n: 'Ananya R.', loc: 'Coimbatore', sk: ['Web Development', 'Graphic Design'], done: 6, bio: 'Polytechnic student who builds small business websites.' },
  { id: 'k2', n: 'Karthik S.', loc: 'Tiruppur', sk: ['Electrical'], done: 4, bio: 'ITI electrician focused on safe wiring.' },
  { id: 'k3', n: 'Meena P.', loc: 'Madurai', sk: ['Tailoring'], done: 5, bio: 'Experienced in school uniform stitching.' },
  { id: 'k4', n: 'Imran K.', loc: 'Salem', sk: ['Mobile Repair', 'Computer'], done: 7, bio: 'Repairs phones and sets up PCs.' }
];

/* ===== 2. STATE ===== */
const def = () => ({ role: null, user: { name: 'Demo Learner', location: 'Coimbatore', bio: 'ITI-trained learner building practical skills.', interests: 'Web Development' }, ch: {}, apps: [], posted: [], short: [], act: [], lang: 'en' });
function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); return d && typeof d === 'object' ? { ...def(), ...d } : def(); }
  catch (e) { return def(); }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage full or blocked */ } }
let S = load();
let view = 'dash';
const F = { cat: 'All', q: '', jc: 'All', jl: 'All', jp: '0', jt: 'All', sort: 'new', cq: '', cl: '' };

/* ===== 3. HELPERS ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inr = n => '₹' + Number(n).toLocaleString('en-IN');
const allJobs = () => [...S.posted, ...JOBS];
const jobById = id => allJobs().find(j => j.id === id);
const chById = id => CH.find(c => c.id === id);
const verified = () => CH.filter(c => S.ch[c.id]?.s === 'verified');
const log = t => { S.act.unshift({ t, d: new Date().toLocaleDateString('en-IN') }); S.act = S.act.slice(0, 8); };
function toast(msg, type = 'ok') {
  const el = document.createElement('div'); el.className = 'toast ' + type; el.textContent = msg;
  $('#toasts').append(el); setTimeout(() => el.remove(), 3200);
}
const M = $('#modal');
function openM(html) { M.innerHTML = '<button class="x" data-close aria-label="Close">×</button>' + html; if (!M.open) M.showModal(); }
const closeM = () => M.open && M.close();
const bar = p => `<div class="bar-p" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></div>`;
const statusBadge = s => ({ verified: '<span class="badge ok">Verified</span>', pending: '<span class="badge warn">Pending Review</span>', improve: '<span class="badge bad">Needs Improvement</span>', started: '<span class="badge info">In progress</span>' }[s] || '');

/* ===== 4. i18n ===== */
const T = {
  en: { nav_how: 'How it works', nav_skills: 'Skills', nav_jobs: 'Opportunities', nav_impact: 'Impact', hero_h: 'Your Skills Deserve More Than a Certificate.', hero_p: 'Prove what you can do, build your work profile, and connect with real earning opportunities near you.', cta_learn: 'Start Proving Your Skills', cta_hire: 'Hire Skilled Talent', login: 'Log in', signup: 'Sign up', logout: 'Log out', dash: 'Dashboard', ch: 'Skill Challenges', jobs: 'Find Jobs', port: 'My Portfolio', apps: 'Applications', prof: 'Profile', set: 'Settings', welcome: 'Welcome', apply: 'Apply Now', start: 'Start Challenge', reset: 'Reset Demo' },
  ta: { nav_how: 'எப்படி செயல்படுகிறது', nav_skills: 'திறன்கள்', nav_jobs: 'வாய்ப்புகள்', nav_impact: 'தாக்கம்', hero_h: 'உங்கள் திறன்களுக்கு சான்றிதழை விட மதிப்பு உண்டு.', hero_p: 'உங்கள் திறமையை நிரூபியுங்கள், பணி சுயவிவரத்தை உருவாக்குங்கள், அருகிலுள்ள வருமான வாய்ப்புகளை பெறுங்கள்.', cta_learn: 'திறமையை நிரூபிக்கத் தொடங்குங்கள்', cta_hire: 'திறமையாளர்களை நியமிக்கவும்', login: 'உள்நுழை', signup: 'பதிவு செய்', logout: 'வெளியேறு', dash: 'முகப்பு', ch: 'திறன் சவால்கள்', jobs: 'வேலை தேடு', port: 'என் போர்ட்ஃபோலியோ', apps: 'விண்ணப்பங்கள்', prof: 'சுயவிவரம்', set: 'அமைப்புகள்', welcome: 'வணக்கம்', apply: 'இப்போது விண்ணப்பிக்கவும்', start: 'சவாலைத் தொடங்கு', reset: 'டெமோவை மீட்டமை' },
  hi: { nav_how: 'यह कैसे काम करता है', nav_skills: 'कौशल', nav_jobs: 'अवसर', nav_impact: 'प्रभाव', hero_h: 'आपके कौशल की कीमत सिर्फ़ एक प्रमाणपत्र से कहीं ज़्यादा है।', hero_p: 'अपनी क्षमता साबित करें, कार्य-प्रोफ़ाइल बनाएँ और अपने पास कमाई के असली अवसरों से जुड़ें।', cta_learn: 'अपना कौशल साबित करना शुरू करें', cta_hire: 'कुशल प्रतिभा को काम पर रखें', login: 'लॉग इन', signup: 'साइन अप', logout: 'लॉग आउट', dash: 'डैशबोर्ड', ch: 'कौशल चुनौतियाँ', jobs: 'काम खोजें', port: 'मेरा पोर्टफोलियो', apps: 'आवेदन', prof: 'प्रोफ़ाइल', set: 'सेटिंग्स', welcome: 'नमस्ते', apply: 'अभी आवेदन करें', start: 'चुनौती शुरू करें', reset: 'डेमो रीसेट करें' }
};
const tr = k => (T[S.lang] && T[S.lang][k]) || T.en[k] || k;
function applyLang() {
  document.documentElement.lang = S.lang; $('#lang').value = S.lang;
  $$('[data-i18n]').forEach(el => { el.textContent = tr(el.dataset.i18n); });
  drawAuthArea(); if (S.role) render();
}

/* ===== 5. LANDING + AUTH ===== */
function drawLanding() {
  const steps = [['Learn', 'Pick a practical skill.'], ['Practice', 'Do a hands-on challenge.'], ['Prove', 'Upload photo, video or link.'], ['Earn', 'Get verified and apply for work.']];
  $('#steps').innerHTML = steps.map((s, i) => `<div class="card step"><b>${i + 1}</b><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('');
  $('#catGrid').innerHTML = CATS.map(c => `<button class="card cat" data-cat="${c}"><span aria-hidden="true">${ICON[c]}</span>${c}</button>`).join('');
  $('#featGrid').innerHTML = JOBS.slice(0, 3).map(j => `<div class="card item"><span class="badge info">Sample listing</span><h3>${j.t}</h3><small>${j.loc} · ${j.dur}</small><span class="money">${inr(j.pay)} ${j.unit}</span><div class="row"><button class="btn ghost sm" data-job="${j.id}">View details</button></div></div>`).join('');
  $$('[data-count]').forEach(el => {
    const end = +el.dataset.count, t0 = performance.now();
    const tick = t => { const p = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(end * p).toLocaleString('en-IN') + '+'; if (p < 1) requestAnimationFrame(tick); };
    matchMedia('(prefers-reduced-motion: reduce)').matches ? (el.textContent = end.toLocaleString('en-IN') + '+') : requestAnimationFrame(tick);
  });
}
function drawAuthArea() {
  $('#authArea').innerHTML = S.role
    ? `<small>${esc(S.role === 'learner' ? S.user.name : 'Employer (demo)')}</small><button class="btn ghost sm" data-act="logout">${tr('logout')}</button>`
    : `<button class="btn ghost sm" data-auth="login">${tr('login')}</button><button class="btn primary sm" data-auth="register-learner">${tr('signup')}</button>`;
}
function authModal(mode) {
  const login = mode === 'login', emp = mode === 'register-employer';
  openM(`<h2>${login ? 'Log in' : 'Create your account'}</h2>
  <p class="note">Prototype only: this demo login is not secure. Passwords are never stored. Use the demo buttons to explore without any personal data.</p>
  <div class="row"><button class="btn green" data-auth="demo-learner">Learner demo</button><button class="btn ghost" data-auth="demo-employer">Employer demo</button></div>
  <form class="form" id="authForm" data-mode="${mode}" novalidate>
    ${login ? '' : `<fieldset class="seg" style="border:0;padding:0;margin:0"><label><input type="radio" name="role" value="learner" ${emp ? '' : 'checked'}> Learner</label><label><input type="radio" name="role" value="employer" ${emp ? 'checked' : ''}> Employer</label></fieldset>
    <label>Full name<input name="name" autocomplete="name"><span class="err" data-e="name"></span></label>
    <label>Phone (10 digits)<input name="phone" inputmode="numeric" autocomplete="tel"><span class="err" data-e="phone"></span></label>
    <label>Location<input name="location" placeholder="e.g. Coimbatore"><span class="err" data-e="location"></span></label>
    <label>Skill interest<select name="interest">${CATS.map(c => `<option>${c}</option>`).join('')}</select></label>`}
    <label>Email<input name="email" type="email" autocomplete="email"><span class="err" data-e="email"></span></label>
    <label>Password (min 6 characters)<span class="pw"><input name="password" type="password" autocomplete="current-password"><button type="button" class="btn ghost sm" data-pw aria-label="Show or hide password">Show</button></span><span class="err" data-e="password"></span></label>
    <button class="btn primary">${login ? 'Log in' : 'Create demo account'}</button>
    <small>${login ? 'New here?' : 'Have an account?'} <a href="#" data-auth="${login ? 'register-learner' : 'login'}">${login ? 'Sign up' : 'Log in'}</a></small>
  </form>`);
}
function submitAuth(form) {
  const f = Object.fromEntries(new FormData(form)), login = form.dataset.mode === 'login', e = {};
  if (!login) {
    if (!f.name || f.name.trim().length < 2) e.name = 'Enter your full name.';
    if (!/^[6-9]\d{9}$/.test(f.phone || '')) e.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (!f.location || !f.location.trim()) e.location = 'Enter your town or city.';
  }
  if (!/^\S+@\S+\.\S+$/.test(f.email || '')) e.email = 'Enter a valid email like name@example.com.';
  if (!f.password || f.password.length < 6) e.password = 'Password must be at least 6 characters.';
  $$('.err', form).forEach(x => { x.textContent = e[x.dataset.e] || ''; });
  if (Object.keys(e).length) return toast('Please fix the highlighted fields.', 'bad');
  // The password is checked here and then discarded; it is never saved.
  if (!login) S.user = { ...S.user, name: f.name.trim(), location: f.location.trim(), interests: f.interest };
  enter(f.role || 'learner');
}
function enter(role) {
  S.role = role; view = role === 'learner' ? 'dash' : 'ov'; save(); closeM();
  $('#landing').hidden = true; $('#app').hidden = false; drawAuthArea(); render(); scrollTo(0, 0);
  toast(role === 'learner' ? 'Learner demo ready. Try a challenge!' : 'Employer demo ready.');
}
function logout() { S.role = null; save(); $('#app').hidden = true; $('#landing').hidden = false; drawAuthArea(); scrollTo(0, 0); }

/* ===== 6. LEARNER VIEWS ===== */
const NAV = {
  learner: [['dash', 'dash'], ['ch', 'ch'], ['jobs', 'jobs'], ['port', 'port'], ['apps', 'apps'], ['prof', 'prof'], ['set', 'set']],
  employer: [['ov', null, 'Overview'], ['post', null, 'Post a Job'], ['cand', null, 'Candidates'], ['set', 'set']]
};
function render() {
  const items = NAV[S.role].map(([k, i, label]) => `<button data-go="${k}" ${k === view ? 'aria-current="page"' : ''}>${i ? tr(i) : label}</button>`).join('');
  $('#app').innerHTML = `<div class="shell"><nav class="side" aria-label="App">${items}</nav><section class="pane" id="pane">${(V[view] || V.dash)()}</section></div>`;
  const sl = $('[data-lang]'); if (sl) sl.value = S.lang;
  draw();
}
function profilePct() {
  const u = S.user; const n = [u.name, u.location, u.bio, u.interests].filter(Boolean).length;
  return Math.min(100, n * 15 + (Object.keys(S.ch).length ? 20 : 0) + (verified().length ? 20 : 0));
}
function chCard(c) {
  const s = S.ch[c.id]?.s;
  return `<article class="card item"><div>${ICON[c.cat]} <b>${c.cat}</b> ${statusBadge(s)}</div><h3>${c.t}</h3>
  <small>${c.lv} · ${c.min} min · +${c.pts} points</small><div class="row"><button class="btn primary sm" data-ch="${c.id}">${s ? 'Open' : tr('start')}</button></div></article>`;
}
function jobCard(j) {
  const a = S.apps.find(x => x.jobId === j.id);
  return `<article class="card item"><div><span class="badge info">${j.type}</span> <span class="badge">Sample listing</span></div><h3>${esc(j.t)}</h3>
  <small>${esc(j.emp)} · ${esc(j.loc)} · ${j.dur}</small><span class="money">${inr(j.pay)} ${j.unit}</span>
  <div class="row"><button class="btn ghost sm" data-job="${j.id}">Details</button>${a ? `<span class="badge ok">${a.status}</span>` : `<button class="btn primary sm" data-apply="${j.id}">${tr('apply')}</button>`}</div></article>`;
}
const V = {
  dash() {
    const u = S.user, sub = Object.values(S.ch).filter(c => c.s && c.s !== 'started').length;
    const earn = S.apps.filter(a => a.status === 'Completed').reduce((t, a) => t + (jobById(a.jobId)?.pay || 0), 0);
    const recC = CH.filter(c => !S.ch[c.id]).sort((a, b) => (b.cat === u.interests) - (a.cat === u.interests)).slice(0, 3);
    const recJ = allJobs().filter(j => !S.apps.some(a => a.jobId === j.id)).slice(0, 2);
    return `<h2>${tr('welcome')}, ${esc(u.name)} 👋</h2>
    <div class="kpis"><div class="card kpi"><small>Completed challenges</small><b>${sub}</b></div><div class="card kpi"><small>Verified skills</small><b>${verified().length}</b></div>
    <div class="card kpi"><small>Jobs applied</small><b>${S.apps.length}</b></div><div class="card kpi"><small>Sample earnings (demo)</small><b>${inr(earn)}</b></div></div>
    <div class="grid2"><div class="card"><small>Profile completion</small><b> ${profilePct()}%</b>${bar(profilePct())}</div>
    <div class="card"><small>Skill verification (${verified().length} of ${CATS.length})</small>${bar(Math.round(verified().length / CATS.length * 100))}</div></div>
    <div class="row"><button class="btn primary" data-go="ch">Continue Learning</button></div>
    <h3>Recommended challenges</h3><div class="list">${recC.map(chCard).join('') || '<p class="empty">You have started every challenge. Great work!</p>'}</div>
    <h3 style="margin-top:1.5rem">Recommended opportunities</h3><div class="list">${recJ.map(jobCard).join('')}</div>
    <h3 style="margin-top:1.5rem">Recent activity</h3><ul class="act">${S.act.map(a => `<li>${esc(a.t)} <small>· ${a.d}</small></li>`).join('') || '<li>No activity yet. Start a challenge to begin.</li>'}</ul>`;
  },
  ch() {
    return `<h2>${tr('ch')}</h2><div class="chips" role="group" aria-label="Filter by skill">${['All', ...CATS].map(c => `<button class="chip" data-fcat="${c}" aria-pressed="${F.cat === c}">${c}</button>`).join('')}</div><div class="list" id="chList"></div>`;
  },
  jobs() {
    const opt = (arr, id, k) => `<select data-f="${k}" aria-label="${id}"><option value="All">${id}: All</option>${arr.map(x => `<option ${F[k] === x ? 'selected' : ''}>${x}</option>`).join('')}</select>`;
    const locs = [...new Set(allJobs().map(j => j.loc))], types = [...new Set(allJobs().map(j => j.type))];
    return `<h2>${tr('jobs')}</h2><p class="note">All listings are fictional samples for this prototype, not real job offers.</p>
    <div class="filters"><input data-f="q" type="search" placeholder="Search jobs or skills" aria-label="Search" value="${esc(F.q)}">
    ${opt(CATS, 'Category', 'jc')}${opt(locs, 'Location', 'jl')}${opt(types, 'Work type', 'jt')}
    <select data-f="jp" aria-label="Minimum pay"><option value="0">Any pay</option><option value="2000" ${F.jp === '2000' ? 'selected' : ''}>₹2,000+</option><option value="8000" ${F.jp === '8000' ? 'selected' : ''}>₹8,000+</option></select>
    <select data-f="sort" aria-label="Sort"><option value="new">Newest first</option><option value="pay" ${F.sort === 'pay' ? 'selected' : ''}>Highest pay</option></select></div><div class="list" id="jobList"></div>`;
  },
  port() {
    const u = S.user, v = verified();
    return `<h2>${tr('port')}</h2><div class="card"><div class="profile-head"><span class="avatar lg" aria-hidden="true">${esc(u.name.slice(0, 1))}</span><div><h3>${esc(u.name)}</h3><small>📍 ${esc(u.location)}</small><p>${esc(u.bio)}</p></div></div></div>
    <h3 style="margin-top:1.5rem">Verified skills</h3><div class="chips">${v.map(c => `<span class="chip ok">✓ ${c.cat}: ${c.t}</span>`).join('') || '<p class="empty" style="width:100%">No verified skills yet. Submit a challenge and run the simulated mentor review.</p>'}</div>
    <h3>Work samples &amp; assignments</h3><ul class="act">${CH.filter(c => S.ch[c.id]?.desc).map(c => `<li><b>${c.t}</b> ${statusBadge(S.ch[c.id].s)}<br><small>${esc(S.ch[c.id].desc)}${S.ch[c.id].url ? ' · ' + esc(S.ch[c.id].url) : ''}${S.ch[c.id].file ? ' · file: ' + esc(S.ch[c.id].file) : ''}</small></li>`).join('') || '<li>No submissions yet.</li>'}</ul>
    <h3>Employer feedback <small>(sample review, not real)</small></h3><div class="card">"Careful, punctual and neat work." — Sample employer</div>
    <h3 style="margin-top:1rem">Experience <small>(sample)</small></h3><div class="card">Trainee, ITI practical workshop — 2024 to 2025</div>
    <div class="row"><button class="btn primary" data-act="copy">Copy Profile Summary</button></div>
    <p class="note">A real public portfolio link needs hosting or a backend. This demo copies a text summary instead.</p>`;
  },
  apps() {
    return `<h2>${tr('apps')}</h2>${S.apps.length ? `<div class="list">${S.apps.map(a => { const j = jobById(a.jobId) || { t: 'Removed listing', emp: '' }; return `<div class="card item"><h3>${esc(j.t)}</h3><small>${esc(j.emp)} · applied ${a.date}</small><span class="badge ${a.status === 'Applied' ? '' : 'ok'}">${a.status}</span><div class="row"><button class="btn ghost sm" data-adv="${a.jobId}" ${a.status === 'Completed' ? 'disabled' : ''}>Simulate employer update</button></div></div>`; }).join('')}</div>` : '<p class="empty">No applications yet. <br><button class="btn primary sm" data-go="jobs">Find jobs</button></p>'}`;
  },
  prof() {
    const u = S.user;
    return `<h2>${tr('prof')}</h2><form class="form card" id="profForm" novalidate><label>Name<input name="name" value="${esc(u.name)}"><span class="err" data-e="name"></span></label>
    <label>Location<input name="location" value="${esc(u.location)}"><span class="err" data-e="location"></span></label>
    <label>Introduction<textarea name="bio" rows="3">${esc(u.bio)}</textarea></label>
    <label>Main skill interest<select name="interests">${CATS.map(c => `<option ${u.interests === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label><button class="btn primary">Save profile</button></form>`;
  },
  set() {
    return `<h2>${tr('set')}</h2><div class="card form"><label>Language<select data-lang><option value="en">English</option><option value="ta">தமிழ்</option><option value="hi">हिन्दी</option></select></label>
    <p>Reset removes all demo progress stored in this browser.</p><button class="btn ghost" data-act="reset">${tr('reset')}</button></div>`;
  },
  /* ===== 7. EMPLOYER VIEWS ===== */
  ov() {
    return `<h2>Employer overview</h2><div class="kpis"><div class="card kpi"><small>Jobs posted</small><b>${S.posted.length}</b></div><div class="card kpi"><small>Demo candidates</small><b>${CANDS.length}</b></div>
    <div class="card kpi"><small>Shortlisted</small><b>${S.short.length}</b></div><div class="card kpi"><small>Applications</small><b>${S.apps.length}</b></div></div>
    <h3>Application management</h3>${S.apps.length ? `<ul class="act">${S.apps.map(a => `<li><b>${esc(S.user.name)}</b> applied for ${esc(jobById(a.jobId)?.t || 'a job')} — <span class="badge">${a.status}</span> <button class="btn ghost sm" data-adv="${a.jobId}" ${a.status === 'Completed' ? 'disabled' : ''}>Move to next stage</button></li>`).join('')}</ul>` : '<p class="empty">No applications yet. Switch to the learner demo and apply for a job to see it here.</p>'}`;
  },
  post() {
    return `<h2>Post a job</h2><form class="form card" id="postForm" novalidate><label>Job title<input name="t"><span class="err" data-e="t"></span></label>
    <label>Category<select name="cat">${CATS.map(c => `<option>${c}</option>`).join('')}</select></label>
    <label>Location<input name="loc"><span class="err" data-e="loc"></span></label>
    <label>Pay in INR<input name="pay" type="number" min="100"><span class="err" data-e="pay"></span></label>
    <label>Duration<input name="dur" placeholder="e.g. 5 days"></label>
    <label>Work type<select name="type"><option>Micro-job</option><option>Part-time</option><option>Apprenticeship</option><option>Paid internship</option></select></label>
    <button class="btn primary">Publish to marketplace</button></form>`;
  },
  cand() {
    return `<h2>Verified candidates <small>(fictional demo data)</small></h2><div class="filters"><input data-f="cq" placeholder="Search by skill" aria-label="Skill"><input data-f="cl" placeholder="Search by location" aria-label="Location"></div><div class="list" id="candList"></div>`;
  }
};
/* Redraw list areas only (keeps search boxes focused) */
function draw() {
  const L = $('#chList'); if (L) {
    const r = CH.filter(c => F.cat === 'All' || c.cat === F.cat);
    L.innerHTML = r.map(chCard).join('') || '<p class="empty">No challenges here yet.</p>';
  }
  const J = $('#jobList'); if (J) {
    const q = F.q.toLowerCase();
    let r = allJobs().filter(j => (F.jc === 'All' || j.cat === F.jc) && (F.jl === 'All' || j.loc === F.jl) && (F.jt === 'All' || j.type === F.jt) && j.pay >= +F.jp && (!q || (j.t + j.cat + j.emp).toLowerCase().includes(q)));
    if (F.sort === 'pay') r = r.sort((a, b) => b.pay - a.pay);
    J.innerHTML = r.map(jobCard).join('') || '<p class="empty">No jobs match. Try clearing a filter.</p>';
  }
  const C = $('#candList'); if (C) {
    const r = CANDS.filter(c => (!F.cq || c.sk.join(' ').toLowerCase().includes(F.cq.toLowerCase())) && (!F.cl || c.loc.toLowerCase().includes(F.cl.toLowerCase())));
    C.innerHTML = r.map(c => `<article class="card item"><div class="who"><span class="avatar">${c.n[0]}</span><div><b>${c.n}</b><small>📍 ${c.loc}</small></div></div><div class="chips">${c.sk.map(s => `<span class="chip ok">✓ ${s}</span>`).join('')}</div><small>${c.done} assignments completed (demo)</small><p>${c.bio}</p>
    <div class="row"><button class="btn ghost sm" data-cview="${c.id}">Portfolio preview</button><button class="btn ${S.short.includes(c.id) ? 'green' : 'primary'} sm" data-short="${c.id}">${S.short.includes(c.id) ? '✓ Shortlisted' : 'Shortlist'}</button></div></article>`).join('') || '<p class="empty">No candidates match your search.</p>';
  }
}

/* Challenge modal: details, start, submit, review */
function chModal(id) {
  const c = chById(id), r = S.ch[id], s = r?.s;
  const stage = { started: 0, pending: 2, verified: 4, improve: 4 }[s] ?? -1;
  let body = '';
  if (!s) body = `<button class="btn primary" data-start="${id}">${tr('start')}</button>`;
  else if (s === 'started') body = `<form class="form" id="subForm" data-id="${id}" novalidate><h3>Submit your evidence</h3>
    <label>Photo or video<input type="file" name="file" accept="image/*,video/*"><span class="err" data-e="file"></span></label><div id="prev"></div>
    <label>Project URL (optional)<input name="url" placeholder="https://"><span class="err" data-e="url"></span></label>
    <label>Describe your work (min 20 characters)<textarea name="desc" rows="3"></textarea><span class="err" data-e="desc"></span></label>
    <small>Files stay in your browser. Only the file name is saved.</small><button class="btn primary">Submit for review</button></form>`;
  else if (s === 'pending') body = `<p class="note">Submitted. Status: Pending Review. Real reviews need mentors; use the button to simulate a decision.</p><button class="btn green" data-review="${id}">Simulate mentor decision</button>`;
  else {
    const seed = s === 'verified' ? [92, 88, 90, 85] : [65, 58, 70, 60];
    body = `<h3>Sample assessment report</h3><p class="note">Illustrative demo scores. No AI or human has judged your actual work.</p>
    ${['Task completion', 'Quality of work', 'Safety awareness', 'Problem-solving'].map((n, i) => `<div class="score"><span>${n}</span>${bar(seed[i])}<b>${seed[i]}</b></div>`).join('')}
    <p><b>Suggestion:</b> ${s === 'verified' ? 'Great job. Add a close-up photo next time.' : 'Add more detail and clearer evidence, then resubmit.'}</p>
    ${s === 'improve' ? `<button class="btn primary" data-start="${id}">Resubmit</button>` : '<span class="badge ok">✓ Skill badge earned</span>'}`;
  }
  openM(`<h2>${ICON[c.cat]} ${c.t}</h2><p>${statusBadge(s)} <span class="badge">${c.lv}</span> <span class="badge">${c.min} min</span> <span class="badge ok">+${c.pts} pts</span></p>
  <p><b>Tools:</b> ${c.tools}</p><h3>Steps</h3><ol>${c.steps.map(x => `<li>${x}</li>`).join('')}</ol><h3>How it is assessed</h3><ul>${c.crit.map(x => `<li>${x}</li>`).join('')}</ul>
  <ol class="tracker" aria-label="Verification stages">${STAGES.map((n, i) => `<li class="${i <= stage ? 'on' : ''}">${n}</li>`).join('')}</ol>${body}`);
}
function jobModal(id) {
  const j = jobById(id), a = S.apps.find(x => x.jobId === id), has = verified().some(c => c.cat === j.cat);
  openM(`<span class="badge">Sample listing, not a real job</span><h2>${esc(j.t)}</h2><p>${esc(j.emp)} · 📍 ${esc(j.loc)}</p><p class="money">${inr(j.pay)} ${j.unit}</p>
  <ul><li>Work type: ${j.type}</li><li>Duration: ${j.dur}</li><li>Experience: ${j.lvl}</li><li>Skills needed: ${j.cat}</li><li>Verification: ${j.cat} challenge preferred</li></ul>
  ${S.role === 'learner' ? (has ? '<span class="badge ok">✓ You hold a verified badge for this skill</span>' : '<p class="note">You have no verified badge for this skill yet. Verification improves your chances.</p>') : ''}
  ${a ? `<span class="badge ok">${a.status}</span>` : `<button class="btn primary" data-apply="${id}">${tr('apply')}</button>`}`);
}
function apply(id) {
  if (S.role !== 'learner') { closeM(); return authModal('register-learner'); }
  if (S.apps.some(a => a.jobId === id)) return;
  S.apps.unshift({ jobId: id, status: 'Applied', date: new Date().toLocaleDateString('en-IN') });
  log('Applied for ' + jobById(id).t); save(); closeM(); render(); toast('Application sent (demo).');
}
function summary() {
  const u = S.user;
  return `${u.name} — ${u.location}\n${u.bio}\nVerified skills: ${verified().map(c => c.cat).join(', ') || 'none yet'}\n(SkillProof demo profile)`;
}

/* ===== 8. EVENTS (delegated) ===== */
document.addEventListener('click', e => {
  const t = e.target.closest('button,a,dialog'); if (!t) return;
  const d = t.dataset;
  if (t === M && e.target === M) return closeM(); // backdrop click
  if (d.close !== undefined) closeM();
  if (d.auth) { e.preventDefault(); d.auth === 'demo-learner' ? enter('learner') : d.auth === 'demo-employer' ? enter('employer') : authModal(d.auth); }
  if (d.pw !== undefined) { const i = t.previousElementSibling; i.type = i.type === 'password' ? 'text' : 'password'; t.textContent = i.type === 'password' ? 'Show' : 'Hide'; }
  if (d.act === 'home') { e.preventDefault(); S.role ? render() : scrollTo(0, 0); }
  if (d.act === 'logout') logout();
  if (d.act === 'reset') { try { localStorage.removeItem(KEY); } catch (x) { /* ignore */ } S = def(); logout(); applyLang(); toast('Demo reset to its starting state.'); }
  if (d.act === 'copy') { const txt = summary(); (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast('Profile summary copied.'), () => { prompt('Copy this summary:', txt); }); }
  if (d.go) { view = d.go; render(); }
  if (d.cat) { F.cat = d.cat; enterOrAsk('ch'); }
  if (d.fcat) { F.cat = d.fcat; render(); }
  if (d.ch) chModal(d.ch);
  if (d.start) { S.ch[d.start] = { s: 'started' }; log('Started: ' + chById(d.start).t); save(); chModal(d.start); render(); toast('Challenge started.'); }
  if (d.review) {
    const r = S.ch[d.review], good = (r.desc || '').length >= 40 || r.url; // simple demo rule, not AI
    r.s = good ? 'verified' : 'improve'; log((good ? 'Skill verified: ' : 'Needs improvement: ') + chById(d.review).t); save(); chModal(d.review); render(); toast(good ? 'Skill verified (simulated).' : 'Feedback ready. Please improve.', good ? 'ok' : 'bad');
  }
  if (d.job) jobModal(d.job);
  if (d.apply) apply(d.apply);
  if (d.adv) { const a = S.apps.find(x => x.jobId === d.adv); if (a) { a.status = STATUS[Math.min(STATUS.indexOf(a.status) + 1, 3)]; log(`${jobById(a.jobId).t}: ${a.status}`); save(); render(); toast('Status: ' + a.status); } }
  if (d.short) { const i = S.short.indexOf(d.short); i < 0 ? S.short.push(d.short) : S.short.splice(i, 1); save(); draw(); toast(i < 0 ? 'Candidate shortlisted.' : 'Removed from shortlist.'); }
  if (d.cview) { const c = CANDS.find(x => x.id === d.cview); openM(`<h2>${c.n}</h2><p>📍 ${c.loc}</p><p>${c.bio}</p><div class="chips">${c.sk.map(s => `<span class="chip ok">✓ ${s}</span>`).join('')}</div><p class="note">Fictional demo candidate.</p>`); }
});
function enterOrAsk(v) { if (S.role) { view = v; render(); } else authModal('register-learner'); }
document.addEventListener('submit', e => {
  const f = e.target; e.preventDefault();
  if (f.id === 'authForm') submitAuth(f);
  if (f.id === 'subForm') {
    const v = Object.fromEntries(new FormData(f)), file = f.file.files[0], er = {};
    if (!file && !v.url.trim()) er.file = 'Add a photo, video, or a project URL.';
    if (v.url.trim()) { try { if (!/^https?:$/.test(new URL(v.url).protocol)) throw 0; } catch (x) { er.url = 'Enter a full link starting with http:// or https://'; } }
    if (v.desc.trim().length < 20) er.desc = 'Describe your work in at least 20 characters.';
    if (file && file.size > 25e6) er.file = 'File is too large for this demo (max 25 MB).';
    $$('.err', f).forEach(x => { x.textContent = er[x.dataset.e] || ''; });
    if (Object.keys(er).length) return toast('Please fix the highlighted fields.', 'bad');
    S.ch[f.dataset.id] = { s: 'pending', url: v.url.trim(), desc: v.desc.trim(), file: file ? file.name : '' };
    log('Evidence submitted: ' + chById(f.dataset.id).t); save(); chModal(f.dataset.id); render(); toast('Submitted. Status: Pending Review.');
  }
  if (f.id === 'profForm') {
    const v = Object.fromEntries(new FormData(f)), er = {};
    if (v.name.trim().length < 2) er.name = 'Enter your name.'; if (!v.location.trim()) er.location = 'Enter your location.';
    $$('.err', f).forEach(x => { x.textContent = er[x.dataset.e] || ''; });
    if (Object.keys(er).length) return;
    S.user = { name: v.name.trim(), location: v.location.trim(), bio: v.bio.trim(), interests: v.interests }; save(); drawAuthArea(); toast('Profile saved.');
  }
  if (f.id === 'postForm') {
    const v = Object.fromEntries(new FormData(f)), er = {};
    if (v.t.trim().length < 4) er.t = 'Enter a job title (4+ characters).';
    if (!v.loc.trim()) er.loc = 'Enter a location.';
    if (!(+v.pay >= 100)) er.pay = 'Enter pay of at least ₹100.';
    $$('.err', f).forEach(x => { x.textContent = er[x.dataset.e] || ''; });
    if (Object.keys(er).length) return toast('Please fix the highlighted fields.', 'bad');
    S.posted.unshift({ id: 'p' + Date.now(), t: v.t.trim(), cat: v.cat, loc: v.loc.trim(), pay: +v.pay, unit: 'total', dur: v.dur.trim() || 'Flexible', type: v.type, lvl: 'Beginner', emp: 'Your business (demo)' });
    save(); toast('Job posted. Learners can now see it under Find Jobs.'); f.reset();
  }
});
document.addEventListener('input', e => {
  const k = e.target.dataset.f; if (k) { F[k] = e.target.value; draw(); }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.f) { F[t.dataset.f] = t.value; draw(); }
  if (t.dataset.lang !== undefined) { S.lang = t.value; save(); applyLang(); }
  if (t.type === 'file' && t.closest('#subForm')) { // image preview where supported
    const p = $('#prev'), f = t.files[0]; p.innerHTML = '';
    if (f && f.type.startsWith('image/')) { const img = new Image(); img.className = 'thumb'; img.alt = 'Preview of your upload'; img.src = URL.createObjectURL(f); p.append(img); }
    else if (f) p.textContent = 'Selected: ' + f.name;
  }
});
$('#lang').addEventListener('change', e => { S.lang = e.target.value; save(); applyLang(); });
$('#menuBtn').addEventListener('click', e => { const o = $('#nav').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); });
$('#nav').addEventListener('click', () => $('#nav').classList.remove('open'));

/* ===== 9. INIT ===== */
drawLanding();
if (S.role) { $('#landing').hidden = true; $('#app').hidden = false; view = S.role === 'learner' ? 'dash' : 'ov'; }
applyLang();
