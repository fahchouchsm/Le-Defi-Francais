const tcfStorageKey = 'le-defi-francais-tcf-b2';
const tcfKinds = { reading: 'COMPRÉHENSION ÉCRITE', listening: 'COMPRÉHENSION ORALE', structures: 'STRUCTURES DE LA LANGUE' };
let tcfState = loadTcfState();
let tcfRun = null;

function loadTcfState() {
  const fresh = { solved: [], mistakes: [], draft: '' };
  try {
    const saved = JSON.parse(localStorage.getItem(tcfStorageKey));
    if (!saved || typeof saved !== 'object') return fresh;
    const ids = new Set(TCF_B2_QUESTIONS.map((question) => question.id));
    for (const field of ['solved', 'mistakes']) {
      if (Array.isArray(saved[field])) fresh[field] = [...new Set(saved[field].filter((id) => ids.has(id)))];
    }
    if (typeof saved.draft === 'string') fresh.draft = saved.draft.slice(0, 10000);
    return fresh;
  } catch (error) {
    if (!(error instanceof SyntaxError) && error.name !== 'SecurityError') throw error;
    storageNotice('Votre parcours TCF ne peut pas être relu. Vous pouvez continuer pendant cette session.');
    return fresh;
  }
}
function saveTcfState() {
  try { localStorage.setItem(tcfStorageKey, JSON.stringify(tcfState)); }
  catch (error) {
    if (!['SecurityError', 'QuotaExceededError'].includes(error.name)) throw error;
    storageNotice('Votre parcours TCF reste disponible pendant cette session, mais ne peut pas être enregistré.');
  }
}
function renderTcfDashboard() {
  node('tcf-solved').textContent = `${tcfState.solved.length} / ${TCF_B2_QUESTIONS.length}`;
  node('tcf-review-count').textContent = String(tcfState.mistakes.length);
  node('tcf-review').hidden = tcfState.mistakes.length === 0;
  node('tcf-no-review').hidden = tcfState.mistakes.length > 0;
}
function openTcf() {
  stopTcfAudio();
  stopTcfExamAudio();
  tcfRun = null;
  node('tcf-overview').dataset.exam = 'false';
  node('tcf-offline-exam').hidden = true;
  renderTcfDashboard();
  node('tcf-hero').hidden = false;
  node('tcf-dashboard').hidden = false;
  node('tcf-overview').hidden = false;
  node('tcf-exercise').hidden = true;
  node('tcf-production').hidden = true;
  showPage('tcf');
}
function startTcfRun(questions) {
  node('tcf-message').hidden = true;
  tcfRun = { questions, index: 0, answered: false, correct: 0 };
  node('tcf-hero').hidden = true;
  node('tcf-dashboard').hidden = true;
  node('tcf-overview').hidden = true;
  node('tcf-production').hidden = true;
  node('tcf-exercise').hidden = false;
  showPage('tcf');
  renderTcfQuestion();
}
function quickTcfQuestions() {
  const chosen = [];
  for (const kind of ['reading', 'listening', 'structures', 'reading']) {
    const available = TCF_B2_QUESTIONS.filter((question) => question.kind === kind && !chosen.includes(question));
    chosen.push(available.find((question) => !tcfState.solved.includes(question.id)) || available[0]);
  }
  return chosen;
}
function renderTcfQuestion() {
  const question = tcfRun.questions[tcfRun.index];
  tcfRun.answered = false;
  node('tcf-exercise').dataset.questionId = question.id;
  node('tcf-kind').textContent = tcfKinds[question.kind];
  node('tcf-position').textContent = `${tcfRun.index + 1} / ${tcfRun.questions.length}`;
  node('tcf-progress').max = tcfRun.questions.length;
  node('tcf-progress').value = tcfRun.index;
  renderTcfStimulus(question);
  node('tcf-prompt').textContent = question.prompt;
  node('tcf-feedback').hidden = true;
  node('tcf-next').hidden = true;
  node('tcf-options').replaceChildren(...question.choices.map((choice, index) => tcfOption(question, choice, index)));
  node('tcf-prompt').focus({ preventScroll: true });
}
function renderTcfStimulus(question) {
  node('tcf-card-title').textContent = question.title;
  node('tcf-context').textContent = question.stimulus;
  node('tcf-context').hidden = question.kind === 'listening';
  node('tcf-listening-tools').hidden = question.kind !== 'listening';
  node('tcf-transcript-text').textContent = question.stimulus;
  node('tcf-transcript').open = false;
}
function tcfOption(question, choice, index) {
  const button = textElement('button', `${String.fromCharCode(65 + index)} · ${choice}`, 'tcf-option');
  button.type = 'button';
  button.dataset.choice = choice;
  button.addEventListener('click', () => answerTcf(question, choice));
  return button;
}
function answerTcf(question, choice) {
  if (tcfRun.answered) return;
  tcfRun.answered = true;
  const correct = choice === question.answer;
  recordTcfAnswer(question, correct);
  stopTcfAudio();
  showTcfCorrection(question, choice, correct);
}
function recordTcfAnswer(question, correct) {
  tcfRun.correct += Number(correct);
  tcfState.solved = [...new Set([...tcfState.solved, question.id])];
  tcfState.mistakes = correct
    ? tcfState.mistakes.filter((id) => id !== question.id)
    : [...new Set([...tcfState.mistakes, question.id])];
  saveTcfState();
  renderTcfDashboard();
}
function showTcfCorrection(question, choice, correct) {
  for (const button of node('tcf-options').children) {
    button.disabled = true;
    if (button.dataset.choice === question.answer) button.classList.add('correct');
    else if (button.dataset.choice === choice) button.classList.add('incorrect');
  }
  node('tcf-feedback').textContent = `${correct ? '✓ Bien vu !' : 'À retenir'}\nBonne réponse : ${question.answer}\nIndice : ${question.clue}\nPourquoi ? ${question.explanation}`;
  node('tcf-feedback').hidden = false;
  node('tcf-progress').value = tcfRun.index + 1;
  node('tcf-next').textContent = tcfRun.index + 1 === tcfRun.questions.length ? 'Voir mon bilan →' : 'Question suivante →';
  node('tcf-next').hidden = false;
  node('tcf-next').focus({ preventScroll: true });
}
function nextTcfQuestion() {
  if (!tcfRun.answered) return;
  tcfRun.index += 1;
  if (tcfRun.index < tcfRun.questions.length) return renderTcfQuestion();
  const score = tcfRun.correct;
  const count = tcfRun.questions.length;
  openTcf();
  node('tcf-message').textContent = `${score} / ${count} réponses justes. ${tcfState.mistakes.length ? 'Vos erreurs vous attendent dans « Rejouer mes erreurs ».' : 'Bravo : aucune erreur à rejouer pour le moment.'}`;
  node('tcf-message').hidden = false;
}
function playTcfAudio() {
  const speech = window.speechSynthesis;
  if (!speech || typeof window.SpeechSynthesisUtterance !== 'function') {
    node('tcf-transcript').open = true;
    return;
  }
  speech.cancel();
  const utterance = new window.SpeechSynthesisUtterance(tcfRun.questions[tcfRun.index].stimulus);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.95;
  speech.speak(utterance);
}
function stopTcfAudio() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}
function stopTcfExamAudio() {
  if (tcfExam) node('tcf-exam-materials').querySelector('audio')?.pause();
}
function openTcfProduction() {
  node('tcf-hero').hidden = true;
  node('tcf-dashboard').hidden = true;
  node('tcf-overview').hidden = true;
  node('tcf-exercise').hidden = true;
  node('tcf-production').hidden = false;
  node('tcf-draft').value = tcfState.draft;
  updateTcfWordCount();
  node('tcf-production-title').focus({ preventScroll: true });
}
function updateTcfWordCount() {
  const words = node('tcf-draft').value.trim().match(/[^\s]+/g) || [];
  node('tcf-word-count').textContent = `${words.length} ${words.length === 1 ? 'mot' : 'mots'} · brouillon enregistré sur cet appareil`;
}
function saveTcfDraft() {
  tcfState.draft = node('tcf-draft').value;
  saveTcfState();
  updateTcfWordCount();
}

