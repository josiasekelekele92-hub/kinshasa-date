const stage = document.querySelector('#stage');
const progressWrap = document.querySelector('#progressWrap');
const progressTrack = document.querySelector('#progressTrack');
const stepCounter = document.querySelector('#stepCounter');
const celebrationLayer = document.querySelector('#celebrationLayer');

const dateTypes = [
  { id: 'activity', emoji: '📸', label: 'Une activité' },
  { id: 'dinner', emoji: '🍽️', label: 'Un dîner' },
  { id: 'cinema', emoji: '🍿', label: 'Cinéma + quelque chose après' },
  { id: 'stroll', emoji: '🌅', label: 'Balade / coucher de soleil' },
  { id: 'picnic', emoji: '🧺', label: 'Pique-nique' },
  { id: 'arcade', emoji: '🎮', label: 'Arcade / gaming' },
  { id: 'drink', emoji: '🍹', label: 'Un verre / Terrasse' },
  { id: 'surprise', emoji: '✨', label: 'Je te laisse organiser' },
];

const suggestions = {
  dinner: [
    { emoji: '🌇', title: 'Terrasse au bord du fleuve', description: 'Un petit air de Gombe, un joli coucher de soleil et nous deux.' },
    { emoji: '🍗', title: 'Maquis / resto cozy', description: 'Une bonne assiette, une belle ambiance, et le temps de parler.' },
    { emoji: '🍦', title: 'Glacier sympa', description: 'Quelque chose de frais et une conversation qui dure.' },
  ],
  drink: [
    { emoji: '🌇', title: 'Terrasse chill', description: 'Une belle vue vers le fleuve ou du côté de Gombe.' },
    { emoji: '🍹', title: 'Verre en terrasse', description: 'Une ambiance douce pour discuter sans regarder l’heure.' },
    { emoji: '🍦', title: 'Glacier sympa', description: 'Une glace, un coin tranquille, et zéro pression.' },
  ],
  activity: [
    { emoji: '🎳', title: 'Bowling / billard', description: 'Un peu de compétition, beaucoup de fous rires.' },
    { emoji: '🎮', title: 'Salle de jeux / arcade', description: 'On choisit un jeu et le perdant offre la prochaine tournée.' },
    { emoji: '🎬', title: 'Cinéma + petit snack', description: 'Un film à Kinshasa, puis une glace ou un snack après.' },
  ],
  cinema: [
    { emoji: '🎬', title: 'Cinéma de Kinshasa', description: 'Une séance sympa, choisie ensemble.' },
    { emoji: '🍿', title: 'Snack après le film', description: 'On débriefe le film avec quelque chose de bon.' },
    { emoji: '🍦', title: 'Une glace en sortant', description: 'Le générique finit, notre soirée continue.' },
  ],
  arcade: [
    { emoji: '🎮', title: 'Salle de jeux / arcade', description: 'Les jeux préférés, et le droit de chambrer le perdant.' },
    { emoji: '🎳', title: 'Bowling / billard', description: 'Un score serré et des souvenirs à raconter.' },
    { emoji: '🍦', title: 'Jeu puis petite glace', description: 'On prolonge le moment tranquillement après.' },
  ],
  stroll: [
    { emoji: '🌳', title: 'Coin calme et verdoyant', description: 'Une balade douce dans un endroit paisible à Kinshasa.' },
    { emoji: '🌅', title: 'Jolie vue au coucher du soleil', description: 'La lumière dorée de Kinshasa, juste avant la soirée.' },
  ],
  picnic: [
    { emoji: '🌳', title: 'Un coin vert au calme', description: 'Une couverture, quelques douceurs et une vraie pause.' },
    { emoji: '🌅', title: 'Un pique-nique au sunset', description: 'Une belle vue, les couleurs du ciel, et pas de montre.' },
  ],
  surprise: [
    { emoji: '✨', title: 'La surprise est entre tes mains', description: 'Tu choisis le plan… moi, je dis oui.' },
  ],
};

