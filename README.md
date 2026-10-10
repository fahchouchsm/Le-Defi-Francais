# Le Défi Français

Application de bureau hors connexion pour progresser en français et préparer le TCF B2. Le parcours contient 24 niveaux et 300 questions originales.

## Installer et lancer

Sur Windows, téléchargez `Le-Defi-Francais-Setup-1.1.0.exe` depuis [Releases](https://github.com/fahchouchsm/Le-Defi-Francais/releases) et suivez l’assistant d’installation. Cette version publique inclut les exercices originaux, mais pas les PDF/MP3 TV5MONDE. La version 1.1.0 est construite avec `npm run package:windows` et apparaît dans `dist/`.

Depuis le code source : `npm ci`, puis `npm run build:css`, puis `npx electron .`. Les PDF/MP3 TV5MONDE ne sont **pas** dans le dépôt ni dans les installateurs publics : téléchargez-les depuis [la page officielle des livrets TCF](https://apprendre.tv5monde.com/fr/article/les-livrets-dentrainement-au-tcf-r-avec-tv5monde) et placez-les dans `tcf-offline/` avec les noms indiqués dans `tcf-data.js` si vous souhaitez utiliser le test blanc local depuis le code source. Ils ne doivent pas être redistribués sans autorisation. Les 300 questions originales, les leçons et les ateliers fonctionnent sans ces fichiers.

## Parcours principal

L’accueil montre une carte de 24 niveaux répartis en six chapitres, sur une route sinueuse visible d’un coup d’œil. Chaque niveau ordinaire propose douze questions corrigées et demande neuf bonnes réponses pour avancer. Le dernier niveau de chaque chapitre est un final de seize questions (13/16 pour réussir) ; le grand final TCF en compte vingt (17/20). Le parcours comprend 96 questions supplémentaires propres aux niveaux, en plus des exercices existants : temps, accords, vocabulaire, compréhension écrite, consignes, registre et argumentation. Une erreur n’efface pas un niveau réussi. Les réussites antérieures restent enregistrées sur cet appareil.

Après le grand final, la carte ouvre une épreuve blanche TCF de 80 questions avec deux livrets et leurs enregistrements. Les 17 séries PDF et MP3 restent aussi accessibles dans TCF B2. Le parcours prépare et entraîne, mais ne garantit pas de résultat officiel.

La barre supérieure garde trois entrées : **Mon parcours**, **TCF B2** et **Mon carnet**. Les leçons sur les temps, les ateliers d’écriture et les statistiques sont dans **Vos outils** sous la carte. Les exercices et parcours guidés antérieurs restent dans **Explorer librement**.

Pendant un QCM, la barre est compacte : le bouton **Menu** ouvre les sections sans perdre la question. Échap referme ce menu. Les raccourcis de réponse sont suspendus tant qu’il est ouvert. Changer de page conserve les brouillons et permet de reprendre le QCM en cours.

- **Pratique libre** : démarrer une séance générale ou choisir grammaire, conjugaison ou vocabulaire. Les trois anciens parcours thématiques ont toujours leurs propres niveaux et boss, indépendants de la carte principale.
- **Pratique** : une question, exactement quatre propositions et aucun menu secondaire. La correction et son explication apparaissent après votre réponse et restent visibles jusqu’à « Continuer ».
- **Résultat** : votre score à la fin de la séance ; le détail de vos réponses est replié par défaut.
- **Mon carnet** : vos erreurs encore à revoir. Ouvrez une question pour consulter sa correction ou démarrez une séance de révision.
- **Progression** : statistiques et réinitialisation, à l’écart des exercices.

Une séance comporte dix questions au maximum. Une révision avec moins de dix erreurs est plus courte. « Pause » revient à l’accueil ; « Reprendre ma séance » restaure exactement la question et sa correction. Cette reprise est disponible tant que l’application n’est pas rechargée ou fermée. Les statistiques et les erreurs sont enregistrées et persistent après fermeture.

300 exercices distincts hors connexion, sans compte, dont 96 nouveaux exercices propres au parcours, 54 questions en situation ou en lecture et 30 questions rattachées aux leçons sur les temps. Touches 1–4 pour répondre, Entrée pour continuer. Vous pouvez aussi tout utiliser à la souris ou avec Tab puis Entrée. Ne déplacez pas le dossier sans modifier les chemins des raccourcis.

## Objectif TCF B2

L’onglet **TCF B2** propose douze questions originales : compréhension écrite, compréhension orale et structures de la langue. Chaque défi compte quatre questions. Après chaque réponse, une correction explique l’indice à repérer et le raisonnement. Le défi rapide privilégie les questions encore inédites ; les erreurs restent dans **Rejouer mes erreurs** jusqu’à une réponse juste.

La compréhension orale utilise la voix de synthèse française disponible sur l’appareil. Une transcription est accessible pour relire ou si la synthèse vocale n’est pas disponible. L’atelier d’expression propose une argumentation écrite ou orale, une méthode en quatre étapes, un exemple à comparer et une checklist de relecture. Le brouillon et la progression sont enregistrés localement. Ces activités ne constituent pas des sujets officiels et ne certifient pas un niveau.

Le bouton **Mode sombre** dans la barre supérieure change le thème de toute l’application et mémorise le choix sur cet appareil. Le thème sombre charbon/noir est écrit avec TailwindCSS dans `theme.tailwind.css` puis compilé en `theme.css` avec `npm run build:css` ; `npm test` le recompile aussi.

Avec les supports TV5MONDE téléchargés localement, la section **Supports TCF publiés** ouvre les 17 livrets PDF et leurs 17 MP3 hors connexion. Le bouton **Test de 90 minutes** lance une session locale avec deux séries au choix (80 questions), le PDF et le MP3 du livret affichés dans l’application, une réponse à la fois, un navigateur de questions, une sauvegarde et un chronomètre. Sans ces fichiers, utilisez les liens vers les supports officiels en ligne ; le test blanc local ne fonctionne pas. Consultez les grilles de correction dans les PDF : cette session ne calcule pas le score ou le niveau du simulateur TV5MONDE et ne copie pas son interface interactive. Ces séries sont des entraînements publiés, non des sujets confidentiels ou des épreuves officielles.

## Le voyage des temps

L’onglet **Les temps** ouvre un espace séparé de la pratique. Quinze leçons sont regroupées en essentiels, nuances et lecture littéraire. Chaque leçon avance en quatre étapes : comprendre avec une petite scène, construire avec une formule et un modèle conjugué, distinguer deux emplois proches, puis écrire sa propre phrase. Un exemple expliqué reste replié pour permettre de réfléchir avant de comparer. La phrase libre est enregistrée dans ce navigateur ; elle n’est pas notée automatiquement. Les pièges et les usages littéraires sont explicités.

## Parcours guidés et reprise

Depuis l’accueil, **Suivre un parcours guidé** relie les leçons à quatre intentions : raconter un événement, obtenir une réponse avec tact, défendre une idée, proposer un projet. Chaque parcours propose deux ou trois leçons puis un atelier d’écriture. Après le quiz d’une leçon, un bouton conduit à l’étape suivante. Vous pouvez aussi ouvrir librement n’importe quelle étape.

Les parcours affichent le score du dernier essai de chaque leçon, sans l’assimiler à une maîtrise. Le bouton **Reprendre** de l’accueil restaure la dernière leçon ou le dernier atelier et son étape, même après fermeture. Les phrases libres des leçons et le parcours sélectionné sont également conservés. Les séances générales de QCM conservent leur fonctionnement : reprise en mémoire pendant l’ouverture de l’application, statistiques persistantes.

« Pratiquer ce temps » lance deux questions ciblées : le sens, puis la forme. Chacune propose quatre choix avec une correction expliquée. Le résultat permet de relire la leçon ou de réessayer les mêmes notions avec des choix mélangés. Ces questions alimentent aussi le carnet et les statistiques habituelles. La simple lecture d’une leçon ne change pas vos scores.

## Production écrite

L’onglet **Écrire** propose quatre ateliers : courriel formel, récit au passé, argumentation et proposition de projet. Chaque atelier possède une consigne, une cible de longueur, trois questions pour préparer le plan, des expressions utiles et un modèle commenté.

Les étapes **Préparer → Rédiger → Améliorer** n’affichent que les outils utiles à la tâche en cours. Le plan, le texte et la checklist sont enregistrés automatiquement dans ce navigateur, indépendamment pour chaque atelier. La première entrée en révision avec un texte non vide conserve une copie du premier jet. Modifier le texte décoche la checklist afin de refaire une vraie relecture. Réinitialiser les statistiques du quiz n’efface pas les brouillons.

Les repères automatiques comptent approximativement les mots (apostrophes et traits d’union internes conservés), les blocs séparés par une ligne vide et certains connecteurs. Ils ne corrigent pas la grammaire et n’attribuent pas de niveau ou de note au texte. Le correcteur orthographique du navigateur peut aider selon sa configuration. Aucun texte n’est envoyé à un service externe.

## Tests

`node tests/quiz-engine.test.js` vérifie les questions et le moteur.

`node tests/app-flow.test.cjs` vérifie les parcours avec un double DOM : séparation des écrans, pause/reprise, corrections, révision, stockage et clavier. Ce test ne vérifie pas le rendu visuel.

`node tests/browser.cjs` vérifie les parcours dans Chrome via Playwright, y compris la carte sur mobile et l’accès au test TCF hors connexion quand les supports sont présents. Le rendu desktop, mobile et sombre a été inspecté visuellement.
