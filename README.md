# Notre premier date — Kinshasa

Une invitation interactive et romantique à un premier date officiel à Kinshasa. L’application reste une page statique en HTML, CSS et JavaScript ; Formspree transmet les réponses par e-mail après validation explicite.

## Parcours

L’accueil propose un « oui » et un « non » avec une réponse humoristique illustrée. Le parcours guide ensuite vers le type de date, une ambiance adaptée au choix, une date ou une décision commune, le moment de la journée, puis un récapitulatif avec un message personnalisable. Avant l’envoi, une mention indique clairement que les choix et le message seront transmis à Josias par e-mail via Formspree. La confirmation et l’animation de cœurs et de confettis ne s’affichent qu’après acceptation de l’envoi ; en cas d’échec, la personne peut réessayer sans perdre ses choix.

Les réponses envoyées sont traitées par le formulaire Formspree « Réponses — premier date Kinshasa », configuré pour notifier l’adresse du compte. Aucune adresse électronique n’est demandée à la personne qui répond. Des illustrations SVG locales sont incluses pour conserver l’affichage des mèmes sur un hébergement statique.

## Fichiers

Les fichiers principaux sont `index.html` (structure et métadonnées), `styles.css` (identité visuelle, animations, focus et responsive), `script.js` (navigation, choix et calendrier), `assets/` (favicon et illustrations SVG locales) ainsi que `manus-routes.json` (route d’accueil pour l’environnement de développement Manus).

## Prévisualiser localement

Avec Python 3 installé, lancer depuis le dossier du dépôt :

```sh
python3 -m http.server 3000
```

Puis ouvrir `http://localhost:3000`.

## Hébergement public

Le site ne nécessite aucune compilation. GitHub Pages est configuré pour publier la branche `main` depuis la racine (`/`) du dépôt. L’adresse publique est [josiasekelekele92-hub.github.io/kinshasa-date](https://josiasekelekele92-hub.github.io/kinshasa-date/).
