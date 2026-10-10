const storageKey = 'le-defi-francais-progress';
const initialProgress = { streak: 0, mistakes: [], answered: 0, correct: 0, levels: {}, journey: {} };
const pageNames = ['home', 'levels', 'practice', 'notebook', 'progress', 'results', 'course', 'lesson', 'writing', 'writer', 'paths', 'tcf'];
const seenCards = new Set();
let activePage = 'home';
let session = null;
let answered = false;
let progress = loadProgress();

function node(id) { return document.getElementById(id); }
function textElement(tag, text, className = '') {
  const element = document.createElement(tag);
  element.textContent = text;
  element.className = className;
  return element;
}
function storageNotice(message) {
  node('storage-notice').textContent = message;
  node('storage-notice').hidden = false;
}
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) return { ...initialProgress };
    const valid = ['streak', 'answered', 'correct'].every((key) => Number.isSafeInteger(saved[key]) && saved[key] >= 0);
    if (!valid || saved.correct > saved.answered || !Array.isArray(saved.mistakes)) throw new SyntaxError('Invalid progress');
    const levels = Object.fromEntries(Object.entries(saved.levels || {}).filter(([key, passed]) => /^(grammar|conjugation|vocabulary)-(1|2|3|boss)$/.test(key) && passed === true));
    const journey = Object.fromEntries(Object.entries(saved.journey || {}).filter(([key, passed]) => /^(?:[1-9]|1[0-9]|2[0-4])$/.test(key) && passed === true));
    return { ...initialProgress, ...saved, levels, journey, mistakes: [...new Set(saved.mistakes.filter((id) => FRENCH_CARDS.some((card) => card.id === id)))] };
  } catch (error) {
    if (!(error instanceof SyntaxError) && error.name !== 'SecurityError') throw error;
    storageNotice('Sauvegarde indisponible ou invalide. Vous pouvez pratiquer pendant cette session.');
    return { ...initialProgress };
  }
}
function saveProgress() {
  try { localStorage.setItem(storageKey, JSON.stringify(progress)); }
  catch (error) {
    if (!['SecurityError', 'QuotaExceededError'].includes(error.name)) throw error;
    storageNotice('Votre progression ne peut pas être enregistrée. Elle reste disponible pendant cette session.');
  }
}
function showPage(page) {
  if (page !== 'tcf' && typeof stopTcfAudio === 'function') stopTcfAudio();
  if (page !== 'tcf' && typeof stopTcfExamAudio === 'function') stopTcfExamAudio();
  activePage = page;
  for (const name of pageNames) node(`${name}-page`).hidden = name !== page;
  updateNavigation(page);
  node('resume-session').hidden = !session || session.index >= session.cards.length;
  node('start-mixed').className = node('resume-session').hidden ? 'primary' : 'text-button';
  node('start-mixed').textContent = session && session.index < session.cards.length ? 'Commencer une nouvelle séance →' : 'Commencer une séance →';
  if (page === 'home') {
    if (typeof renderResumeWork === 'function') renderResumeWork();
    if (typeof renderJourney === 'function') renderJourney();
  }
  const titles = { home: 'journey-heading', levels: 'levels-title', practice: 'prompt', notebook: 'notebook-title', progress: 'progress-title', results: 'results-title', course: 'course-title', lesson: 'lesson-title', writing: 'writing-title', writer: 'writer-title', paths: 'paths-title', tcf: 'tcf-title' };
  node(titles[page]).focus({ preventScroll: true });
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}
function updateNavigation(page) {
  const parent = { levels: 'home', lesson: 'course', writer: 'writing', practice: session?.courseId ? 'course' : 'home', results: session?.courseId ? 'course' : 'home' };
  const section = parent[page] || page;
  node('navigation').hidden = false;
  node('navigation').setAttribute('data-focus', String(page === 'practice'));
  node('navigation-links').hidden = page === 'practice';
  node('navigation-toggle').hidden = page !== 'practice';
  node('navigation-toggle').setAttribute('aria-expanded', 'false');
  node('navigation-toggle-label').textContent = 'Menu';
  for (const name of ['home', 'notebook', 'progress', 'course', 'writing', 'paths', 'tcf']) node(`nav-${name}`).setAttribute('aria-current', name === section ? 'page' : 'false');
  updateLocation(page);
}
function updateLocation(page) {
  const labels = { course: 'Les temps', writing: 'Écrire', notebook: 'Mon carnet', progress: 'Progression', paths: 'Parcours guidés', levels: 'Niveaux', results: 'Résultat de la séance', tcf: 'TCF · objectif B2' };
  node('location-bar').hidden = ['home', 'practice'].includes(page);
  const parent = { lesson: 'Les temps', writer: 'Écrire' }[page];
  node('location-parent').hidden = !parent;
  node('location-separator').hidden = !parent;
  node('location-parent').textContent = parent || '';
  node('location-current').textContent = page === 'lesson' ? node('lesson-title').textContent : page === 'writer' ? node('writer-title').textContent : labels[page] || '';
}
function toggleNavigation() {
  const expanded = node('navigation-links').hidden;
  node('navigation-links').hidden = !expanded;
  node('navigation-toggle').setAttribute('aria-expanded', String(expanded));
  node('navigation-toggle-label').textContent = expanded ? 'Fermer le menu' : 'Menu';
}
function sessionCards(pool) {
  let candidates = pool.filter((card) => !seenCards.has(card.id));
  if (!candidates.length) candidates = pool;
  const selected = [];
  while (selected.length < Math.min(10, pool.length)) {
    if (!candidates.length) candidates = pool.filter((card) => !selected.some((chosen) => chosen.id === card.id));
    const card = FrenchQuiz.createRound(candidates, Math.random, progress.mistakes);
    selected.push(card);
    candidates = candidates.filter((candidate) => candidate.id !== card.id);
  }
  return selected;
}
function startSession(topic = 'all', reviewIds = null) {
  const pool = FrenchQuiz.filterCards(FRENCH_CARDS, topic, reviewIds);
  if (!pool.length) { openNotebook(); return; }
  session = { topic, review: reviewIds !== null, cards: sessionCards(pool), index: 0, attempts: [] };
  presentQuestion();
}
function presentQuestion() {
  if (session.index === session.cards.length) { showResults(); return; }
  const card = session.cards[session.index];
  answered = false;
  seenCards.add(card.id);
  node('practice-page').dataset.challenge = session.level?.stage === 3 || (session.journey !== undefined && journeyStages[session.journey].boss) ? 'boss' : 'standard';
  node('practice-topic').textContent = session.courseId ? TENSE_COURSE.find((lesson) => lesson.id === session.courseId).title : session.journey !== undefined ? `${session.topic} · Niveau ${session.journey + 1}` : session.level ? `${session.topic} · ${session.level.stage === 3 ? 'Boss' : `Niveau ${session.level.stage + 1}`}` : session.review ? 'Révision de mes erreurs' : session.topic === 'all' ? 'Pratique générale' : session.topic;
  node('question-number').textContent = `${session.index + 1} / ${session.cards.length}`;
  node('session-progress').max = session.cards.length;
  node('session-progress').value = session.index;
  node('level').textContent = session.journey !== undefined ? `${journeyStages[session.journey].boss ? 'BOSS' : 'NIVEAU'} ${session.journey + 1} · ${card.level}` : session.level ? `${session.level.stage === 3 ? 'BOSS FINAL' : `NIVEAU ${session.level.stage + 1}`} · ${card.level}` : card.level;
  node('prompt').textContent = card.prompt;
  node('answer-area').hidden = true;
  node('choices').replaceChildren(...card.choices.map(choiceButton));
  showPage('practice');
}
function choiceButton(choice, index) {
  const button = textElement('button', '', 'choice');
  button.type = 'button';
  button.dataset.choice = choice;
  button.append(textElement('span', index + 1, 'choice-number'), textElement('span', choice));
  button.addEventListener('click', () => submitAnswer(choice));
  return button;
}
function submitAnswer(choice) {
  if (answered || activePage !== 'practice') return;
  answered = true;
  const card = session.cards[session.index];
  const evaluation = FrenchQuiz.evaluateChoice(card, choice);
  session.attempts.push({ card, choice, isCorrect: evaluation.isCorrect });
  progress = { ...progress, ...FrenchQuiz.updateProgress(progress, card, evaluation.isCorrect), answered: progress.answered + 1, correct: progress.correct + Number(evaluation.isCorrect) };
  saveProgress();
  markChoices(card, choice);
  showCorrection(card, evaluation);
}
function markChoices(card, choice) {
  for (const button of node('choices').children) {
    button.disabled = true;
    if (button.dataset.choice === card.answer) button.classList.add('correct');
    else if (button.dataset.choice === choice) button.classList.add('incorrect');
  }
}
function showCorrection(card, evaluation) {
  node('feedback').replaceChildren(
    textElement('strong', evaluation.isCorrect ? '✓ Bonne réponse' : 'La bonne réponse'),
    textElement('p', evaluation.correction, 'correction'),
    textElement('p', card.explanation, 'rule')
  );
  node('answer-area').className = `answer-area${evaluation.isCorrect ? '' : ' mistake'}`;
  node('answer-area').hidden = false;
  node('session-progress').value = session.index + 1;
  node('next').textContent = session.index + 1 === session.cards.length ? 'Voir mon résultat →' : 'Continuer →';
  node('next').focus({ preventScroll: true });
}
function nextQuestion() {
  if (!answered || activePage !== 'practice') return;
  session.index += 1;
  presentQuestion();
}
function learningEntry(card, attempt) {
  const details = document.createElement('details');
  details.className = 'entry';
  const summary = document.createElement('summary');
  summary.append(textElement('span', `${card.topic}${attempt ? (attempt.isCorrect ? ' · Réussi' : ' · À revoir') : ''}`, 'entry-topic'), textElement('span', card.prompt));
  details.append(summary);
  if (attempt && !attempt.isCorrect) details.append(textElement('p', `Votre choix : ${attempt.choice}`));
  details.append(textElement('p', FrenchQuiz.evaluateChoice(card, card.answer).correction), textElement('p', card.explanation, 'entry-rule'));
  return details;
}
function openNotebook() {
  const missed = FRENCH_CARDS.filter((card) => progress.mistakes.includes(card.id));
  node('notebook-description').textContent = missed.length ? `${missed.length} notions à revoir. Ouvrez une question pour retrouver sa correction.` : 'Un endroit pour transformer vos erreurs en acquis.';
  node('notebook-empty').hidden = missed.length > 0;
  node('start-review').hidden = missed.length === 0;
  node('notebook-list').replaceChildren(...missed.map((card) => learningEntry(card)));
  showPage('notebook');
}
function openProgress() {
  node('total-answered').textContent = progress.answered;
  node('accuracy').textContent = progress.answered ? `${Math.round(progress.correct / progress.answered * 100)} %` : '—';
  node('streak').textContent = progress.streak;
  node('review-count').textContent = progress.mistakes.length;
  showPage('progress');
}
function showResults() {
  recordCourseAttempt();
  node('result-lesson').hidden = !session.courseId;
  node('result-repeat').textContent = session.courseId ? 'Réessayer ces questions →' : 'Une nouvelle séance →';
  const correct = session.attempts.filter((attempt) => attempt.isCorrect).length;
  const errors = session.attempts.length - correct;
  node('result-score').textContent = `${correct} / ${session.attempts.length}`;
  node('results-title').textContent = errors === 0 ? 'Tout juste. Bien joué.' : 'Un pas de plus.';
  node('result-message').textContent = errors ? `${errors} ${errors === 1 ? 'notion à retrouver' : 'notions à retrouver'} dans votre carnet. Prenez le temps de les revoir.` : 'Vous avez terminé votre séance. Gardez ce rythme, une question à la fois.';
  node('result-level-next').hidden = !session.level && session.journey === undefined;
  if (session.level) recordLevelAttempt(correct);
  if (session.journey !== undefined) recordJourneyAttempt(correct);
  node('result-details').open = false;
  node('result-list').replaceChildren(...session.attempts.map((attempt) => learningEntry(attempt.card, attempt)));
  showPage('results');
}
function onClick(id, callback) { node(id).addEventListener('click', callback); }
for (const id of ['brand-home', 'nav-home', 'result-home', 'leave-practice']) onClick(id, () => showPage('home'));
onClick('navigation-toggle', toggleNavigation);
onClick('location-home', () => showPage('home'));
onClick('location-parent', () => { if (activePage === 'lesson') openCourses(); else if (activePage === 'writer') openWriting(); });
for (const id of ['start-mixed', 'empty-start']) onClick(id, () => startSession());
onClick('resume-session', () => showPage('practice'));
onClick('nav-notebook', openNotebook);
onClick('nav-progress', openProgress);
onClick('start-grammar', () => openLevels('grammar'));
onClick('start-tense', () => openLevels('conjugation'));
onClick('start-words', () => openLevels('vocabulary'));
onClick('start-review', () => startSession('all', progress.mistakes));
onClick('result-repeat', () => session.courseId ? startCoursePractice(session.courseId) : session.journey !== undefined ? startJourneyLevel(session.journey) : session.level ? startLevel(session.level.section, session.level.stage) : startSession(session.topic, session.review ? progress.mistakes : null));
onClick('result-lesson', () => openLesson(session.courseId));
onClick('next', nextQuestion);
onClick('reset', () => {
  if (!window.confirm('Effacer vos statistiques et votre carnet ?')) return;
  progress = { ...initialProgress };
  session = null;
  seenCards.clear();
  learningState.results = {};
  saveLearningState();
  saveProgress();
  openProgress();
});
document.addEventListener('keydown', (event) => {
  if (activePage === 'practice' && !node('navigation-links').hidden) {
    if (event.key === 'Escape') { toggleNavigation(); node('navigation-toggle').focus(); }
    return;
  }
  if (activePage !== 'practice' || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
  if (/^[1-4]$/.test(event.key) && !answered) { event.preventDefault(); node('choices').children[Number(event.key) - 1].click(); }
  if (event.key === 'Enter' && answered && event.target.tagName !== 'BUTTON') { event.preventDefault(); nextQuestion(); }
});
node('library-count').textContent = `${FRENCH_CARDS.length} exercices disponibles`;
showPage('home');