onClick('nav-tcf', openTcf);
onClick('home-tcf', openTcf);
onClick('tcf-back', openTcf);
onClick('tcf-production-back', openTcf);
onClick('tcf-start-reading', () => startTcfRun(TCF_B2_QUESTIONS.filter((question) => question.kind === 'reading')));
onClick('tcf-start-listening', () => startTcfRun(TCF_B2_QUESTIONS.filter((question) => question.kind === 'listening')));
onClick('tcf-start-structures', () => startTcfRun(TCF_B2_QUESTIONS.filter((question) => question.kind === 'structures')));
onClick('tcf-quick', () => startTcfRun(quickTcfQuestions()));
onClick('tcf-review', () => startTcfRun(TCF_B2_QUESTIONS.filter((question) => tcfState.mistakes.includes(question.id))));
onClick('tcf-next', nextTcfQuestion);
onClick('tcf-play', playTcfAudio);
onClick('tcf-start-production', openTcfProduction);
node('tcf-draft').addEventListener('input', saveTcfDraft);
renderTcfDashboard();

const tcfExamKey = 'le-defi-francais-tcf-offline-exam';
let tcfExam = null;
let tcfExamTick = null;
const tcfBooklets = [...document.querySelectorAll('[data-tcf-set]')].map((row) => ({
  number: Number(row.dataset.tcfSet), pdf: row.querySelector('a').getAttribute('href'), audio: row.querySelectorAll('a')[1].getAttribute('href'),
}));

