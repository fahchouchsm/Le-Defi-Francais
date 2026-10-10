let writingWorkshop;
let writingDraft;
let writingStep = 0;
const draftCache = new Map();

function draftKey() { return `le-defi-francais-writing-${writingWorkshop.id}`; }
function loadDraft() {
  if (draftCache.has(draftKey())) return draftCache.get(draftKey());
  const fresh = { plan: ['', '', ''], text: '', original: null, checks: Array(5).fill(false) };
  try {
    const saved = JSON.parse(localStorage.getItem(draftKey()));
    if (!saved) return fresh;
    if (!Array.isArray(saved.plan) || saved.plan.length !== 3 || !saved.plan.every((line) => typeof line === 'string') || typeof saved.text !== 'string' || !(saved.original === null || typeof saved.original === 'string') || !Array.isArray(saved.checks) || saved.checks.length !== 5 || !saved.checks.every((checked) => typeof checked === 'boolean')) throw new SyntaxError('Invalid draft');
    return saved;
  } catch (error) {
    if (!(error instanceof SyntaxError) && error.name !== 'SecurityError') throw error;
    storageNotice('Ce brouillon ne peut pas être chargé. Vos autres ateliers restent disponibles.');
    return fresh;
  }
}
function saveDraft() {
  draftCache.set(draftKey(), writingDraft);
  try {
    localStorage.setItem(draftKey(), JSON.stringify(writingDraft));
    node('writing-save').textContent = 'Brouillon enregistré sur cet appareil';
  } catch (error) {
    if (!['SecurityError', 'QuotaExceededError'].includes(error.name)) throw error;
    node('writing-save').textContent = 'Enregistrement impossible : copiez votre texte avant de quitter.';
    storageNotice('Le brouillon reste à l’écran, mais ne peut pas être enregistré. Copiez-le avant de fermer ou changer d’atelier.');
  }
}
function openWriting() {
  node('writing-library').replaceChildren(...WRITING_WORKSHOPS.map((workshop) => {
    const button = textElement('button', '', 'course-card');
    button.type = 'button';
    button.dataset.workshopId = workshop.id;
    button.append(textElement('span', workshop.genre), textElement('strong', workshop.title), textElement('span', `${workshop.min}–${workshop.max} mots`), textElement('small', 'Ouvrir mon atelier →'));
    button.addEventListener('click', () => openWorkshop(workshop.id));
    return button;
  }));
  showPage('writing');
}
function openWorkshop(id) {
  writingWorkshop = WRITING_WORKSHOPS.find((workshop) => workshop.id === id);
  writingDraft = loadDraft();
  node('writer-title').textContent = writingWorkshop.title;
  node('writer-genre').textContent = writingWorkshop.genre;
  node('writer-target').textContent = `${writingWorkshop.min}–${writingWorkshop.max} mots`;
  node('writer-brief').textContent = writingWorkshop.brief;
  node('writer-goal').textContent = writingWorkshop.goal;
  writingWorkshop.plan.forEach((prompt, index) => { node(`plan-label-${index}`).textContent = prompt; node(`plan-${index}`).value = writingDraft.plan[index]; });
  node('writing-text').value = writingDraft.text;
  node('writing-save').textContent = writingDraft.text ? 'Brouillon retrouvé' : 'Enregistrement automatique pendant la saisie';
  node('writing-expressions').replaceChildren(...writingWorkshop.tools.map((phrase) => textElement('li', phrase)));
  renderWritingChecks();
  renderWritingModel();
  setWritingStep(writingDraft.text ? 1 : 0);
  showPage('writer');
}
function setWritingStep(step) {
  writingStep = step;
  rememberActivity('writing', writingWorkshop.id, step);
  if (step === 2 && writingDraft.original === null && writingDraft.text.trim()) { writingDraft.original = writingDraft.text; saveDraft(); }
  for (let index = 0; index < 3; index += 1) node(`writing-step-${index}`).setAttribute('aria-pressed', String(index === step));
  node('writing-plan').hidden = step !== 0;
  node('writing-workspace').hidden = step === 0;
  node('writing-support').hidden = step !== 1;
  node('writing-revision').hidden = step !== 2;
  node('writing-comparison').hidden = step !== 2;
  node('writing-text-label').textContent = step === 2 ? 'Votre version améliorée' : 'Votre premier jet';
  node('writing-original').textContent = writingDraft.original || 'Écrivez un premier jet avant de commencer la révision.';
  node('writer-previous').disabled = step === 0;
  node('writer-next').textContent = ['Passer au premier jet →', 'Relire et améliorer →', 'Enregistrer et revenir aux ateliers →'][step];
  node('writing-plan-preview').replaceChildren(...writingDraft.plan.map((line, index) => textElement('p', `${index + 1}. ${line || 'À préciser'}`)));
  renderWritingSignals();
}
function renderWritingChecks() {
  node('writing-checks').replaceChildren(...writingWorkshop.checklist.map((criterion, index) => {
    const label = textElement('label', '', 'writing-check');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = writingDraft.checks[index];
    checkbox.addEventListener('change', () => { writingDraft.checks[index] = checkbox.checked; saveDraft(); });
    label.append(checkbox, textElement('span', criterion));
    return label;
  }));
}
function renderWritingModel() {
  node('writing-model-details').open = false;
  node('writing-original-details').open = false;
  node('writing-model').replaceChildren(...writingWorkshop.model.map(([paragraph, note]) => {
    const section = textElement('article', '', 'model-paragraph');
    section.append(textElement('p', paragraph, 'preserve-lines'), textElement('p', note, 'model-note'));
    return section;
  }));
}
function renderWritingSignals() {
  const signals = WritingTools.inspect(writingDraft.text, writingWorkshop);
  node('writing-count').textContent = `${signals.words} mots · cible ${writingWorkshop.min}–${writingWorkshop.max}`;
  const length = { short: 'Texte plus court que la cible : vérifiez que chaque point de la consigne est développé.', long: 'Texte plus long que la cible : cherchez les répétitions et les détails secondaires.', target: 'Longueur dans la cible. Cela ne dit pas si la consigne est bien traitée.' };
  node('writing-signals').replaceChildren(textElement('p', length[signals.length]), textElement('p', `${signals.paragraphs} blocs séparés par une ligne vide. Vérifiez que chacun porte une idée.`), textElement('p', signals.connectors.length ? `Connecteurs repérés : ${signals.connectors.join(', ')}. Vérifiez qu’ils expriment bien la relation voulue.` : 'Aucun connecteur de notre petite liste repéré. Reliez vos idées quand c’est utile, sans en ajouter artificiellement.'));
}
for (let index = 0; index < 3; index += 1) {
  onClick(`writing-step-${index}`, () => setWritingStep(index));
  node(`plan-${index}`).addEventListener('input', () => { writingDraft.plan[index] = node(`plan-${index}`).value; saveDraft(); });
}
node('writing-text').addEventListener('input', () => {
  writingDraft.text = node('writing-text').value;
  if (writingDraft.checks.some(Boolean)) { writingDraft.checks = Array(5).fill(false); renderWritingChecks(); }
  saveDraft();
  renderWritingSignals();
});
onClick('nav-writing', openWriting);
onClick('writer-back', openWriting);
onClick('writer-previous', () => { if (writingStep > 0) setWritingStep(writingStep - 1); });
onClick('writer-next', () => { if (writingStep < 2) setWritingStep(writingStep + 1); else { saveDraft(); openWriting(); } });
