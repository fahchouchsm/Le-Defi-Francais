const levelSections = {
  grammar: {
    title: 'Grammaire', description: 'Construisez des phrases plus sûres, puis apprenez à les nuancer.',
    stages: [
      { title: 'Accords qui comptent', teach: 'Repérez le mot qui commande l’accord. Avec « avoir », le participe passé s’accorde quand le complément direct est placé avant le verbe.', example: 'Les lettres que j’ai écrites : « lettres » est placé avant « ai écrites ».', ids: ['agreement-participle', 'quelque-soit', 'couleur', 'demi'] },
      { title: 'Relier sans répéter', teach: 'Un pronom reprend une idée ou un nom. Cherchez d’abord la préposition du verbe : parler de → dont ; réfléchir à une chose → y.', example: 'Le dossier dont je parle ; cette idée, j’y réfléchis.', ids: ['relative-pronoun', 'pronoun-y', 'auxquelles', 'desquels'] },
      { title: 'Exprimer une réserve', teach: 'Une concession oppose deux faits sans annuler le second. « Malgré » introduit un nom ; « quoique » est suivi d’une proposition au subjonctif.', example: 'Malgré la pluie, elle sort. Quoique le ciel soit gris, elle sort.', ids: ['concession', 'avoir-beau', 'quoique', 'quoi-que'] },
    ],
    boss: ['agreement-participle', 'quelque-soit', 'relative-pronoun', 'auxquelles', 'concession', 'quoique'],
  },
  conjugation: {
    title: 'Conjugaison', description: 'Choisissez le temps selon le sens, pas seulement selon la terminaison.',
    stages: [
      { title: 'Placer l’action', teach: 'L’imparfait installe une habitude ou un décor ; le passé composé fait avancer l’action. Le futur annonce, le conditionnel imagine.', example: 'Je lisais quand elle est arrivée. Demain, je lirai ; si je pouvais, je lirais.', ids: ['imparfait', 'passe-compose', 'future', 'conditional'] },
      { title: 'Doute et hypothèse', teach: 'Après une nécessité, un doute ou « bien que », employez le subjonctif. Pour une hypothèse irréelle passée : si + plus-que-parfait, puis conditionnel passé.', example: 'Je doute qu’il vienne. Si tu avais appelé, nous aurions répondu.', ids: ['subjunctive-falloir', 'subjunctive-doubt', 'si-clause', 'bien-que'] },
      { title: 'Regarder en arrière', teach: 'Un temps composé relie deux moments. Le plus-que-parfait précède un fait passé ; le futur antérieur précède un fait futur.', example: 'Elle était partie quand je suis arrivé. Dès que tu auras fini, appelle-moi.', ids: ['plusqueparfait', 'conditionnel-passe', 'future-anterior', 'past-subjunctive'] },
    ],
    boss: ['imparfait', 'conditional', 'subjunctive-doubt', 'si-clause', 'plusqueparfait', 'future-anterior'],
  },
  vocabulary: {
    title: 'Vocabulaire', description: 'Distinguez les mots proches et choisissez celui qui dit exactement votre idée.',
    stages: [
      { title: 'Déjouer les ressemblances', teach: 'Des mots presque identiques peuvent changer entièrement le sens. Appuyez-vous sur le contexte et reformulez avant de choisir.', example: 'Un juge partial favorise un camp ; un résultat partiel est incomplet.', ids: ['venimeux', 'partial', 'differend', 'conjecture'] },
      { title: 'Nommer précisément', teach: 'Un mot précis remplace une longue explication. Reliez-le à une définition courte et à une situation concrète pour le retenir.', example: 'Un accord tacite n’est pas formulé, mais chacun l’a compris.', ids: ['reticent', 'tacite', 'obsolescence', 'corroborer'] },
      { title: 'Saisir la nuance', teach: 'Les expressions soutenues portent une relation logique : ressemblance, intensification ou prévention. Lisez la phrase entière avant de répondre.', example: '« Voire » signifie « et même » ; « à l’instar de » signifie « comme ».', ids: ['lexical-precision', 'a-linstar', 'voire', 'obvier'] },
    ],
    boss: ['venimeux', 'partial', 'reticent', 'tacite', 'voire', 'obvier'],
  },
};

