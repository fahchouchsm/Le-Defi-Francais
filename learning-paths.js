const learningKey = 'le-defi-francais-learning';
const guidedPaths = [
  { id: 'raconter', title: 'Raconter ce qui vous est arrivé', intention: 'Donnez un décor à votre histoire, faites avancer les événements et revenez sur ce qui s’est passé avant.', lessons: ['imparfait', 'passe-compose', 'plus-que-parfait'], workshop: 'recit', bridge: 'Votre défi final : un imprévu raconté avec trois regards sur le passé.' },
  { id: 'demander', title: 'Obtenir une réponse avec tact', intention: 'Présentez des faits précis, puis formulez une demande claire sans paraître brusque.', lessons: ['passe-compose', 'conditionnel-present'], workshop: 'courriel', bridge: 'Votre défi final : un courriel qui décrit le problème et propose une solution.' },
  { id: 'convaincre', title: 'Défendre une idée avec nuance', intention: 'Distinguez les faits, les possibilités et ce que vous souhaitez voir changer.', lessons: ['present', 'conditionnel-present', 'subjonctif-present'], workshop: 'opinion', bridge: 'Votre défi final : une opinion argumentée qui reconnaît une objection.' },
  { id: 'proposer', title: 'Transformer une idée en projet', intention: 'Imaginez une activité, expliquez son déroulement et anticipez ce qui pourrait la rendre possible.', lessons: ['conditionnel-present', 'futur-simple'], workshop: 'projet', bridge: 'Votre défi final : une proposition réaliste, avec un objectif et des moyens.' },
];
let activeGuidedPath = null;
let learningState = loadLearningState();
activeGuidedPath = learningState.pathId;

function loadLearningState() {
  const fresh = { activity: null, sentences: {}, results: {}, pathId: null };
  try {
    const saved = JSON.parse(localStorage.getItem(learningKey));
    if (!saved || typeof saved !== 'object') return fresh;
    for (const lesson of TENSE_COURSE) {
      if (typeof saved.sentences?.[lesson.id] === 'string') fresh.sentences[lesson.id] = saved.sentences[lesson.id];
      const score = saved.results?.[lesson.id];
      if (Number.isInteger(score) && score >= 0 && score <= 2) fresh.results[lesson.id] = score;
    }
    const activity = saved.activity;
    const lessons = activity?.type === 'lesson' && TENSE_COURSE.some((lesson) => lesson.id === activity.id);
    const writing = activity?.type === 'writing' && WRITING_WORKSHOPS.some((workshop) => workshop.id === activity.id);
    if ((lessons || writing) && Number.isInteger(activity.step) && activity.step >= 0 && activity.step <= (lessons ? 3 : 2)) fresh.activity = { type: activity.type, id: activity.id, step: activity.step };
    if (guidedPaths.some((path) => path.id === saved.pathId)) fresh.pathId = saved.pathId;
    return fresh;
  } catch (error) {
    if (!(error instanceof SyntaxError) && error.name !== 'SecurityError') throw error;
    storageNotice('La reprise des leçons est indisponible. Vos brouillons et statistiques utilisent des sauvegardes séparées.');
    return fresh;
  }
}
function saveLearningState() {
  try { localStorage.setItem(learningKey, JSON.stringify(learningState)); }
  catch (error) {
    if (!['SecurityError', 'QuotaExceededError'].includes(error.name)) throw error;
    storageNotice('La reprise de votre travail ne peut pas être enregistrée. Vos changements restent disponibles pendant cette ouverture.');
  }
}
function rememberActivity(type, id, step) {
  learningState.activity = { type, id, step };
  saveLearningState();
}
function rememberSentence(id, sentence) {
  learningState.sentences[id] = sentence;
  saveLearningState();
}
function renderResumeWork() {
  const activity = learningState.activity;
  node('resume-work').hidden = !activity;
  if (!activity) return;
  const catalog = activity.type === 'lesson' ? TENSE_COURSE : WRITING_WORKSHOPS;
  const title = catalog.find((entry) => entry.id === activity.id).title;
  node('resume-work').textContent = `Reprendre : ${title} · étape ${activity.step + 1} →`;
}
function resumeWork() {
  if (!learningState.activity) return;
  const activity = { ...learningState.activity };
  if (activity.type === 'lesson') {
    openLesson(activity.id);
    lessonStep = activity.step;
    renderLessonStep();
  } else {
    openWorkshop(activity.id);
    setWritingStep(activity.step);
  }
}
function openPaths() {
  node('paths-list').replaceChildren(...guidedPaths.map(pathCard));
  showPage('paths');
}
function pathCard(path) {
  const article = textElement('article', '', 'guided-path');
  article.append(textElement('span', `${path.lessons.length} LEÇONS + UN TEXTE`, 'eyebrow'), textElement('h2', path.title), textElement('p', path.intention));
  const steps = textElement('ol', '', 'path-stages');
  path.lessons.forEach((id, index) => {
    const lesson = TENSE_COURSE.find((entry) => entry.id === id);
    const score = learningState.results[id];
    const label = `${index + 1}. ${lesson.title}${score === undefined ? '' : ` · dernier essai ${score}/2`}`;
    steps.append(pathStep(label, () => { activatePath(path.id); openLesson(id); }));
  });
  steps.append(pathStep(`${path.lessons.length + 1}. Écrire mon texte →`, () => { activatePath(path.id); openWorkshop(path.workshop); }));
  article.append(steps, textElement('p', path.bridge, 'path-bridge'));
  return article;
}
function pathStep(label, action) {
  const step = document.createElement('li');
  const button = textElement('button', label);
  button.type = 'button';
  button.addEventListener('click', action);
  step.append(button);
  return step;
}
function activatePath(id) {
  activeGuidedPath = id;
  learningState.pathId = id;
  saveLearningState();
}
function recordCourseAttempt() {
  node('result-path').hidden = true;
  if (!session.courseId) return;
  learningState.results[session.courseId] = session.attempts.filter((attempt) => attempt.isCorrect).length;
  saveLearningState();
  const path = guidedPaths.find((entry) => entry.id === activeGuidedPath);
  node('result-path').hidden = !path || !path.lessons.includes(session.courseId);
  if (node('result-path').hidden) return;
  const nextId = path.lessons[path.lessons.indexOf(session.courseId) + 1];
  node('result-path').textContent = nextId ? 'Étape suivante du parcours →' : 'Passer à mon texte →';
}
onClick('result-path', () => {
  const path = guidedPaths.find((entry) => entry.id === activeGuidedPath);
  const nextId = path.lessons[path.lessons.indexOf(session.courseId) + 1];
  if (nextId) openLesson(nextId);
  else openWorkshop(path.workshop);
});
onClick('home-paths', openPaths);
onClick('nav-paths', openPaths);
onClick('course-paths', openPaths);
onClick('paths-back', () => showPage('home'));
onClick('resume-work', resumeWork);
renderResumeWork();
