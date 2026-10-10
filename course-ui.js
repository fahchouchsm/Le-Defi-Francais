let selectedLesson = null;
let lessonStep = 0;
const lessonSentences = new Map(Object.entries(learningState.sentences));

function openCourses() {
  const groups = [...new Set(TENSE_COURSE.map((lesson) => lesson.group))];
  node('course-library').replaceChildren(...groups.map(courseGroup));
  showPage('course');
}
function courseGroup(group) {
  const section = textElement('section', '', 'course-group');
  section.append(textElement('h2', group));
  const cards = textElement('div', '', 'course-grid');
  for (const lesson of TENSE_COURSE.filter((entry) => entry.group === group)) {
    const button = textElement('button', '', 'course-card');
    button.type = 'button';
    button.dataset.lessonId = lesson.id;
    button.append(textElement('strong', lesson.title), textElement('span', lesson.subtitle), textElement('small', 'Comprendre →'));
    button.addEventListener('click', () => openLesson(lesson.id));
    cards.append(button);
  }
  section.append(cards);
  return section;
}
function openLesson(id) {
  selectedLesson = TENSE_COURSE.find((lesson) => lesson.id === id);
  lessonStep = 0;
  node('lesson-title').textContent = selectedLesson.title;
  node('lesson-group').textContent = selectedLesson.group;
  node('lesson-position').textContent = 'Comprendre · Écrire · Vérifier';
  renderLessonStep();
  showPage('lesson');
}
function scenePanel(lesson) {
  const panel = textElement('div', '', 'scene-panel');
  panel.append(textElement('span', 'IMAGINEZ LA SCÈNE', 'eyebrow'));
  const sequence = textElement('ol', '', 'scene-sequence');
  lesson.scene.forEach((line, index) => {
    sequence.append(textElement('li', line, index === 1 ? 'scene-action' : 'scene-context'));
  });
  panel.append(sequence);
  return panel;
}
function meaningStep(lesson) {
  const explanation = textElement('div', '', 'lesson-explanation');
  explanation.append(textElement('h2', lesson.subtitle), textElement('p', lesson.meaning));
  return [scenePanel(lesson), explanation];
}
function constructionStep(lesson) {
  const construction = textElement('div', '', 'construction-panel');
  construction.append(textElement('h2', 'Comment le former'), textElement('p', lesson.formula, 'tense-formula'));
  const forms = textElement('ul', '', 'forms-grid');
  lesson.forms.forEach((form) => forms.append(coloredForm(form)));
  construction.append(forms);
  construction.append(textElement('p', lesson.forms[0].endsWith(' parlé')
    ? 'À repérer : sujet · auxiliaire · participe passé.'
    : 'À repérer : sujet · radical · terminaison.', 'form-legend'));
  const reminder = textElement('details', '', 'lesson-trap');
  reminder.append(textElement('summary', 'Un piège à éviter'), textElement('p', lesson.trap));
  return [construction, reminder];
}
function coloredForm(form) {
  const line = textElement('li', '', 'colored-form');
  const stemStart = form.indexOf('parl');
  if (!form.endsWith(' parlé')) {
    line.append(textElement('span', form.slice(0, stemStart), 'form-subject'));
    line.append(textElement('span', 'parl', 'form-stem'));
    line.append(textElement('span', form.slice(stemStart + 4), 'form-ending'));
  } else {
    const parts = form.match(/^(.*?)([a-zàâäéèêëîïôöùûüç]+) ([^ ]+)$/u);
    line.append(textElement('span', parts[1], 'form-subject'));
    line.append(textElement('span', parts[2], 'form-auxiliary'));
    line.append(textElement('span', ` ${parts[3]}`, 'form-participle'));
  }
  return line;
}
function comparisonStep(lesson) {
  const panel = textElement('div', '', 'comparison-panel');
  panel.append(textElement('h2', 'Deux phrases. Deux regards.'));
  for (let index = 0; index < lesson.contrast.length; index += 2) {
    const pair = textElement('article', '', 'contrast-card');
    pair.append(textElement('h3', lesson.contrast[index]), textElement('p', lesson.contrast[index + 1]));
    panel.append(pair);
  }
  const invitation = textElement('aside', '', 'practice-invitation');
  invitation.append(textElement('span', 'À VOUS', 'eyebrow'), textElement('h3', 'Le sens, puis la forme.'), textElement('p', 'Deux questions pour vérifier ce que vous avez compris. Quatre choix à chaque fois, et une explication après votre réponse.'));
  return [panel, invitation];
}
function renderLessonStep() {
  rememberActivity('lesson', selectedLesson.id, lessonStep);
  const renderers = [meaningStep, constructionStep, comparisonStep, transferStep];
  node('lesson-content').replaceChildren(...renderers[lessonStep](selectedLesson));
  node('lesson-position').textContent = `Étape ${lessonStep + 1} sur 4 · ${['Comprendre', 'Construire', 'Distinguer', 'Réemployer'][lessonStep]}`;
  for (let index = 0; index < 4; index += 1) node(`lesson-step-${index}`).setAttribute('aria-pressed', String(index === lessonStep));
  node('lesson-previous').disabled = lessonStep === 0;
  node('lesson-next').textContent = ['Construire ce temps →', 'Voir la nuance →', 'Écrire ma phrase →', 'Vérifier avec deux questions →'][lessonStep];
}
function transferStep(lesson) {
  const [prompt, example, explanation] = TENSE_TRANSFER[lesson.id];
  const panel = textElement('div', '', 'construction-panel');
  panel.append(textElement('h2', 'Fermez la règle. Essayez.'), textElement('p', prompt));
  const label = textElement('label', 'Votre phrase (enregistrée sur cet appareil)');
  const input = document.createElement('textarea');
  input.rows = 4;
  input.maxLength = 1500;
  input.lang = 'fr';
  input.value = lessonSentences.get(lesson.id) || '';
  input.addEventListener('input', () => { lessonSentences.set(lesson.id, input.value); rememberSentence(lesson.id, input.value); });
  label.append(input);
  panel.append(label);
  const comparison = textElement('details', '', 'lesson-trap');
  comparison.append(textElement('summary', 'Comparer avec un exemple expliqué'), textElement('h3', example), textElement('p', explanation), textElement('p', 'Votre phrase peut être différente. Vérifiez le sens, le sujet, le temps et les accords. Cette comparaison ne corrige pas automatiquement votre texte.'));
  return [panel, comparison];
}
function startCoursePractice(id) {
  const pool = FRENCH_CARDS.filter((card) => card.courseId === id);
  session = { topic: 'Conjugaison', review: false, courseId: id, cards: pool.map((card) => FrenchQuiz.createRound([card])), index: 0, attempts: [] };
  presentQuestion();
}
for (const id of ['nav-course', 'home-course', 'lesson-back']) onClick(id, openCourses);
for (let index = 0; index < 4; index += 1) onClick(`lesson-step-${index}`, () => { lessonStep = index; renderLessonStep(); });
onClick('lesson-previous', () => { if (lessonStep > 0) { lessonStep -= 1; renderLessonStep(); } });
onClick('lesson-next', () => {
  if (lessonStep < 3) { lessonStep += 1; renderLessonStep(); }
  else startCoursePractice(selectedLesson.id);
});
