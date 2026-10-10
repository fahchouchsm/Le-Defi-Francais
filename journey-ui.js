const journeyChapters = [
  { name: 'Les bases', note: 'Comprendre le temps et construire une phrase claire.', stages: [
    { title: 'Parler d’aujourd’hui', teach: 'Le présent dit ce qui se passe ou se répète. Le passé composé raconte un événement achevé.', example: 'Aujourd’hui, je parle. Hier, j’ai parlé.', lesson: 'present', ids: ['course-present-0', 'course-present-1', 'course-passe-compose-0', 'course-passe-compose-1', 'situation-present-envoyer', 'situation-venir-de', 'passe-compose', 'contrast-0-0'] },
    { title: 'Raconter hier et demain', teach: 'L’imparfait pose le décor ; le passé composé fait avancer le récit. Le futur simple annonce la suite.', example: 'Je lisais quand elle est arrivée. Demain, je lirai.', lesson: 'imparfait', ids: ['course-imparfait-0', 'course-imparfait-1', 'course-futur-simple-0', 'course-futur-simple-1', 'imparfait', 'future', 'situation-si-futur', 'contrast-0-2'] },
    { title: 'Exprimer une possibilité', teach: 'Le conditionnel sert à imaginer ou conseiller. L’impératif invite quelqu’un à agir.', example: 'Je viendrais si je pouvais. Viens demain !', lesson: 'conditionnel-present', ids: ['course-conditionnel-present-0', 'course-conditionnel-present-1', 'course-imperatif-0', 'course-imperatif-1', 'conditional', 'imperative', 'contrast-0-3', 'situation-regret-reservation'] },
    { title: 'Final · Les bases', teach: 'Seize questions mêlent le présent, le passé, le futur et le conditionnel. Treize bonnes réponses valident ce chapitre.', ids: ['course-present-0', 'course-passe-compose-1', 'situation-present-envoyer', 'passe-compose', 'course-imparfait-0', 'course-futur-simple-1', 'imparfait', 'situation-si-futur', 'course-conditionnel-present-0', 'course-imperatif-1', 'conditional', 'imperative'], boss: true },
  ] },
  { name: 'Les bons réflexes', note: 'Accords, temps et vocabulaire utiles au quotidien.', stages: [
    { ...levelSections.grammar.stages[0], lesson: 'passe-compose', ids: [...levelSections.grammar.stages[0].ids, 'pronominal-agreement', 'fait-infinitif', 'rendu-compte', 'situation-quel-que-prix'] },
    { ...levelSections.conjugation.stages[0], lesson: 'imparfait', ids: [...levelSections.conjugation.stages[0].ids, 'contrast-1-1', 'contrast-1-2', 'contrast-1-3', 'situation-si-futur'] },
    { ...levelSections.vocabulary.stages[0], writing: 'recit', ids: [...levelSections.vocabulary.stages[0].ids, 'situation-devis-facture', 'situation-reporter-rdv', 'situation-ecart-prix', 'situation-relancer'] },
    { title: 'Final · Les réflexes', teach: 'Seize questions croisent accords, temps et vocabulaire en situation. Treize bonnes réponses valident ce chapitre.', ids: ['agreement-participle', 'quelque-soit', 'pronominal-agreement', 'situation-quel-que-prix', 'imparfait', 'passe-compose', 'contrast-1-2', 'situation-si-futur', 'venimeux', 'partial', 'situation-devis-facture', 'situation-reporter-rdv'], boss: true },
  ] },
  { name: 'Faire des liens', note: 'Relier, nuancer et choisir le mot précis.', stages: [
    { ...levelSections.grammar.stages[1], lesson: 'subjonctif-present', ids: [...levelSections.grammar.stages[1].ids, 'situation-dont-besoin', 'situation-les-voir', 'situation-leur-ecrire', 'double-pronoun'] },
    { ...levelSections.conjugation.stages[1], lesson: 'conditionnel-passe', ids: [...levelSections.conjugation.stages[1].ids, 'course-subjonctif-present-0', 'course-subjonctif-present-1', 'course-conditionnel-passe-0', 'course-conditionnel-passe-1'] },
    { ...levelSections.vocabulary.stages[1], writing: 'courriel', ids: [...levelSections.vocabulary.stages[1].ids, 'situation-sous-reserve', 'situation-en-amont', 'situation-a-defaut', 'situation-prendre-acte'] },
    { title: 'Final · Les nuances', teach: 'Seize questions mêlent pronoms, hypothèses, subjonctif et sens précis. Treize bonnes réponses valident ce chapitre.', ids: ['relative-pronoun', 'pronoun-y', 'situation-dont-besoin', 'double-pronoun', 'subjunctive-doubt', 'si-clause', 'course-subjonctif-present-0', 'course-conditionnel-passe-1', 'reticent', 'tacite', 'situation-sous-reserve', 'situation-en-amont'], boss: true },
  ] },
  { name: 'Cap sur le B2', note: 'Défendre une idée, comprendre l’implicite et se préparer au test.', stages: [
    { ...levelSections.grammar.stages[2], writing: 'opinion', ids: [...levelSections.grammar.stages[2].ids, 'situation-sous-reserve', 'situation-malgre-nom', 'situation-sans-que', 'connective'] },
    { ...levelSections.conjugation.stages[2], lesson: 'futur-anterieur', ids: [...levelSections.conjugation.stages[2].ids, 'course-plus-que-parfait-0', 'course-plus-que-parfait-1', 'course-futur-anterieur-0', 'course-futur-anterieur-1'] },
    { ...levelSections.vocabulary.stages[2], tcf: true, ids: [...levelSections.vocabulary.stages[2].ids, 'prolixe', 'idiom', 'situation-gre', 'situation-resilier'] },
    { title: 'Final · Cap sur le B2', teach: 'Seize questions réinvestissent les concessions, les temps composés et le vocabulaire de ce chapitre. Treize bonnes réponses le valident.', ids: ['concession', 'quoique', 'avoir-beau', 'situation-malgre-nom', 'plusqueparfait', 'future-anterior', 'course-plus-que-parfait-0', 'course-futur-anterieur-1', 'voire', 'obvier', 'prolixe', 'situation-gre'], boss: true, tcf: true },
  ] },
  { name: 'Lire avec précision', note: 'Identifier l’idée, la réserve et les conditions d’un texte.', stages: [
    { title: 'Repérer l’essentiel', teach: 'Distinguez ce qui change de ce qui reste vrai. Les mots « mais » et « pourtant » signalent souvent le cœur du message.', example: '« Gratuit, mais sur réservation » : le prix ne change pas ; l’accès, si.', ids: ['reading-r1', 'reading-r2', 'reading-r3', 'reading-r4', 'situation-sous-reserve', 'situation-reporter-rdv', 'partial', 'connective'] },
    { title: 'Lire entre les lignes', teach: 'Une réserve n’annule pas une idée. Repérez les quantités et le degré de certitude : « la plupart » ne signifie pas « tous ».', example: 'Une première étape peut être utile sans résoudre tous les problèmes.', ids: ['reading-r5', 'reading-r6', 'reading-r7', 'reading-r8', 'situation-prendre-acte', 'tacite', 'reticent', 'situation-a-defaut'] },
    { title: 'Suivre une consigne', teach: 'Dans une annonce, cherchez les conditions, les exceptions et la date limite. Ne confondez pas dépôt et acceptation.', example: 'Un dossier déposé à temps peut encore devoir être examiné.', ids: ['reading-r9', 'reading-r10', 'reading-r11', 'reading-r12', 'situation-devis-facture', 'situation-ecart-prix', 'situation-resilier', 'situation-en-amont'] },
    { title: 'Final · Lecture précise', teach: 'Seize mini-textes et situations : retrouvez l’idée, la réserve et les conditions sans ajouter d’hypothèse. Treize bonnes réponses valident le chapitre.', ids: ['reading-r1', 'reading-r2', 'reading-r3', 'reading-r4', 'reading-r5', 'reading-r6', 'reading-r7', 'reading-r8', 'reading-r9', 'reading-r10', 'reading-r11', 'reading-r12'], boss: true },
  ] },
  { name: 'Répondre et argumenter', note: 'Choisir le registre, défendre une position et synthétiser.', stages: [
    { title: 'Répondre avec tact', teach: 'Une bonne réponse professionnelle est claire, polie et utile : elle précise le problème et propose une suite.', example: 'Je ne suis pas disponible mardi ; jeudi vous conviendrait-il ?', writing: 'courriel', ids: ['reading-r13', 'reading-r14', 'reading-r15', 'reading-r16', 'situation-relancer', 'situation-remercier-de', 'situation-gre', 'situation-sous-reserve'] },
    { title: 'Défendre une idée', teach: 'Position, raison, exemple, objection, conclusion : chaque phrase a un rôle dans une argumentation B2.', example: 'Certes, cela coûte cher ; néanmoins, le bénéfice peut durer.', writing: 'opinion', ids: ['reading-r17', 'reading-r18', 'reading-r19', 'reading-r20', 'concession', 'connective', 'avoir-beau', 'situation-malgre-nom'] },
    { title: 'Comparer et déduire', teach: 'Comparez deux points de vue sans leur prêter une conclusion qu’ils ne donnent pas. Une cause doit être démontrée.', example: 'Les recettes stagnent : on ne peut pas en déduire pourquoi.', tcf: true, ids: ['reading-r21', 'reading-r22', 'reading-r23', 'reading-r24', 'situation-prendre-acte', 'situation-a-defaut', 'reticent', 'tacite'] },
    { title: 'Grand final TCF', teach: 'Vingt questions croisent compréhension, langue et argumentation. Dix-sept bonnes réponses débloquent le test blanc de 80 questions avec audio.', ids: ['reading-r13', 'reading-r14', 'reading-r15', 'reading-r16', 'reading-r17', 'reading-r18', 'reading-r19', 'reading-r20', 'reading-r21', 'reading-r22', 'reading-r23', 'reading-r24', 'reading-r7', 'reading-r10', 'concession', 'si-clause'], boss: true, tcf: true },
  ] },
];
const journeyStages = journeyChapters.flatMap((chapter, chapterIndex) => chapter.stages.map((stage, stageIndex) => {
  const level = chapterIndex * 4 + stageIndex + 1;
  return { ...stage, ids: [...stage.ids, ...JOURNEY_EXTRA[level - 1][1].map((_, index) => `deep-${level}-${index + 1}`)], chapter: chapter.name, chapterNote: chapter.note, chapterIndex, stageIndex };
}));
let selectedJourney = 0;