const refusalMoods = [
  { image: '/manus-storage/async-images/tffCgwKpjAeJytuRjr86m3/image-1.webp', fallback: './assets/meme-cat.svg', alt: 'Un petit chat fait les yeux les plus suppliants du monde.', caption: 'Même lui ne comprend pas pourquoi tu hésites…' },
  { image: '/manus-storage/async-images/tffCgwKpjAeJytuRjr86m3/image-2.webp', fallback: './assets/meme-skeptical.svg', alt: 'Un personnage illustré lève un sourcil d’un air dubitatif.', caption: 'Pardon ? Tu es sûr(e) de ta réponse là ?' },
  { image: '/manus-storage/async-images/tffCgwKpjAeJytuRjr86m3/image-3.webp', fallback: './assets/meme-frog.svg', alt: 'Une petite grenouille en larmes serre son cœur.', caption: 'La grenouille et moi, on avait déjà choisi nos tenues.' },
  { image: '/manus-storage/async-images/tffCgwKpjAeJytuRjr86m3/image-1.webp', fallback: './assets/meme-cat.svg', alt: 'Un petit chat fait les yeux les plus suppliants du monde.', caption: 'Bon. Dernière chance avant que je fasse le regard du chaton.' },
];

const state = {
  step: 0,
  type: '',
  ambience: '',
  date: '',
  dateMode: '',
  moment: '',
  message: 'Bon... maintenant t’es officiellement coincé(e) avec moi 🥰❤️',
  refusalCount: 0,
  completed: false,
  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth(),
};

const stepNames = ['Le programme', 'Le petit détail', 'Le calendrier', 'Le moment', 'Le récapitulatif'];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function selectedClass(current, value) {
  return current === value ? ' is-selected' : '';
}

function renderProgress() {
  const showProgress = state.step > 0 && !state.completed;
  progressWrap.hidden = !showProgress;
  if (!showProgress) return;
  const active = Math.max(0, Math.min(4, state.step - 1));
  stepCounter.textContent = `ÉTAPE ${active + 1} / 5`;
  progressTrack.innerHTML = Array.from({ length: 5 }, (_, index) => {
    const stateClass = index < active ? ' is-active' : index === active ? ' is-active is-current' : '';
    return `<span class="progress-segment${stateClass}"></span>`;
  }).join('');
}

function heading(kicker, title, subtitle) {
  return `<header class="step-heading"><p class="step-kicker">${kicker}</p><h1 tabindex="-1">${title}</h1><p>${subtitle}</p></header>`;
}

function actions(backLabel = '← Retour', nextLabel = 'Continuer') {
  return `<div class="step-actions"><button class="back-button" type="button" data-action="back">${backLabel}</button><button class="continue-button" type="button" data-action="continue">${nextLabel}<span class="button-arrow" aria-hidden="true">→</span></button></div>`;
}

function renderHome() {
  return `<section class="welcome-view" aria-labelledby="welcomeTitle">
    <div class="welcome-copy">
      <p class="eyebrow"><span class="eyebrow-line"></span> PETITE QUESTION, GROS ENJEU</p>
      <h1 id="welcomeTitle">Tu veux bien qu’on s’offre un <span>premier date officiel</span> ? <span class="title-sparkle">🥺✨</span></h1>
      <p class="welcome-intro">Promis, il y aura de quoi sourire, quelque chose de bon à manger… et moi, en face de toi.</p>
      <div class="welcome-actions">
        <button class="button button--yes" type="button" data-action="yes">OUI <span aria-hidden="true">💕</span></button>
        <button class="button button--no" type="button" data-action="no">Non</button>
      </div>
      <p class="micro-note" id="microNote"><span aria-hidden="true">↳</span> La réponse « oui » est fortement encouragée par le comité.</p>
      <div class="meme-response" id="memeResponse" hidden>
        <div class="meme-frame">
          <span class="meme-stamp" aria-hidden="true">SÉRIEUX ?</span>
          <img id="memeImage" src="" alt="" />
          <span class="meme-doodle" aria-hidden="true">♡</span>
        </div>
        <p class="meme-caption" id="memeCaption" aria-live="polite"></p>
      </div>
    </div>
    <div class="welcome-art" aria-hidden="true">
      <div class="art-orbit art-orbit--outer"></div><div class="art-orbit art-orbit--inner"></div><div class="art-sun"></div>
      <div class="art-ticket"><div class="ticket-top"><span>INVITATION</span><span>№ 001</span></div><div class="ticket-heart"><svg viewBox="0 0 96 88" fill="none"><path d="M48 79S8 56 8 29C8 8 34 2 48 22 62 2 88 8 88 29c0 27-40 50-40 50Z" fill="currentColor"/><path d="M27 31c1.5-6.5 6-10 12-11" stroke="#FFF8F6" stroke-width="3.8" stroke-linecap="round"/></svg></div><div class="ticket-copy"><strong>Un premier<br />date officiel</strong><span>TOI + MOI = ?</span></div><div class="ticket-bottom"><span>GOMBE · KINSHASA</span><span class="ticket-perforation">✳ ✳ ✳</span></div></div>
      <span class="art-caption art-caption--left">édition très limitée</span><span class="art-caption art-caption--right">valable pour toujours*</span><span class="art-flower art-flower--one">✿</span><span class="art-flower art-flower--two">✳</span><span class="art-star art-star--one">✦</span><span class="art-star art-star--two">✧</span>
    </div>
  </section>`;
}

