# Suivi des fonctionnalités

## Matchs du jour
- [x] Afficher les matchs de football programmés aujourd’hui pour La Liga, la Premier League et la Bundesliga.
- [x] Regrouper clairement les matchs par ligue avec équipes, horaires et état de la rencontre lorsque la donnée est disponible.
- [x] Permettre de naviguer rapidement entre les trois championnats depuis une interface unique.
- [x] Prévoir un état explicite lorsqu’aucun match n’est programmé aujourd’hui ou qu’une donnée est momentanément indisponible.

## Classements complets
- [x] Présenter le classement complet de La Liga avec rang, équipe, matchs joués, différence de buts et points.
- [x] Présenter le classement complet de la Premier League avec rang, équipe, matchs joués, différence de buts et points.
- [x] Présenter le classement complet de la Bundesliga avec rang, équipe, matchs joués, différence de buts et points.

## Prochains matchs et expérience responsive
- [x] Identifier les trois premières équipes de chaque classement et afficher la date de leur prochain match.
- [x] Si le calendrier local ne fournit pas une date future pour un club désormais dans le top 3, afficher « Date à confirmer » et un lien vers le calendrier officiel plutôt qu’une ancienne date passée.
- [x] Concevoir une expérience responsive et lisible sur ordinateur, tablette et mobile, entièrement en français.

## Classements actualisés et blasons locaux
- [x] Rafraîchir automatiquement les classements de La Liga, Premier League et Bundesliga à partir des données de classement actuelles, et rafraîchir le calendrier de matchs sur action manuelle et automatiquement chaque minute.
- [x] Afficher le total de points et les matchs joués à jour; en particulier, FC Barcelona doit apparaître à 30 points après sa victoire 6–1 contre Alavés du 31 octobre 2026.
- [x] Afficher les blasons des 58 clubs dans les classements, les rencontres du jour et les fiches des prochains matchs; télécharger les fichiers depuis GitHub et les stocker localement dans le projet, sans charger les logos depuis une API à l’exécution.
- [x] Conserver des badges textuels de secours si un fichier de logo est absent et enregistrer une attribution de la source GitHub des images dans le projet.

## Installation Windows
- [x] Permettre une installation Windows propre avec npm sans conflit de dépendances entre le plugin JSX Loc et Vite 7; documenter la version Node requise et les commandes PyCharm pour démarrer le site.
