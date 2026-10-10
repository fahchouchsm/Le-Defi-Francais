const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const {
  createRound,
  evaluateChoice,
  updateProgress,
} = require('../quiz-engine');

const cards = [
  { id: 'subjunctive', prompt: 'Il faut que tu ___ avant midi.', answer: 'finisses', choices: ['finis', 'finisses', 'finirais', 'finissant'] },
  { id: 'register', prompt: 'Je vous prie d’___, Madame, mes salutations distinguées.', answer: 'agréer', choices: ['agréez', 'agréer', 'agréé', 'agréiez'] },
];

test('createRound always exposes exactly four unique French choices', () => {
  const round = createRound(cards, () => 0);

  assert.equal(round.choices.length, 4);
  assert.equal(new Set(round.choices).size, 4);
  assert.equal(round.answer, 'finisses');
});

test('evaluateChoice shows the complete French correction after a mistake', () => {
  const result = evaluateChoice(cards[0], 'finis');

  assert.deepEqual(result, {
    isCorrect: false,
    correction: 'Il faut que tu finisses avant midi.',
  });
});

test('evaluateChoice confirms the right French answer after a correct choice', () => {
  const result = evaluateChoice(cards[1], 'agréer');

  assert.deepEqual(result, {
    isCorrect: true,
    correction: 'Je vous prie d’agréer, Madame, mes salutations distinguées.',
  });
});

test('updateProgress schedules mistakes sooner and increases the streak only for a correct choice', () => {
  const afterMistake = updateProgress({ streak: 4, mistakes: [] }, cards[0], false);
  const afterCorrect = updateProgress(afterMistake, cards[1], true);

  assert.deepEqual(afterMistake, { streak: 0, mistakes: ['subjunctive'] });
  assert.deepEqual(afterCorrect, { streak: 1, mistakes: ['subjunctive'] });
});

test('all learning cards have unique IDs, four distinct options and one correct answer', () => {
  const context = {};
  context.window = context;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../questions.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../lessons.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../advanced-lessons.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../situations.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../tense-course.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../reading-situations.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../journey-extra.js'), 'utf8'), context);
  const bank = context.window.FRENCH_CARDS;
  assert.equal(bank.length, 300);
  assert.equal(vm.runInNewContext('JOURNEY_EXTRA.length', context), 24);
  assert.ok(vm.runInNewContext('JOURNEY_EXTRA.every(level => level[1].length === 4)', context));
  assert.equal(bank.filter((card) => card.id.startsWith('deep-')).length, 96);
  assert.ok(bank.filter((card) => card.id.startsWith('deep-')).every((card) => card.explanation.length >= 60));
  assert.equal(context.TENSE_COURSE.length, 15);
  for (const lesson of context.TENSE_COURSE) {
    assert.ok(lesson.meaning.length > 60);
    assert.equal(lesson.scene.length, 3);
    assert.equal(lesson.contrast.length, 4);
    assert.ok([3, 6].includes(lesson.forms.length));
    assert.equal(bank.filter((card) => card.courseId === lesson.id).length, 2);
  }
  assert.equal(new Set(bank.map((card) => card.prompt)).size, bank.length);
  assert.equal(new Set(bank.map((card) => card.id)).size, bank.length);
  for (const card of bank) {
    assert.equal(card.choices.length, 4, card.id);
    assert.equal(new Set(card.choices).size, 4, card.id);
    assert.equal(card.choices.filter((choice) => choice === card.answer).length, 1, card.id);
    assert.ok(!evaluateChoice(card, card.answer).correction.includes('___'), card.id);
    assert.ok(card.explanation.length > 30, card.id);
    assert.ok(['Grammaire', 'Conjugaison', 'Vocabulaire'].includes(card.topic), card.id);
  }
});

test('topic and review filters intersect and an empty review stays empty', () => {
  const { filterCards } = require('../quiz-engine');
  const pool = [{ id: 'a', topic: 'Grammaire' }, { id: 'b', topic: 'Vocabulaire' }];
  assert.equal(filterCards(pool, 'all', null).length, 2);
  assert.deepEqual(filterCards(pool, 'Grammaire', null), [pool[0]]);
  assert.deepEqual(filterCards(pool, 'Grammaire', ['b']), []);
  assert.deepEqual(filterCards(pool, 'all', []), []);
  assert.deepEqual(filterCards(pool, 'all', ['b']), [pool[1]]);
});

test('correctly answering a review removes that card and mistakes do not duplicate', () => {
  const missed = updateProgress({ streak: 0, mistakes: ['subjunctive'] }, cards[0], false);
  assert.equal(missed.mistakes.length, 1);
  assert.deepEqual(updateProgress(missed, cards[0], true), { streak: 1, mistakes: [] });
});

test('review selection prioritizes missed cards but still permits other questions', () => {
  assert.equal(createRound(cards, () => 0, ['register']).id, 'register');
  let calls = 0;
  const sample = () => calls++ === 0 ? 0.9 : 0;
  assert.equal(createRound(cards, sample, ['register']).id, 'subjunctive');
});