function journeyPassed(index) { return progress.journey?.[index + 1] === true; }
function journeyUnlocked(index) { return index === 0 || journeyPassed(index - 1); }
function journeyCurrent() {
  const next = journeyStages.findIndex((stage, index) => !journeyPassed(index));
  return next < 0 ? journeyStages.length - 1 : next;
}
function renderJourney() {
  const passed = journeyStages.filter((stage, index) => journeyPassed(index)).length;
  node('journey-count').textContent = `${passed} / ${journeyStages.length}`;
  node('journey-progress').value = passed;
  node('journey-progress-ring').setAttribute('style', `--journey-sweep:${passed / journeyStages.length * 360}deg`);
  const finalPassed = journeyPassed(journeyStages.length - 1);
  node('journey-tcf-final').disabled = !finalPassed;
  node('journey-tcf-status').textContent = finalPassed ? 'Débloqué · lancer les 80 questions →' : 'Terminez le grand final pour débloquer ce test';
  selectJourney(journeyCurrent());
}
function selectJourney(index) {
  if (!journeyUnlocked(index)) return;
  selectedJourney = index;
  const stage = journeyStages[index];
  node('journey-next-label').textContent = `Chapitre ${stage.chapterIndex + 1} · ${stage.chapter}`;
  node('journey-current-number').textContent = String(index + 1).padStart(2, '0');
  node('journey-level-label').textContent = `NIVEAU ${index + 1} / ${journeyStages.length} · ${stage.boss ? 'FINAL' : `${stage.ids.length} QUESTIONS`}`;
  node('journey-heading').textContent = stage.title;
  node('journey-teach').textContent = stage.teach;
  node('journey-example').textContent = stage.example || '';
  node('journey-example').hidden = !stage.example;
  const links = [];
  if (stage.lesson) links.push(journeyTool('Voir la leçon →', () => openLesson(stage.lesson)));
  if (stage.writing) links.push(journeyTool('Atelier d’écriture →', () => openWorkshop(stage.writing)));
  if (stage.tcf) links.push(journeyTool('Préparer le TCF →', openTcf));
  node('journey-context').replaceChildren(...links);
  node('journey-continue').textContent = `${journeyPassed(index) ? 'Rejouer' : stage.boss ? 'Passer le final' : 'Commencer'} · niveau ${index + 1} →`;
  node('journey-list').replaceChildren(...journeyStages.map(journeyCard));
}
function journeyCard(stage, index) {
  const passed = journeyPassed(index);
  const unlocked = journeyUnlocked(index);
  const card = textElement('article', '', `journey-card${stage.boss ? ' journey-boss' : ''}${index === selectedJourney ? ' journey-current' : ''}${!unlocked ? ' journey-locked' : ''}${passed ? ' journey-passed' : ''}`);
  card.dataset.level = String(index + 1);
  card.setAttribute('style', `--map-row:${Math.floor(index / 2) + 1};--map-column:${index % 4 === 0 || index % 4 === 3 ? 1 : 2}`);
  if (stage.stageIndex === 0) card.append(textElement('span', `CHAPITRE ${stage.chapterIndex + 1} · ${stage.chapter}`, 'journey-chapter'));
  const button = textElement('button', '', 'journey-node');
  button.type = 'button'; button.disabled = !unlocked;
  button.setAttribute('aria-label', `Niveau ${index + 1}, ${stage.title}, ${stage.ids.length} questions${passed ? ', réussi' : unlocked ? ', disponible' : ', verrouillé'}`);
  button.setAttribute('aria-pressed', String(index === selectedJourney));
  button.append(textElement('span', passed ? '✓' : stage.boss ? '★' : String(index + 1).padStart(2, '0'), 'journey-node-mark'), textElement('span', stage.title, 'journey-node-title'), textElement('span', passed ? 'Réussi' : unlocked ? stage.boss ? 'Final disponible' : 'Disponible' : stage.boss ? 'Final verrouillé' : 'À débloquer', 'journey-node-status'));
  button.addEventListener('click', () => { selectJourney(index); node('journey-heading').scrollIntoView?.({ behavior: 'smooth', block: 'center' }); });
  card.append(button);
  return card;
}
function journeyTool(label, action) {
  const button = textElement('button', label, 'text-button');
  button.type = 'button'; button.addEventListener('click', action);
  return button;
}
function startJourneyLevel(index) {
  if (!Number.isInteger(index) || !journeyStages[index] || !journeyUnlocked(index)) return;
  const stage = journeyStages[index];
  session = { topic: stage.chapter, review: false, journey: index, cards: stage.ids.map((id) => {
    const card = FRENCH_CARDS.find((entry) => entry.id === id);
    if (!card) throw new Error(`Question manquante : ${id}`);
    return FrenchQuiz.createRound([card]);
  }), index: 0, attempts: [] };
  presentQuestion();
}
function recordJourneyAttempt(correct) {
  const index = session.journey;
  const stage = journeyStages[index];
  const needed = stage.boss ? index === journeyStages.length - 1 ? 17 : 13 : 9;
  const passed = correct >= needed;
  if (passed) {
    progress.journey = { ...progress.journey, [index + 1]: true };
    saveProgress();
  }
  node('results-title').textContent = passed ? stage.boss ? index === journeyStages.length - 1 ? 'Grand final réussi.' : 'Chapitre validé.' : 'Niveau réussi.' : 'Encore un essai.';
  node('result-message').textContent = passed ? index === journeyStages.length - 1 ? 'Le test blanc TCF est débloqué : 80 questions, des livrets et leurs enregistrements hors connexion. Ce parcours ne garantit pas un score officiel.' : stage.boss ? `Chapitre ${stage.chapterIndex + 1} terminé ! Le niveau ${index + 2} est débloqué.` : `Niveau ${index + 2} débloqué ! Continuez à votre rythme.` : `${correct} / ${session.cards.length} réponses justes. Il en faut ${needed} pour avancer. Relisez les explications et réessayez.`;
  node('result-repeat').textContent = stage.boss ? 'Rejouer ce final →' : 'Réessayer ce niveau →';
  node('result-level-next').textContent = passed && index === journeyStages.length - 1 ? 'Lancer l’examen blanc TCF →' : 'Retour au parcours →';
}
function openJourneyTcfExam() { openTcf(); openTcfExam(); }
onClick('journey-continue', () => startJourneyLevel(selectedJourney));
onClick('journey-tcf-final', openJourneyTcfExam);
onClick('journey-courses', openCourses);
onClick('journey-writing', openWriting);
onClick('journey-notebook', openNotebook);
onClick('journey-stats', openProgress);
onClick('journey-tcf', openTcf);
renderJourney();