function saveTcfExam() {
  try { localStorage.setItem(tcfExamKey, JSON.stringify(tcfExam)); }
  catch (error) { if (!['SecurityError', 'QuotaExceededError'].includes(error.name)) throw error; node('tcf-exam-notice').textContent = 'Enregistrement impossible sur cet appareil : gardez cette fenêtre ouverte.'; }
}
function loadTcfExam() {
  try {
    const saved = JSON.parse(localStorage.getItem(tcfExamKey));
    if (saved && Array.isArray(saved.sets) && saved.sets.length === 2 && saved.sets.every((set) => tcfBooklets.some((booklet) => booklet.number === set)) && saved.sets[0] !== saved.sets[1] && Array.isArray(saved.answers) && saved.answers.length === 80 && Number.isFinite(saved.deadline)) {
      return { sets: saved.sets, answers: saved.answers.map((answer) => 'ABCD'.includes(answer) && answer.length === 1 ? answer : ''), deadline: saved.deadline, finished: !!saved.finished, current: Number.isInteger(saved.current) && saved.current >= 0 && saved.current < 80 ? saved.current : 0 };
    }
  } catch { /* A damaged or inaccessible save starts a fresh session. */ }
  return null;
}
function formatTcfExamTime(milliseconds) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
function updateTcfExamClock() {
  if (!tcfExam) return;
  if (!tcfExam.finished && Date.now() >= tcfExam.deadline) finishTcfExam(true);
  node('tcf-exam-time').textContent = formatTcfExamTime(tcfExam.deadline - Date.now());
  node('tcf-exam-progress').textContent = `${tcfExam.answers.filter(Boolean).length} / 80 réponses`;
}
function finishTcfExam(expired = false) {
  if (!tcfExam || tcfExam.finished) return;
  tcfExam.finished = true;
  saveTcfExam();
  renderTcfExam();
  if (expired) node('tcf-exam-result').textContent = `Temps écoulé. ${node('tcf-exam-result').textContent}`;
  node('tcf-exam-result').hidden = false;
}
function renderTcfExam() {
  for (const [position, selectId] of ['tcf-exam-first', 'tcf-exam-second'].entries()) node(selectId).value = String(tcfExam.sets[position]);
  node('tcf-exam-notice').textContent = tcfExam.finished ? 'Session terminée. Choisissez deux livrets puis démarrez une nouvelle session pour recommencer.' : 'Le temps continue même si vous quittez cette page ou fermez l’application.';
  const section = Math.floor(tcfExam.current / 40);
  const number = tcfExam.sets[section];
  const booklet = tcfBooklets.find((entry) => entry.number === number);
  if (node('tcf-exam-materials').dataset.set !== String(number)) {
    const heading = document.createElement('h3'); heading.textContent = `Livret ${section + 1} · série ${String(number).padStart(2, '0')}`;
    const pdf = document.createElement('a'); pdf.href = booklet.pdf; pdf.target = '_blank'; pdf.rel = 'noopener noreferrer'; pdf.textContent = 'Ouvrir le PDF dans une fenêtre ↗';
    const audio = document.createElement('audio'); audio.controls = true; audio.preload = 'metadata'; audio.src = booklet.audio; audio.id = 'tcf-exam-audio'; audio.setAttribute('aria-label', `Audio du livret ${number}`);
    const frame = document.createElement('iframe'); frame.id = 'tcf-exam-document'; frame.src = `${booklet.pdf}#page=3`; frame.title = `Questions du livret ${number}`;
    node('tcf-exam-materials').replaceChildren(heading, pdf, audio, frame);
    node('tcf-exam-materials').dataset.set = String(number);
  }
  node('tcf-exam-question-number').textContent = `Question ${tcfExam.current + 1} / 80`;
  node('tcf-exam-set-label').textContent = `Série ${String(number).padStart(2, '0')} · question ${tcfExam.current % 40 + 1} du livret`;
  const field = document.createElement('fieldset'); field.className = 'tcf-exam-question';
  const legend = document.createElement('legend'); legend.textContent = 'Votre réponse'; field.append(legend);
  for (const choice of 'ABCD') {
    const label = document.createElement('label'); const input = document.createElement('input'); input.type = 'radio'; input.name = `tcf-exam-q${tcfExam.current}`; input.value = choice; input.checked = tcfExam.answers[tcfExam.current] === choice; input.disabled = tcfExam.finished;
    input.addEventListener('change', () => { tcfExam.answers[tcfExam.current] = choice; saveTcfExam(); updateTcfExamClock(); renderTcfExamJump(); });
    label.append(input, document.createTextNode(choice)); field.append(label);
  }
  node('tcf-exam-answers').replaceChildren(field);
  node('tcf-exam-previous').disabled = tcfExam.current === 0;
  node('tcf-exam-next').disabled = tcfExam.current === 79;
  renderTcfExamJump();
  node('tcf-exam-finish').hidden = tcfExam.finished;
  node('tcf-exam-result').hidden = !tcfExam.finished;
  if (tcfExam.finished) {
    const count = tcfExam.answers.filter(Boolean).length;
    node('tcf-exam-result').textContent = `${count} réponse${count === 1 ? '' : 's'} enregistrée${count === 1 ? '' : 's'} sur 80. Comparez-les avec les grilles de correction à la fin de chaque livret. Aucun niveau TCF officiel n’est calculé.`;
  }
  updateTcfExamClock();
}
function renderTcfExamJump() {
  node('tcf-exam-jump-list').replaceChildren(...tcfExam.answers.map((answer, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = String(index + 1);
    button.className = `tcf-exam-jump-button${answer ? ' answered' : ''}${index === tcfExam.current ? ' current' : ''}`;
    button.setAttribute('aria-label', `Question ${index + 1}${answer ? ', répondue' : ''}`);
    if (index === tcfExam.current) button.setAttribute('aria-current', 'step');
    button.addEventListener('click', () => { tcfExam.current = index; saveTcfExam(); renderTcfExam(); node('tcf-exam-question-number').focus({ preventScroll: true }); });
    return button;
  }));
}
function moveTcfExam(step) {
  const next = tcfExam.current + step;
  if (next < 0 || next >= 80) return;
  tcfExam.current = next;
  saveTcfExam(); renderTcfExam(); node('tcf-exam-question-number').focus({ preventScroll: true });
}
function openTcfExam() {
  tcfExam = loadTcfExam() || { sets: [16, 17], answers: Array(80).fill(''), deadline: Date.now() + 90 * 60 * 1000, finished: false, current: 0 };
  saveTcfExam();
  node('tcf-hero').hidden = true; node('tcf-dashboard').hidden = true;
  node('tcf-overview').dataset.exam = 'true'; node('tcf-offline-exam').hidden = false;
  renderTcfExam();
  if (tcfExamTick) clearInterval(tcfExamTick);
  tcfExamTick = setInterval(updateTcfExamClock, 1000);
  window.scrollTo(0, 0);
  node('tcf-exam-title').focus({ preventScroll: true });
}
function setTcfExamView(view) {
  node('tcf-exam-workspace').dataset.view = view;
  node('tcf-exam-view-document').setAttribute('aria-pressed', String(view === 'document'));
  node('tcf-exam-view-answer').setAttribute('aria-pressed', String(view === 'answer'));
}
function newTcfExam() {
  const sets = [Number(node('tcf-exam-first').value), Number(node('tcf-exam-second').value)];
  if (sets[0] === sets[1]) { node('tcf-exam-notice').textContent = 'Choisissez deux séries différentes.'; return; }
  if (!tcfExam.finished && tcfExam.answers.some(Boolean) && !window.confirm('Effacer les réponses de la session en cours ?')) return;
  tcfExam = { sets, answers: Array(80).fill(''), deadline: Date.now() + 90 * 60 * 1000, finished: false, current: 0 };
  node('tcf-exam-materials').dataset.set = '';
  saveTcfExam(); renderTcfExam();
}
for (const id of ['tcf-exam-first', 'tcf-exam-second']) {
  node(id).replaceChildren(...tcfBooklets.map((booklet) => { const option = document.createElement('option'); option.value = booklet.number; option.textContent = `Série ${String(booklet.number).padStart(2, '0')}`; return option; }));
}
onClick('tcf-real-exam', openTcfExam);
onClick('tcf-exam-back', openTcf);
onClick('tcf-exam-new', newTcfExam);
onClick('tcf-exam-finish', () => finishTcfExam());
onClick('tcf-exam-previous', () => moveTcfExam(-1));
onClick('tcf-exam-next', () => moveTcfExam(1));
onClick('tcf-exam-view-document', () => setTcfExamView('document'));
onClick('tcf-exam-view-answer', () => setTcfExamView('answer'));
