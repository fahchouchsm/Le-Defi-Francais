// Six distinct tense contrasts per verb train the forms most easily confused.
const tenseContrasts = [
  { name: 'présent de l’indicatif', subject: 'nous', rule: 'Le présent de l’indicatif situe ici l’action dans le présent.' },
  { name: 'imparfait de l’indicatif', subject: 'nous', rule: 'L’imparfait se forme généralement sur le radical de « nous » au présent, avec la terminaison « -ions ».' },
  { name: 'futur simple', subject: 'nous', rule: 'Le futur simple utilise le radical du futur et la terminaison « -ons ». Attention aux radicaux irréguliers.' },
  { name: 'conditionnel présent', subject: 'nous', rule: 'Le conditionnel présent combine le radical du futur avec la terminaison « -ions » de l’imparfait.' },
  { name: 'passé simple', subject: 'nous', rule: 'Le passé simple est surtout employé dans le récit écrit. À « nous », sa terminaison porte un accent circonflexe.' },
  { name: 'subjonctif présent', subject: 'ils', rule: 'Après « il faut que », le subjonctif exprime la nécessité, et non un fait présenté comme certain.' },
];
const conjugationContrasts = [
  ['résoudre', 'ce problème', ['résolvons', 'résolvions', 'résoudrons', 'résoudrions', 'résolûmes', 'résolvent']],
  ['recevoir', 'les candidats', ['recevons', 'recevions', 'recevrons', 'recevrions', 'reçûmes', 'reçoivent']],
  ['apercevoir', 'la côte', ['apercevons', 'apercevions', 'apercevrons', 'apercevrions', 'aperçûmes', 'aperçoivent']],
  ['craindre', 'une pénurie', ['craignons', 'craignions', 'craindrons', 'craindrions', 'craignîmes', 'craignent']],
  ['joindre', 'les deux documents', ['joignons', 'joignions', 'joindrons', 'joindrions', 'joignîmes', 'joignent']],
  ['vaincre', 'ces résistances', ['vainquons', 'vainquions', 'vaincrons', 'vaincrions', 'vainquîmes', 'vainquent']],
  ['prévoir', 'un délai', ['prévoyons', 'prévoyions', 'prévoirons', 'prévoirions', 'prévîmes', 'prévoient']],
  ['soutenir', 'cette initiative', ['soutenons', 'soutenions', 'soutiendrons', 'soutiendrions', 'soutînmes', 'soutiennent']],
];

const contrastCards = conjugationContrasts.flatMap(([verb, complement, forms], verbIndex) =>
  tenseContrasts.map((tense, tenseIndex) => {
    const answer = forms[tenseIndex];
    const beginning = tenseIndex === 5 ? 'Il faut qu’ils' : 'Nous';
    const distractors = tenseIndex === 5
      ? [forms[2].replace(/ons$/, 'ont'), forms[3].replace(/ions$/, 'aient'), forms[1].replace(/ions$/, 'aient')]
      : forms.filter((form, index) => index !== tenseIndex && index !== 5).slice(0, 3);
    return {
      id: `contrast-${verbIndex}-${tenseIndex}`, topic: 'Conjugaison', level: `Contrastes · ${tense.name}`,
      prompt: `« ${verb} » au ${tense.name} : ${beginning.toLowerCase()} ___ ${complement}.`,
      answer, choices: [answer, ...distractors], completed: `${beginning} ${answer} ${complement}.`,
      explanation: `${tense.rule} La forme attendue est « ${tense.subject} ${answer} ».`,
    };
  })
);

