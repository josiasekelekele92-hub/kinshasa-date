# Notre premier date — Kinshasa

Une invitation interactive et romantique à un premier date officiel à Kinshasa. L’application est une page statique en HTML, CSS et JavaScript : aucun framework, serveur applicatif, compte ou service d’envoi n’est nécessaire.

## Parcours

L’accueil propose un « oui » et un « non » avec une réponse humoristique illustrée. Le parcours guide ensuite vers le type de date, une ambiance adaptée au choix, une date ou une décision commune, le moment de la journée, puis un récapitulatif avec un message personnalisable. La validation déclenche une animation de cœurs et de confettis.

Le message et les choix restent dans le navigateur : la page ne collecte ni ne transmet de réponse à un tiers. Des illustrations SVG locales sont incluses pour conserver l’affichage des mèmes sur un hébergement statique.

## Fichiers

- `index.html` — structure de la page et métadonnées.
- `styles.css` — identité visuelle, animations, états de focus et adaptations mobiles.
- `script.js` — navigation sans rechargement, choix et calendrier.
- `assets/` — icône du site et illustrations SVG de secours.
- `manus-routes.json` — route d’accueil pour l’environnement de développement Manus.

## Prévisualiser localement

Avec Python 3 installé, lancer depuis le dossier du dépôt :

```sh
python3 -m http.server 3000
```

Puis ouvrir `http://localhost:3000`.

## GitHub Pages

Le site ne nécessite aucune compilation. Les fichiers statiques de la branche `main` peuvent être publiés directement depuis la racine du dépôt via **Settings → Pages → Deploy from a branch → `main` → `/ (root)**. L’URL du site suit la forme `https://<proprietaire>.github.io/<depot>/`.
