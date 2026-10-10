// Four fresh, explained questions per map stop; IDs keep old saved progress intact.
const JOURNEY_EXTRA = [
  ['Conjugaison', [
    ['Chaque matin, elle ___ le tram à 7 h. (prendre)', 'prend', ['a pris', 'prenait', 'prendra'], '« Chaque matin » décrit une habitude actuelle : on choisit le présent, « elle prend ».'],
    ['Ce matin, elle ___ le tram à 7 h et elle est arrivée à l’heure. (prendre)', 'a pris', ['prend', 'prenait', 'prendra'], 'L’action est ponctuelle et achevée dans un récit au passé : « elle a pris ».'],
    ['Je travaille dans ce quartier ___ trois ans.', 'depuis', ['pendant', 'en', 'il y a'], 'Avec une action commencée dans le passé qui continue, le présent se combine avec « depuis ».'],
    ['Nous ___ de terminer la réunion : le compte rendu n’est pas encore prêt.', 'venons', ['sommes', 'avons', 'allons'], 'Le passé récent se construit avec « venir de » au présent : « nous venons de terminer ».'],
  ]],
  ['Conjugaison', [
    ['Quand le téléphone a sonné, je ___ le dîner. (préparer)', 'préparais', ['ai préparé', 'préparerai', 'préparerais'], 'L’imparfait donne l’action en cours qui sert de décor à l’événement ponctuel.'],
    ['Hier, nous ___ au musée puis nous avons dîné ensemble. (aller)', 'sommes allés', ['allions', 'irons', 'serions allés'], 'La succession d’événements achevés appelle le passé composé ; « aller » se conjugue avec être.'],
    ['D’ici vendredi, vous ___ une réponse. (recevoir, futur simple)', 'recevrez', ['recevez', 'recevriez', 'receviez'], '« D’ici vendredi » annonce un résultat futur ; le futur simple de recevoir est « recevrez ».'],
    ['Quand j’étais enfant, nous ___ souvent chez mes grands-parents. (passer)', 'passions', ['avons passé', 'passerons', 'passerions'], '« Souvent » et le cadre « quand j’étais enfant » évoquent une habitude passée : imparfait.'],
  ]],
  ['Conjugaison', [
    ['Si j’avais davantage de temps, je ___ chaque jour. (lire)', 'lirais', ['lirai', 'lisais', 'ai lu'], 'Avec « si » à l’imparfait, la conséquence imaginaire prend le conditionnel présent.'],
    ['Vous pourriez ___ ce formulaire avant demain ? (remplir)', 'remplir', ['rempli', 'remplissez', 'rempliriez'], 'Après « pourriez », le second verbe reste à l’infinitif : c’est une demande polie.'],
    ['À l’impératif, adressez-vous à une seule personne : « ___ le document ! » (envoyer)', 'Envoie', ['Envoies', 'Envoyez', 'Envoyons'], 'À la deuxième personne du singulier, l’impératif des verbes en -er ne garde pas le s.'],
    ['« Je serais venu si tu m’avais prévenu » exprime…', 'un événement qui n’a pas eu lieu', ['une habitude passée', 'un projet certain', 'une obligation actuelle'], 'Le conditionnel passé décrit ici une conséquence irréelle : la personne n’est pas venue.'],
  ]],
  ['Conjugaison', [
    ['Ce matin, il pleuvait quand le soleil ___ soudainement. (apparaître)', 'est apparu', ['apparaissait', 'apparaîtra', 'apparaîtrait'], 'Le décor prend l’imparfait ; « soudainement » annonce l’événement achevé au passé composé.'],
    ['Si le dossier est complet, nous vous ___ demain. (répondre)', 'répondrons', ['répondions', 'répondrions', 'avions répondu'], 'Pour une condition réalisable : si + présent, puis futur simple dans la principale.'],
    ['Si le dossier était complet, nous vous ___ immédiatement. (répondre)', 'répondrions', ['répondrons', 'répondions', 'avons répondu'], 'Une condition imaginée avec si + imparfait entraîne le conditionnel présent.'],
    ['« Dès que le train sera arrivé, nous partirons » : quelle action vient d’abord ?', 'L’arrivée du train.', ['Le départ.', 'Les deux actions sont passées.', 'Aucune action n’est future.'], 'Le futur antérieur « sera arrivé » présente une action accomplie avant « partirons ».'],
  ]],
  ['Grammaire', [
    ['Les décisions qu’ils ont ___ hier seront publiées demain. (prendre)', 'prises', ['pris', 'prise', 'prends'], 'Le COD « décisions » précède avoir : le participe passé s’accorde au féminin pluriel.'],
    ['Elles se sont ___ pendant une heure. (téléphoner)', 'téléphoné', ['téléphonées', 'téléphonée', 'téléphonés'], 'On téléphone à quelqu’un : « se » est complément indirect, donc pas d’accord du participe.'],
    ['Des robes ___ sont exposées dans la vitrine. (bleu clair)', 'bleu clair', ['bleues claires', 'bleus clairs', 'bleue claire'], 'Une couleur composée de deux mots reste invariable : « des robes bleu clair ».'],
    ['___ les propositions doivent être examinées. (tout)', 'Toutes', ['Tous', 'Toute', 'Tout'], 'Le déterminant s’accorde avec « propositions », féminin pluriel : « toutes ».'],
  ]],
  ['Conjugaison', [
    ['Quand nous sommes entrés, la conférence ___ déjà. (commencer)', 'avait commencé', ['a commencé', 'commençait', 'commencera'], 'Le plus-que-parfait situe le début de la conférence avant notre entrée passée.'],
    ['Nous ___ ici depuis dix ans. (habiter)', 'habitons', ['avons habité', 'habitions', 'habiterons'], 'Une situation commencée dans le passé et toujours vraie prend le présent avec « depuis ».'],
    ['Après avoir terminé, elle ___ son rapport au responsable. (envoyer, passé composé)', 'a envoyé', ['envoyait', 'avait envoyé', 'enverra'], 'Dans ce récit, la seconde action achevée prend le passé composé ; « après avoir terminé » la précède.'],
    ['Pendant que nous discutions, les enfants ___ dans le jardin. (jouer)', 'jouaient', ['ont joué', 'joueront', 'joueraient'], 'Deux actions simultanées présentées comme un décor passé prennent ici l’imparfait.'],
  ]],
  ['Vocabulaire', [
    ['Un contrat qui se renouvelle automatiquement est « ___ ».', 'reconduit', ['résilié', 'remboursé', 'contesté'], '« Reconduire » prolonge un contrat ; « résilier » y met fin.'],
    ['Une somme versée avant la facture finale est un ___.', 'acompte', ['écart', 'récépissé', 'devis'], 'L’acompte est un paiement partiel anticipé, déduit du montant final.'],
    ['Une information « fiable » est une information…', 'sur laquelle on peut compter', ['incomplète par définition', 'officielle dans tous les cas', 'difficile à comprendre'], 'La fiabilité concerne la confiance qu’on peut accorder à une source ou à un fait.'],
    ['Deux personnes sont en « désaccord » lorsqu’elles…', 'défendent des avis différents', ['partagent exactement le même avis', 'se connaissent depuis longtemps', 'signent le même contrat'], 'Un désaccord est une divergence d’opinions ; il n’implique pas nécessairement un conflit violent.'],
  ]],
  ['Grammaire', [
    ['« Elles se sont écrit hier » : pourquoi « écrit » reste-t-il invariable ?', 'Parce qu’on écrit à quelqu’un.', ['Parce que le sujet est pluriel.', 'Parce que la phrase est négative.', 'Parce que le verbe est au présent.'], 'Avec « écrire à quelqu’un », le pronom est indirect : il ne commande pas l’accord du participe.'],
    ['« Les pièces que nous avons jointes » : qu’est-ce qui justifie l’accord ?', 'Le COD « pièces » est avant le verbe.', ['Le sujet « nous » est pluriel.', 'Le verbe est suivi d’un nom.', 'La phrase est au passé.'], 'Avec avoir, le participe s’accorde avec le COD placé avant lui, ici « les pièces ».'],
    ['« Le prix a augmenté ; ___, la demande reste stable. »', 'pourtant', ['donc', 'puisque', 'afin que'], '« Pourtant » marque l’opposition entre une hausse attendue comme dissuasive et une demande stable.'],
    ['Une offre valable « jusqu’au 30 juin inclus » est encore valable…', 'le 30 juin', ['seulement jusqu’au 29 juin', 'à partir du 1er juillet', 'pendant tout juillet'], '« Inclus » signifie que la date mentionnée fait partie de la période de validité.'],
  ]],
  ['Grammaire', [
    ['C’est le projet ___ je t’ai parlé hier.', 'dont', ['que', 'où', 'auquel'], '« Parler de quelque chose » appelle le relatif « dont » pour reprendre « de ce projet ».'],
    ['La ville ___ nous nous sommes installés est très calme.', 'où', ['dont', 'que', 'auquel'], '« Où » reprend un lieu après « s’installer dans une ville ».'],
    ['Voici les questions ___ il faut répondre.', 'auxquelles', ['lesquelles', 'desquelles', 'dont'], 'On répond à des questions : à + lesquelles donne « auxquelles ».'],
    ['Ces dossiers, nous ___ avons déjà envoyés au service concerné.', 'les', ['leur', 'en', 'y'], 'Le pronom COD « les » remplace les dossiers ; « leur » désignerait les destinataires.'],
  ]],
  ['Conjugaison', [
    ['Bien qu’il ___ tard, nous continuerons. (être)', 'soit', ['est', 'sera', 'serait'], '« Bien que » exprime une concession et se construit avec le subjonctif présent.'],
    ['Il est possible qu’elle ___ demain. (venir)', 'vienne', ['vient', 'viendra', 'venait'], 'La possibilité incertaine introduite par « il est possible que » appelle le subjonctif.'],
    ['Si vous aviez lu le message, vous ___ le changement. (comprendre)', 'auriez compris', ['comprendrez', 'compreniez', 'avez compris'], 'Si + plus-que-parfait exprime une hypothèse passée irréelle ; la conséquence prend le conditionnel passé.'],
    ['Je suis certain qu’ils ___ à l’heure. (être, futur)', 'seront', ['soient', 'seraient', 'étaient'], 'La certitude affirmée prend l’indicatif ; avec une référence future, « seront ».'],
  ]],
  ['Vocabulaire', [
    ['« Sans réponse de votre part, nous classerons le dossier. » Quelle action est attendue ?', 'Répondre avant le classement du dossier.', ['Envoyer un nouveau dossier après classement.', 'Ne rien faire du tout.', 'Payer immédiatement sans répondre.'], 'L’absence de réponse déclenche le classement : répondre évite cette conséquence annoncée.'],
    ['Une remarque « pertinente » est surtout…', 'adaptée au sujet et utile', ['très longue', 'formulée sans preuve', 'toujours agréable'], '« Pertinent » qualifie ce qui convient à la question et apporte un éclairage utile.'],
    ['« Il a émis des réserves » signifie qu’il a…', 'exprimé des doutes ou des objections', ['confirmé sans hésitation', 'retiré sa candidature', 'réservé une salle'], 'Dans ce contexte, « réserves » désigne des objections, pas une réservation matérielle.'],
    ['« La décision demeure provisoire » signifie qu’elle…', 'peut encore être modifiée', ['est définitive', 'a été annulée', 'reste secrète'], 'Une décision provisoire n’est pas arrêtée définitivement et peut être révisée.'],
  ]],
  ['Grammaire', [
    ['« Le candidat auquel nous avons écrit » : que remplace « auquel » ?', 'à ce candidat', ['de ce candidat', 'ce candidat directement', 'dans ce candidat'], 'Le verbe « écrire » prend un destinataire introduit par « à » ; auquel reprend ce complément.'],
    ['« Je doute qu’il ait reçu le message » : quel élément justifie le subjonctif ?', 'Le doute du locuteur.', ['Le fait que le message soit long.', 'Le temps futur.', 'Le pluriel du sujet.'], 'Le verbe « douter que » présente l’information comme incertaine et appelle le subjonctif.'],
    ['« Si elle avait su, elle aurait appelé » : que sait-on ?', 'Elle n’a pas su et n’a pas appelé.', ['Elle a su puis a appelé.', 'Elle appellera sûrement.', 'Elle savait sans appeler.'], 'L’hypothèse irréelle du passé suggère que la condition et sa conséquence ne se sont pas réalisées.'],
    ['« Il est réservé, voire réticent » : quel rôle joue « voire » ?', 'Il renforce la description.', ['Il présente une cause.', 'Il corrige une date.', 'Il annule le premier adjectif.'], '« Voire » signifie « et même » : le second adjectif accentue le premier.'],
  ]],
  ['Grammaire', [
    ['« ___ ses efforts, il n’a pas réussi. »', 'Malgré', ['Bien que', 'Quoique', 'Même si'], '« Malgré » précède un groupe nominal ; les autres tournures introduisent une proposition verbale.'],
    ['« ___ il ait peu d’expérience, il a convaincu le jury. »', 'Bien qu’', ['Malgré qu’', 'En dépit qu’', 'À cause qu’'], '« Bien que » introduit une concession suivie du subjonctif « ait ».'],
    ['« Elle a beau expliquer, il refuse. » Le sens est…', 'Elle explique, mais cela ne suffit pas.', ['Elle explique parce qu’il accepte.', 'Elle explique après son refus seulement.', 'Elle refuse d’expliquer.'], '« Avoir beau + infinitif » exprime un effort sans le résultat espéré.'],
    ['Quelle formule introduit une objection reconnue avant d’y répondre ?', 'Certes… néanmoins…', ['D’abord… ensuite…', 'Parce que… donc…', 'Ni… ni…'], '« Certes » concède un point ; « néanmoins » maintient une réserve ou une autre conclusion.'],
  ]],
  ['Conjugaison', [
    ['Avant de déménager, elle ___ déjà son emploi. (quitter, plus-que-parfait)', 'avait quitté', ['a quitté', 'quittera', 'aurait quitté'], 'Le plus-que-parfait situe la démission avant un autre repère passé, le déménagement.'],
    ['Dès que nous ___ les résultats, nous vous appellerons. (recevoir, futur antérieur)', 'aurons reçu', ['avons reçu', 'recevions', 'aurions reçu'], 'Le futur antérieur marque la réception accomplie avant l’appel futur.'],
    ['Elle regrette qu’il ___ trop tard. (partir, subjonctif passé)', 'soit parti', ['est parti', 'sera parti', 'était parti'], 'Après « regrette que », le subjonctif passé présente une action antérieure : « soit parti ».'],
    ['« Quand nous sommes arrivés, ils étaient déjà partis » : quelle action précède l’autre ?', 'Leur départ précède notre arrivée.', ['Notre arrivée précède leur départ.', 'Les deux actions sont futures.', 'On ne connaît aucun ordre.'], 'Le plus-que-parfait « étaient partis » indique l’action déjà accomplie au moment de l’arrivée.'],
  ]],
  ['Vocabulaire', [
    ['Une mesure « contraignante » impose…', 'des obligations ou des limites', ['une simple suggestion', 'une récompense automatique', 'une annulation certaine'], '« Contraignant » qualifie ce qui oblige ou restreint la liberté d’action.'],
    ['« Cette évolution est marginale » : le changement est…', 'faible ou secondaire', ['massif', 'impossible à mesurer', 'officiellement interdit'], 'Au sens courant, « marginal » signifie peu important relativement à l’ensemble.'],
    ['« La proposition a été écartée » signifie qu’elle a été…', 'mise de côté ou rejetée', ['adoptée unanimement', 'rédigée plus vite', 'traduite mot à mot'], 'Écarter une proposition, c’est décider de ne pas la retenir à ce stade.'],
    ['Un rapport « exhaustif » cherche à être…', 'complet', ['bref à tout prix', 'secret', 'provisoire'], 'Un traitement exhaustif couvre tous les aspects pertinents, par opposition à partiel.'],
  ]],
  ['Grammaire', [
    ['« Quoique la mesure soit utile, elle reste coûteuse » : quelle est l’idée principale ?', 'Elle reste coûteuse.', ['Elle est gratuite.', 'Elle est inutile.', 'Son coût est inconnu.'], 'La concession « quoique » reconnaît l’utilité ; la proposition principale insiste sur le coût.'],
    ['« Le contrat sera résilié à moins que vous ne régliez le solde » : que peut éviter le paiement ?', 'La résiliation.', ['Le paiement lui-même.', 'La signature initiale.', 'La remise déjà accordée.'], '« À moins que » pose l’exception : régler le solde empêche la conséquence annoncée.'],
    ['« La réunion avait commencé lorsque je suis arrivé » : quel temps marque l’antériorité ?', 'Le plus-que-parfait.', ['Le présent.', 'Le futur simple.', 'L’impératif.'], '« Avait commencé » place le début de la réunion avant l’arrivée au passé composé.'],
    ['« Une solution viable » est une solution…', 'qui peut fonctionner durablement', ['seulement théorique', 'forcément gratuite', 'imposée par la loi'], '« Viable » insiste sur la possibilité réelle de fonctionner dans la durée.'],
  ]],
  ['Vocabulaire', [
    ['« Les horaires sont élargis ; toutefois, le service ferme le dimanche. » Quelle limite demeure ?', 'La fermeture du dimanche.', ['La fermeture tous les soirs.', 'La réduction des horaires.', 'La disparition du service.'], '« Toutefois » introduit la restriction à l’extension annoncée.'],
    ['« La fréquentation a légèrement progressé. » Quelle reformulation évite l’exagération ?', 'Elle a augmenté un peu.', ['Elle a doublé.', 'Elle a chuté.', 'Elle a progressé chaque jour.'], '« Légèrement » limite l’ampleur de la hausse ; on ne peut pas conclure à un doublement.'],
    ['« Le dispositif vise principalement les jeunes actifs. » Qui est prioritairement concerné ?', 'Les jeunes personnes en emploi.', ['Tous les retraités.', 'Seulement les enfants.', 'Uniquement les employeurs.'], '« Principalement » indique une priorité, pas une exclusivité absolue.'],
    ['« Le conseil envisage de repousser le vote. » La décision de report est-elle certaine ?', 'Non, elle est seulement étudiée.', ['Oui, elle est déjà exécutée.', 'Oui, le vote est annulé.', 'Non, le vote a déjà eu lieu.'], '« Envisager » signifie considérer une possibilité, sans annoncer une décision définitive.'],
  ]],
  ['Vocabulaire', [
    ['« Seule une minorité conteste la réforme » : quelle proposition est compatible ?', 'La majorité ne la conteste pas.', ['Personne ne la conteste.', 'Tous la rejettent.', 'La minorité est majoritaire.'], '« Minorité » désigne moins de la moitié ; cela n’équivaut pas à zéro opposant.'],
    ['« Les résultats sont encourageants, sans être décisifs. » Le ton est…', 'positif mais prudent', ['totalement négatif', 'certain et définitif', 'sans aucun jugement'], 'L’adjectif positif est tempéré par « sans être décisifs », qui limite la portée des résultats.'],
    ['« L’auteur semble sceptique quant à l’efficacité annoncée. » Il…', 'doute que l’effet promis se produise', ['affirme que l’effet est prouvé', 'refuse de lire les résultats', 'décrit seulement la date'], 'Être sceptique, c’est mettre en doute une affirmation ou un résultat attendu.'],
    ['« Il ne nie pas le problème, mais conteste la solution. » Que refuse-t-il ?', 'La solution proposée.', ['L’existence du problème.', 'Toute discussion.', 'La nécessité de comprendre.'], 'La négation porte sur « nie » : le problème est reconnu ; c’est la réponse proposée qui est contestée.'],
  ]],
  ['Vocabulaire', [
    ['« Les inscriptions ouvrent lundi à 9 h et se terminent jeudi à midi. » Quand peut-on déposer mardi ?', 'Pendant la période d’inscription.', ['Avant son ouverture.', 'Après sa clôture.', 'Seulement avec une dérogation.'], 'Mardi se situe entre lundi 9 h et jeudi midi : la période est ouverte.'],
    ['« Aucun remboursement sans preuve d’achat. » Quelle pièce est indispensable ?', 'Une preuve d’achat.', ['Une carte de fidélité.', 'Un deuxième produit.', 'Une lettre de recommandation.'], '« Sans preuve d’achat » indique la condition nécessaire pour obtenir le remboursement.'],
    ['« Les candidatures incomplètes ne seront pas examinées. » Que faire avant l’envoi ?', 'Vérifier que toutes les pièces demandées sont présentes.', ['Envoyer rapidement sans vérifier.', 'Attendre une réponse avant de joindre les pièces.', 'Ne fournir que le nom.'], 'L’examen dépend d’un dossier complet ; il faut donc contrôler les pièces exigées avant de déposer.'],
    ['« Le rendez-vous est avancé de deux jours, du jeudi au mardi. » Quelle est la nouvelle date ?', 'Mardi.', ['Jeudi.', 'Samedi.', 'Le mardi suivant.'], '« Avancer » déplace un événement plus tôt ; deux jours avant jeudi, c’est mardi.'],
  ]],
  ['Vocabulaire', [
    ['« L’atelier est gratuit dans la limite des places disponibles. » Quelle précision importe ?', 'La gratuité ne garantit pas une place.', ['L’inscription est payante.', 'Les places sont illimitées.', 'L’atelier est toujours annulé.'], 'La condition de capacité limite l’accès ; gratuit ne signifie pas automatiquement disponible.'],
    ['« Les résultats provisoires seront confirmés vendredi. » Quelle lecture est correcte ?', 'Ils peuvent encore changer avant vendredi.', ['Ils sont déjà définitifs.', 'Ils seront supprimés vendredi.', 'Ils concernent uniquement vendredi.'], '« Provisoires » oppose ces résultats à la confirmation définitive attendue.'],
    ['« Nous étudierons votre demande, puis vous informerons de notre décision. » Quelle étape vient en premier ?', 'L’examen de la demande.', ['La notification de la décision.', 'Le paiement de frais.', 'La signature d’un contrat.'], '« Puis » ordonne les actions : l’étude précède l’information sur la décision.'],
    ['« La subvention est accordée à condition que le projet démarre cette année. » Que se passe-t-il si le projet ne démarre pas ?', 'La condition d’attribution n’est pas remplie.', ['La subvention devient automatique.', 'La date n’a aucune importance.', 'Le projet est déjà terminé.'], '« À condition que » lie l’aide au démarrage pendant l’année indiquée.'],
  ]],
  ['Grammaire', [
    ['Pour demander un délai sans imposer, quelle formule convient ?', 'Serait-il possible de prolonger le délai de deux jours ?', ['Prolongez le délai, c’est obligatoire.', 'Je ne respecterai pas la date.', 'Vous devez accepter mon retard.'], 'Le conditionnel et la question ouvrent une demande polie et précisent le délai souhaité.'],
    ['Vous confirmez une réunion professionnelle. Quelle réponse apporte une information utile ?', 'Je vous confirme ma présence mardi à 14 h.', ['Oui, peut-être.', 'Je verrai plus tard sans vous prévenir.', 'Votre message est arrivé.'], 'Une confirmation utile mentionne clairement la présence et reprend le moment concerné.'],
    ['Pour signaler une erreur dans un document, choisissez la formule diplomatique.', 'Il semble qu’une date soit à vérifier à la page 2.', ['Votre document est faux.', 'Vous vous trompez encore.', 'Je refuse toute correction.'], '« Il semble » évite une accusation et indique précisément ce qui doit être contrôlé.'],
    ['Pour terminer un courriel de demande, quelle phrase facilite la réponse ?', 'Je reste à votre disposition pour toute précision.', ['Répondez immédiatement.', 'Je n’accepterai aucune question.', 'Ce message ne demande rien.'], 'La formule indique une ouverture à l’échange et convient à un registre professionnel.'],
  ]],
  ['Grammaire', [
    ['Quel argument défend une position plutôt que de répéter le sujet ?', 'Réduire les déchets diminue les coûts de traitement pour la commune.', ['Les déchets sont un sujet.', 'Il existe des communes.', 'Cette question revient souvent.'], 'Un argument explique pourquoi une position est justifiée ; il relie action et conséquence.'],
    ['Quel exemple précis soutient « la bibliothèque doit ouvrir plus tard » ?', 'Les étudiants qui finissent à 18 h pourraient encore y travailler une heure.', ['La bibliothèque est importante.', 'Tout le monde aime les livres.', 'Il faudrait changer quelque chose.'], 'Un exemple utile identifie un public, un horaire et un bénéfice concret.'],
    ['Quelle phrase distingue clairement opinion et fait ?', 'Selon moi, cette solution est préférable, même si son coût reste à vérifier.', ['Cette solution est objectivement parfaite.', 'Tout le monde pense comme moi.', 'Aucun coût ne peut exister.'], '« Selon moi » marque le jugement ; la fin reconnaît une information encore incertaine.'],
    ['« Certes, le changement dérange ; néanmoins, il facilite l’accès. » Quel est le rôle de « néanmoins » ?', 'Introduire la réponse à l’objection.', ['Ajouter un exemple sans contraste.', 'Annoncer une date.', 'Répéter la concession mot pour mot.'], 'Après l’objection concédée par « certes », « néanmoins » réaffirme l’avantage défendu.'],
  ]],
  ['Vocabulaire', [
    ['Texte A : « Le projet crée des emplois. » Texte B : « Les emplois risquent d’être temporaires. » B conteste surtout…', 'la durée du bénéfice annoncé', ['l’existence du projet', 'le nombre de villes', 'la date de publication'], 'B ne nie pas forcément la création d’emplois ; il questionne leur stabilité.'],
    ['« Les ventes ont augmenté après la campagne, sans que son rôle soit établi. » Peut-on attribuer la hausse à la campagne ?', 'Non, le lien causal n’est pas démontré.', ['Oui, cela est prouvé.', 'Non, les ventes ont baissé.', 'Oui, parce que la campagne était longue.'], 'La chronologie seule ne prouve pas la causalité ; d’autres facteurs peuvent expliquer la hausse.'],
    ['« Une partie des habitants approuve la mesure. » Quelle conclusion est trop forte ?', 'Tous les habitants l’approuvent.', ['Certains l’approuvent.', 'L’approbation n’est pas unanime.', 'Il existe des avis favorables.'], '« Une partie » n’autorise pas à généraliser à l’ensemble des habitants.'],
    ['« L’enquête porte sur 40 personnes. » Quelle prudence s’impose ?', 'Ne pas généraliser sans connaître la représentativité du groupe.', ['Considérer l’avis comme universel.', 'Ignorer toutes les réponses.', 'Conclure que 40 % sont satisfaits.'], 'Un nombre de répondants ne suffit pas à savoir s’ils représentent bien toute la population.'],
  ]],
  ['Grammaire', [
    ['Dans un courriel, vous devez refuser puis proposer une solution. Quelle phrase y parvient ?', 'Je ne peux pas venir mercredi, mais je suis disponible jeudi matin.', ['Je ne viendrai pas.', 'Je refuse et je n’ai rien à proposer.', 'Vous n’auriez pas dû choisir mercredi.'], 'Un refus constructif explique brièvement la limite et offre une autre possibilité concrète.'],
    ['Quel connecteur complète : « Le coût est élevé ; ___, les bénéfices pourraient durer. »', 'cependant', ['par conséquent', 'parce que', 'en effet'], '« Cependant » introduit une opposition nuancée entre le coût immédiat et les bénéfices futurs.'],
    ['Quelle affirmation respecte « pourrait », « environ » et « certains » ?', 'Un effet possible concerne une partie du groupe.', ['L’effet est certain pour tout le monde.', 'Aucun effet n’est possible.', 'Le nombre exact est connu.'], 'Ces trois mots limitent la certitude, la précision du nombre et l’étendue du groupe.'],
    ['Pour conclure une argumentation équilibrée, choisissez la phrase adaptée.', 'Une mise en œuvre progressive permettrait de concilier les deux objectifs.', ['Aucun compromis n’est possible, sans raison.', 'J’ouvre ici un autre sujet.', 'Tous les arguments précédents sont faux.'], 'La conclusion reprend le problème et propose une synthèse cohérente, sans nouveau thème.'],
  ]],
];

window.FRENCH_CARDS.push(...JOURNEY_EXTRA.flatMap(([topic, cards], stage) => cards.map(([prompt, answer, distractors, explanation], index) => ({
  id: `deep-${stage + 1}-${index + 1}`, topic, prompt, answer, explanation,
  level: `Parcours · niveau ${stage + 1}`,
  completed: prompt.includes('___') ? prompt.replace('___', answer) : answer,
  choices: [answer, ...distractors],
}))));