function renderTypeStep() {
  const cards = dateTypes.map((item) => `<button type="button" class="choice-card${selectedClass(state.type, item.id)}" data-action="select-type" data-value="${item.id}" aria-pressed="${state.type === item.id}"><span class="choice-emoji" aria-hidden="true">${item.emoji}</span><span class="choice-label">${item.label}</span></button>`).join('');
  return `<section class="step-card">${heading('ÉTAPE 1 · ON CHOISIT', 'Bon... maintenant faut qu’on fasse ça bien 👀', 'Tu imagines quoi pour notre premier date officiel à Kinshasa ? 👀')}<div class="card-surface"><div class="choice-grid">${cards}</div>${actions('← Retour à la question', 'Ça me plaît')}</div></section>`;
}

function renderPersonalization() {
  const chosenType = dateTypes.find((item) => item.id === state.type);
  const options = suggestions[state.type] || suggestions.activity;
  const cards = options.map((item, index) => {
    const value = `option-${index}`;
    return `<button type="button" class="ambience-card${selectedClass(state.ambience, value)}" data-action="select-ambience" data-value="${value}" aria-pressed="${state.ambience === value}"><span class="ambience-emoji" aria-hidden="true">${item.emoji}</span><span class="ambience-card-copy"><span class="ambience-title">${item.title}</span><span class="ambience-description">${item.description}</span></span></button>`;
  }).join('');
  const subtitle = state.type === 'surprise'
    ? 'Un peu de mystère, beaucoup de confiance. On garde la magie.'
    : `Tu as choisi « ${chosenType ? chosenType.label : 'une idée'} ». On imagine le décor ?`;
  return `<section class="step-card">${heading('ÉTAPE 2 · LE PETIT DÉTAIL', 'Et si on imaginait l’ambiance ?', subtitle)}<div class="card-surface"><div class="ambience-grid">${cards}</div><button type="button" class="surprise-option${selectedClass(state.ambience, 'surprise')}" data-action="select-ambience" data-value="surprise" aria-pressed="${state.ambience === 'surprise'}"><span class="choice-emoji" aria-hidden="true">✨</span><span>Je te laisse garder la surprise</span></button>${actions()}</div></section>`;
}