const nuanceLessons = [
  ['tout-adverb', 'Grammaire', 'Elles sont ___ étonnées de cette nouvelle. (tout = entièrement)', 'tout', ['toutes', 'toute', 'tous'], '« Tout », adverbe signifiant entièrement, reste invariable devant un adjectif féminin commençant par une voyelle.'],
  ['tout-consonant', 'Grammaire', 'Elles sont ___ petites. (tout = très)', 'toutes', ['tout', 'tous', 'toute'], 'L’adverbe « tout » s’accorde exceptionnellement devant un adjectif féminin commençant par une consonne : toutes petites.'],
  ['demi', 'Grammaire', 'La réunion a duré deux heures et ___.', 'demie', ['demi', 'demies', 'demis'], 'Après un nom, « demi » s’accorde en genre, mais pas en nombre : deux heures et demie.'],
  ['nu', 'Grammaire', 'Elle marche ___ sur le sable.', 'nu-pieds', ['nus-pieds', 'nue-pieds', 'nues-pieds'], 'Placé avant le nom, « nu » reste invariable et se lie par un trait d’union : nu-pieds.'],
  ['couleur', 'Grammaire', 'Elle porte des chaussures ___. (couleur orange)', 'orange', ['oranges', 'orangent', 'orangés'], 'Un nom employé comme adjectif de couleur reste généralement invariable : des chaussures orange.'],
  ['bleu-clair', 'Grammaire', 'Ils ont choisi des rideaux ___. (bleu clair)', 'bleu clair', ['bleus clairs', 'bleus clair', 'bleu clairs'], 'Les adjectifs de couleur composés restent invariables : des rideaux bleu clair.'],
  ['ci-joint', 'Grammaire', 'Veuillez consulter les pièces ___.', 'ci-jointes', ['ci-joint', 'ci-jointe', 'ci-joints'], 'Après le nom, « ci-joint » est adjectif et s’accorde : les pièces ci-jointes.'],
  ['fait-infinitif', 'Grammaire', 'Les robes qu’elle a ___ confectionner sont prêtes.', 'fait', ['faites', 'faite', 'faits'], 'Le participe passé « fait » suivi d’un infinitif est toujours invariable : les robes qu’elle a fait confectionner.'],
  ['rendu-compte', 'Grammaire', 'Elles se sont ___ compte de leur erreur.', 'rendu', ['rendues', 'rendus', 'rendue'], 'Dans « se rendre compte », « compte » est le COD placé après le verbe. « Rendu » reste invariable.'],
  ['succeder', 'Grammaire', 'Les crises se sont ___ pendant dix ans.', 'succédé', ['succédées', 'succédés', 'succédée'], 'On succède à quelque chose : « se » est un complément indirect. Le participe « succédé » ne s’accorde pas.'],
  ['auxquelles', 'Grammaire', 'Voici les mesures ___ nous nous opposons.', 'auxquelles', ['desquelles', 'lesquelles', 'dont'], 'On s’oppose à des mesures. À + lesquelles donne « auxquelles ».'],
  ['desquels', 'Grammaire', 'Les arbres à l’ombre ___ nous lisions ont été abattus.', 'desquels', ['auxquels', 'lesquels', 'que'], 'Après la locution « à l’ombre de », on emploie « desquels » pour reprendre un nom masculin pluriel.'],
  ['voire', 'Vocabulaire', 'Il faudra plusieurs semaines, ___ plusieurs mois.', 'voire', ['voir', 'vois', 'voient'], '« Voire » signifie « et même ». Il ne s’agit pas du verbe « voir ».'],
  ['a-linstar', 'Vocabulaire', '« À l’instar de sa sœur » signifie ___.', 'comme sa sœur', ['contrairement à sa sœur', 'sans sa sœur', 'avant sa sœur'], '« À l’instar de » exprime une similitude : à la manière de, comme.'],
  ['faire-fie', 'Vocabulaire', '« Faire fi d’un avertissement » signifie ___.', 'ne pas en tenir compte', ['le prendre au sérieux', 'le transmettre aussitôt', 'en vérifier la source'], '« Faire fi de » signifie mépriser, dédaigner ou ne pas tenir compte de quelque chose.'],
  ['pis', 'Vocabulaire', 'La situation va de mal en ___.', 'pis', ['pire', 'puis', 'plus'], 'La locution figée s’écrit « de mal en pis ». « Pis » est ici le comparatif adverbial de « mal ».'],
  ['conjecture', 'Vocabulaire', 'Une hypothèse fondée sur des indices incertains est une ___.', 'conjecture', ['conjoncture', 'injonction', 'jonction'], 'Une conjecture est une supposition. La conjoncture est l’ensemble des circonstances d’une situation.'],
  ['eminence', 'Vocabulaire', 'Un événement sur le point de se produire est ___.', 'imminent', ['éminent', 'immanent', 'émanent'], '« Imminent » signifie très proche dans le temps ; « éminent » signifie remarquable ou supérieur.'],
  ['venimeux', 'Vocabulaire', 'Un serpent qui peut injecter du venin est ___.', 'venimeux', ['vénéneux', 'véniel', 'vénal'], '« Venimeux » se rapporte au venin. « Vénéneux » qualifie notamment une plante ou un champignon toxique.'],
  ['partial', 'Vocabulaire', 'Un juge qui favorise injustement un camp est ___.', 'partial', ['partiel', 'impartial', 'parcellaire'], '« Partial » signifie qui prend parti avec injustice ; « partiel » signifie incomplet.'],
  ['differend', 'Vocabulaire', 'Ils tentent de régler leur ___. (désaccord)', 'différend', ['différent', 'différant', 'diffèrent'], 'Le nom « différend », avec un d final, désigne un désaccord. « Différent » est un adjectif.'],
  ['prescription', 'Vocabulaire', 'Quel nom désigne un ordre précis donné par une autorité ?', 'injonction', ['conjecture', 'digression', 'réminiscence'], 'Une injonction est un ordre formel. Une digression s’écarte du sujet ; une réminiscence est un souvenir.'],
  ['corroborer', 'Vocabulaire', 'Ces témoignages ___ son récit. (en confirment la véracité)', 'corroborent', ['éludent', 'réfutent', 'occultent'], '« Corroborer » signifie confirmer ou renforcer par des éléments concordants. « Réfuter » signifie démontrer la fausseté.'],
  ['obsolescence', 'Vocabulaire', 'Un dispositif dépassé par des techniques nouvelles est ___.', 'obsolète', ['inopiné', 'pérenne', 'prépondérant'], '« Obsolète » signifie dépassé, tombé en désuétude. « Pérenne » signifie durable.'],
];

window.FRENCH_CARDS.push(...contrastCards, ...nuanceLessons.map(([id, topic, prompt, answer, distractors, explanation]) => ({
  id, topic, prompt, answer, explanation, level: `Nuances · ${topic.toLowerCase()}`,
  completed: prompt.includes('___') ? prompt.replace('___', answer) : answer,
  choices: [answer, ...distractors],
})));
