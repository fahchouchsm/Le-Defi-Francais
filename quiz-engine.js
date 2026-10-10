(function attachQuizEngine(globalScope) {
  function shuffle(items, random = Math.random) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function createRound(cards, random = Math.random, priorityIds = []) {
    const priorityCards = cards.filter((card) => priorityIds.includes(card.id));
    const pool = priorityCards.length && random() < 0.4 ? priorityCards : cards;
    const card = pool[Math.floor(random() * pool.length)];
    return { ...card, choices: shuffle(card.choices, random) };
  }

  function evaluateChoice(card, choice) {
    return {
      isCorrect: choice === card.answer,
      correction: card.completed || card.prompt.replace('___', card.answer),
    };
  }

  function updateProgress(progress, card, isCorrect) {
    const mistakes = isCorrect
      ? progress.mistakes.filter((id) => id !== card.id)
      : [...new Set([...progress.mistakes, card.id])];

    return {
      streak: isCorrect ? progress.streak + 1 : 0,
      mistakes,
    };
  }

  function filterCards(cards, topic, reviewIds) {
    return cards.filter((card) => (topic === 'all' || card.topic === topic)
      && (reviewIds === null || reviewIds.includes(card.id)));
  }

  const api = { createRound, evaluateChoice, updateProgress, filterCards };
  if (typeof module !== 'undefined') module.exports = api;
  globalScope.FrenchQuiz = api;
}(typeof window !== 'undefined' ? window : globalThis));