function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function localTodayKey() {
  const now = new Date();
  return dateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

function renderCalendar() {
  const year = state.calendarYear;
  const month = state.calendarMonth;
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const today = localTodayKey();
  const monthLabel = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
  const cells = [];
  for (let index = 0; index < firstWeekday; index += 1) cells.push('<span class="calendar-empty" aria-hidden="true"></span>');
  for (let day = 1; day <= count; day += 1) {
    const value = dateKey(year, month, day);
    const disabled = value < today;
    const isToday = value === today;
    const chosen = state.dateMode === 'specific' && state.date === value;
    const label = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(year, month, day));
    const classes = `calendar-day${isToday ? ' is-today' : ''}${chosen ? ' is-selected' : ''}`;
    cells.push(`<button type="button" class="${classes}" data-action="select-date" data-value="${value}" aria-label="${label}"${isToday ? ' aria-current="date"' : ''}${chosen ? ' aria-pressed="true"' : ' aria-pressed="false"'}${disabled ? ' disabled' : ''}>${day}</button>`);
  }
  const monthDate = new Date(year, month, 1);
  const prevMonth = new Date(year, month - 1, 1);
  const nextMonth = new Date(year, month + 1, 1);
  const isCurrentMonth = monthDate.getFullYear() === new Date().getFullYear() && monthDate.getMonth() === new Date().getMonth();
  const modeText = state.dateMode === 'choose' ? 'Je te laisse choisir' : state.dateMode === 'together' ? 'On décidera ensemble' : '';
  return `<section class="step-card">${heading('ÉTAPE 3 · LE CALENDRIER', 'Quand on fête ça ? 👀', 'Choisis un jour qui te plaît, ou laisse-nous décider ensemble.')}
    <div class="card-surface calendar-card">
      <div class="calendar-header"><button class="month-nav" type="button" data-action="month-prev" aria-label="Mois précédent"${isCurrentMonth ? ' disabled' : ''}>‹</button><h2 class="month-title" id="monthTitle">${monthLabel}</h2><button class="month-nav" type="button" data-action="month-next" aria-label="Mois suivant">›</button></div>
      <div class="weekdays" role="row"><span class="weekday" role="columnheader">Lun</span><span class="weekday" role="columnheader">Mar</span><span class="weekday" role="columnheader">Mer</span><span class="weekday" role="columnheader">Jeu</span><span class="weekday" role="columnheader">Ven</span><span class="weekday" role="columnheader">Sam</span><span class="weekday" role="columnheader">Dim</span></div>
      <div class="calendar-days" role="grid" aria-labelledby="monthTitle">${cells.join('')}</div>
      <div class="calendar-options"><button class="date-choice${selectedClass(state.dateMode, 'choose')}" type="button" data-action="date-mode" data-value="choose" aria-pressed="${state.dateMode === 'choose'}">✨ Je te laisse choisir</button><button class="date-choice${selectedClass(state.dateMode, 'together')}" type="button" data-action="date-mode" data-value="together" aria-pressed="${state.dateMode === 'together'}">💬 On décidera ensemble</button></div>
      ${modeText ? `<p class="calendar-selection-note">${modeText} : c’est noté ♡</p>` : ''}
      ${actions('← Retour', 'Et le moment ?')}
    </div></section>`;
}

function renderMoment() {
  const moments = [
    { id: 'afternoon', emoji: '☀️', label: 'Après-midi' },
    { id: 'sunset', emoji: '🌆', label: 'Fin de journée' },
    { id: 'evening', emoji: '🌙', label: 'Soirée' },
    { id: 'your-choice', emoji: '✨', label: 'Tu choisis' },
  ];
  const cards = moments.map((item) => `<button type="button" class="moment-card${item.id === 'sunset' ? ' moment-card--sunset' : ''}${selectedClass(state.moment, item.id)}" data-action="select-moment" data-value="${item.id}" aria-pressed="${state.moment === item.id}"><span class="moment-emoji" aria-hidden="true">${item.emoji}</span><span class="moment-label">${item.label}</span></button>`).join('');
  return `<section class="step-card">${heading('ÉTAPE 4 · LE MOMENT', 'Plutôt quand ?', 'À Kin, la fin de journée a quand même un petit quelque chose…')}<div class="card-surface"><div class="moment-grid">${cards}</div><p class="sunset-note">Fin de journée : parfaite pour le coucher de soleil kinois.</p>${actions('← Retour au calendrier', 'Voir le récapitulatif')}</div></section>`;
}

function labelForType() {
  return (dateTypes.find((item) => item.id === state.type) || {}).label || 'À choisir ensemble';
}

function labelForAmbience() {
  if (state.ambience === 'surprise') return 'La surprise est gardée ✨';
  const optionIndex = Number(state.ambience.replace('option-', ''));
  const option = (suggestions[state.type] || [])[optionIndex];
  return option ? `${option.emoji} ${option.title}` : 'À choisir ensemble';
}

function labelForDate() {
  if (state.dateMode === 'choose') return 'Je te laisse choisir';
  if (state.dateMode === 'together') return 'On décidera ensemble';
  if (!state.date) return 'À choisir ensemble';
  const [year, month, day] = state.date.split('-').map(Number);
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(year, month - 1, day));
}

function labelForMoment() {
  return ({ afternoon: '☀️ Après-midi', sunset: '🌆 Fin de journée', evening: '🌙 Soirée', 'your-choice': '✨ Tu choisis' })[state.moment] || 'À choisir ensemble';
}