function levelKey(section, stage) { return `${section}-${stage === 3 ? 'boss' : stage + 1}`; }
function levelUnlocked(section, stage) { return stage === 0 || progress.levels[levelKey(section, stage - 1)] === true; }

function openLevels(section) {
  const track = levelSections[section];
  if (!track) return;
  node('levels-page').dataset.section = section;
  node('levels-title').textContent = track.title;
  node('levels-description').textContent = track.description;
  const passed = [0, 1, 2, 3].filter((stage) => progress.levels[levelKey(section, stage)]).length;
  node('levels-progress').textContent = `${passed} / 4 étapes réussies`;
  node('levels-progress-bar').value = passed;
  node('levels-list').replaceChildren(...[...track.stages, { title: 'Le boss final', teach: 'Mélangez les trois niveaux sans indice supplémentaire. Cinq bonnes réponses sur six valident la section.', example: 'Prenez votre temps : la correction reste disponible après chaque réponse.', ids: track.boss }].map((stage, index) => levelCard(section, stage, index)));
  showPage('levels');
}
function levelCard(section, stage, index) {
  const passed = progress.levels[levelKey(section, index)] === true;
  const unlocked = levelUnlocked(section, index);
  const article = textElement('article', '', `level-card${index === 3 ? ' level-boss' : ''}`);
  article.append(textElement('span', index === 3 ? 'DÉFI FINAL · BOSS' : `NIVEAU ${index + 1} · 4 QUESTIONS`, 'eyebrow'), textElement('h2', stage.title), textElement('p', stage.teach, 'level-teach'), textElement('p', stage.example, 'level-example'), textElement('span', passed ? '✓ Réussi' : unlocked ? 'Prêt à commencer' : 'À débloquer', 'level-status'));
  const button = textElement('button', passed ? 'Rejouer →' : unlocked ? index === 3 ? 'Affronter le boss →' : 'Commencer ce niveau →' : 'Terminez le niveau précédent', unlocked ? 'primary' : 'level-locked');
  button.type = 'button'; button.disabled = !unlocked;
  button.addEventListener('click', () => startLevel(section, index));
  article.append(button);
  return article;
}
function startLevel(section, stage) {
  const track = levelSections[section];
  if (!track || !Number.isInteger(stage) || stage < 0 || stage > 3 || !levelUnlocked(section, stage)) return;
  const ids = stage === 3 ? track.boss : track.stages[stage].ids;
  session = { topic: track.title, review: false, level: { section, stage }, cards: ids.map((id) => FrenchQuiz.createRound([FRENCH_CARDS.find((card) => card.id === id)])), index: 0, attempts: [] };
  presentQuestion();
}
function recordLevelAttempt(correct) {
  const { section, stage } = session.level;
  const needed = stage === 3 ? 5 : 3;
  const passed = correct >= needed;
  if (passed) {
    progress.levels = { ...progress.levels, [levelKey(section, stage)]: true };
    saveProgress();
  }
  node('results-title').textContent = passed ? stage === 3 ? 'Boss vaincu.' : 'Niveau réussi.' : 'Encore un essai.';
  node('result-message').textContent = passed
    ? stage === 3 ? 'Section terminée ! Vous pouvez rejouer les niveaux pour consolider vos acquis.' : stage === 2 ? 'Boss débloqué ! Les trois niveaux sont réussis.' : `Niveau ${stage + 2} débloqué ! Continuez quand vous voulez.`
    : `${correct} / ${session.cards.length} réponses justes. Il en faut ${needed} pour passer : relisez les explications et réessayez.`;
  node('result-repeat').textContent = stage === 3 ? 'Rejouer le boss →' : 'Réessayer ce niveau →';
}
onClick('levels-back', () => showPage('home'));
onClick('result-level-next', () => { if (session.journey === journeyStages.length - 1 && progress.journey[journeyStages.length]) openJourneyTcfExam(); else if (session.journey !== undefined) showPage('home'); else openLevels(session.level.section); });