function renderSummary() {
  const items = [
    ['Notre idée', labelForType()],
    ['L’ambiance', labelForAmbience()],
    ['Le jour', labelForDate()],
    ['Le moment', labelForMoment()],
  ];
  const rows = items.map(([key, value]) => `<div class="summary-item"><dt>${key}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
  return `<section class="step-card">${heading('ÉTAPE 5 · PRESQUE OFFICIEL', 'Alors, on valide ? 🥰', 'Un dernier petit mot, si le cœur t’en dit.')}
    <div class="card-surface summary-card"><p class="summary-topline">NOTRE PETIT PROGRAMME</p><dl class="summary-list">${rows}</dl><label class="message-label" for="finalMessage"><span>Ton message</span><span>modifiable à volonté</span></label><textarea class="message-input" id="finalMessage" maxlength="400" aria-describedby="messageHint">${escapeHtml(state.message)}</textarea><p class="message-hint" id="messageHint">Ce message restera sur ton écran — aucune réponse n’est envoyée à un tiers.</p>${actions('← Modifier le moment', 'Envoyer ma réponse ❤️')}</div>
    </section>`;
}

function renderSuccess() {
  return `<section class="success-view" aria-labelledby="successTitle"><div class="success-emblem" aria-hidden="true">♥</div><p class="step-kicker">LE COMITÉ A RENDU SON VERDICT</p><h1 id="successTitle" tabindex="-1">C’est noté, officiellement. 🥹</h1><p class="success-intro">Il semblerait qu’un très joli premier date se prépare à Kinshasa. Nous, on a déjà hâte.</p><p class="success-message">${escapeHtml(state.message || 'Un premier date officiel, c’est oui. ❤️')}</p><p class="success-summary">${escapeHtml(labelForType())} · ${escapeHtml(labelForDate())} · ${escapeHtml(labelForMoment())}</p><button class="success-reset" type="button" data-action="restart">Revoir notre invitation</button></section>`;
}

function render({ focusHeading = true } = {}) {
  renderProgress();
  if (state.completed) {
    stage.innerHTML = renderSuccess();
  } else if (state.step === 0) {
    stage.innerHTML = renderHome();
  } else if (state.step === 1) {
    stage.innerHTML = renderTypeStep();
  } else if (state.step === 2) {
    stage.innerHTML = renderPersonalization();
  } else if (state.step === 3) {
    stage.innerHTML = renderCalendar();
  } else if (state.step === 4) {
    stage.innerHTML = renderMoment();
  } else {
    stage.innerHTML = renderSummary();
    stage.querySelector('#finalMessage').addEventListener('input', (event) => { state.message = event.currentTarget.value; });
  }
  const continueButton = stage.querySelector('[data-action="continue"]');
  if (continueButton) {
    const requiredChoice = { 1: state.type, 2: state.ambience, 3: state.dateMode, 4: state.moment }[state.step];
    continueButton.disabled = state.step < 5 && !requiredChoice;
  }
  const headingElement = stage.querySelector('h1[tabindex="-1"]');
  if (focusHeading && headingElement) headingElement.focus({ preventScroll: true });
}

function niceDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(new Date(year, month - 1, day));
}

function showRefusal(count) {
  state.refusalCount = count;
  const yesButton = stage.querySelector('[data-action="yes"]');
  const response = stage.querySelector('#memeResponse');
  const image = stage.querySelector('#memeImage');
  const caption = stage.querySelector('#memeCaption');
  const mood = refusalMoods[(count - 1) % refusalMoods.length];
  const maxScale = window.innerWidth < 430 ? 1.34 : 1.84;
  const scale = Math.min(maxScale, 1 + count * 0.145);
  yesButton.style.setProperty('--yes-scale', String(scale));
  yesButton.setAttribute('aria-label', count > 1 ? `Oui, je veux bien. ${count} petits rappels.` : 'Oui, je veux bien répondre à l’invitation.');
  response.hidden = false;
  caption.textContent = mood.caption;
  image.alt = mood.alt;
  image.onerror = () => {
    image.onerror = null;
    image.src = mood.fallback;
  };
  image.src = mood.image;
  const microNote = stage.querySelector('#microNote');
  const notes = ['On va dire que tu réfléchis encore…', 'Le comité demande une deuxième lecture de ta réponse.', 'Je garde espoir. La grenouille aussi.', 'Le bouton vert devient très convaincant, non ?'];
  microNote.innerHTML = `<span aria-hidden="true">↳</span> ${notes[Math.min(count - 1, notes.length - 1)]}`;
}

function setDate(value) {
  state.date = value;
  state.dateMode = 'specific';
}

function makeConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const symbols = ['♥', '✦', '✿', '♡', '✧'];
  const colors = ['#d9788d', '#e8b964', '#84a58d', '#c88b9a', '#f1c7ae'];
  celebrationLayer.innerHTML = Array.from({ length: 54 }, (_, index) => {
    const style = `--x:${Math.random() * 100}%;--c:${colors[index % colors.length]};--s:${12 + Math.random() * 15}px;--d:${3.2 + Math.random() * 2.8}s;--delay:${Math.random() * .65}s;--drift:${Math.random() * 160 - 80}px;--spin:${Math.random() * 700 - 350}deg`;
    return `<span class="confetti-piece" style="${style}" aria-hidden="true">${symbols[index % symbols.length]}</span>`;
  }).join('');
  window.setTimeout(() => { celebrationLayer.replaceChildren(); }, 7000);
}

function continueFlow() {
  if (state.step === 1) {
    if (!state.type) return;
    state.ambience = '';
    state.step = 2;
  } else if (state.step === 2) {
    if (!state.ambience) return;
    state.step = 3;
  } else if (state.step === 3) {
    if (!state.dateMode) return;
    state.step = 4;
  } else if (state.step === 4) {
    if (!state.moment) return;
    state.step = 5;
  } else if (state.step === 5) {
    state.message = stage.querySelector('#finalMessage').value.trim();
    state.completed = true;
    makeConfetti();
  }
  render();
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

function goBack() {
  if (state.step <= 0) return;
  state.step -= 1;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

stage.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === 'yes') {
    state.step = 1;
    render();
  } else if (action === 'no') {
    showRefusal(state.refusalCount + 1);
  } else if (action === 'select-type') {
    state.type = value;
    stage.querySelectorAll('[data-action="select-type"]').forEach((card) => {
      const selected = card.dataset.value === value;
      card.classList.toggle('is-selected', selected);
      card.setAttribute('aria-pressed', String(selected));
    });
    const next = stage.querySelector('[data-action="continue"]');
    next.disabled = false;
  } else if (action === 'select-ambience') {
    state.ambience = value;
    render({ focusHeading: false });
    stage.querySelector(`[data-action="select-ambience"][data-value="${value}"]`)?.focus({ preventScroll: true });
  } else if (action === 'select-date') {
    setDate(value);
    render({ focusHeading: false });
    stage.querySelector(`[data-action="select-date"][data-value="${value}"]`)?.focus({ preventScroll: true });
  } else if (action === 'date-mode') {
    state.dateMode = value;
    state.date = '';
    render({ focusHeading: false });
    stage.querySelector(`[data-action="date-mode"][data-value="${value}"]`)?.focus({ preventScroll: true });
  } else if (action === 'month-prev') {
    const previous = new Date(state.calendarYear, state.calendarMonth - 1, 1);
    const now = new Date();
    if (previous.getFullYear() > now.getFullYear() || (previous.getFullYear() === now.getFullYear() && previous.getMonth() >= now.getMonth())) {
      state.calendarYear = previous.getFullYear();
      state.calendarMonth = previous.getMonth();
      render({ focusHeading: false });
      stage.querySelector('[data-action="month-prev"]')?.focus({ preventScroll: true });
    }
  } else if (action === 'month-next') {
    const next = new Date(state.calendarYear, state.calendarMonth + 1, 1);
    state.calendarYear = next.getFullYear();
    state.calendarMonth = next.getMonth();
    render({ focusHeading: false });
    stage.querySelector('[data-action="month-next"]')?.focus({ preventScroll: true });
  } else if (action === 'select-moment') {
    state.moment = value;
    stage.querySelectorAll('[data-action="select-moment"]').forEach((card) => {
      const selected = card.dataset.value === value;
      card.classList.toggle('is-selected', selected);
      card.setAttribute('aria-pressed', String(selected));
    });
    stage.querySelector('[data-action="continue"]').disabled = false;
  } else if (action === 'continue') {
    continueFlow();
  } else if (action === 'back') {
    goBack();
  } else if (action === 'restart') {
    state.step = 0;
    state.type = '';
    state.ambience = '';
    state.date = '';
    state.dateMode = '';
    state.moment = '';
    state.message = 'Bon... maintenant t’es officiellement coincé(e) avec moi 🥰❤️';
    state.refusalCount = 0;
    state.completed = false;
    render();
  }
});

render();
