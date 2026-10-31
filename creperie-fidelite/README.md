# Fidélité crêperie (HTML/CSS/JS + Neon + Vercel)

Trois espaces séparés, accessibles par leur URL :
- `/`        client (dossier `client/`)
- `/caisse`  caissier (dossier `caisse/`), code `STAFF_PIN`
- `/admin`   patron (dossier `admin/`), mot de passe `ADMIN_PASSWORD`

Mise en route
1. Créez un projet sur neon.tech et exécutez `schema.sql` dans son SQL Editor.
2. Poussez ce dossier sur GitHub, puis importez-le sur vercel.com.
3. Vercel > Settings > Environment Variables : `DATABASE_URL`, `STAFF_PIN`, `ADMIN_PASSWORD` (voir `.env.example`), puis redéployez.
4. Imprimez un QR code vers l’URL de la page client.

Test local : `npm i`, copiez `.env.example` en `.env`, puis `npx vercel dev`.

## Style (Tailwind)
Le CSS est compilé dans `assets/tailwind.css` (déjà fourni). Si vous modifiez des classes ou `assets/input.css`, lancez `npm install` puis `npm run build:css`.

## Parrainage et relances
- Base déjà en service : exécutez `migration.sql` dans le SQL Editor de Neon (une seule fois). Nouvelle base : `schema.sql` suffit.
- Parrainage : chaque client a un lien `/?ref=CODE`. Le parrain gagne 1 tampon quand son ami reçoit son premier tampon en caisse.
- Avis Google : renseignez `GOOGLE_AVIS_URL` (lien d'avis de votre fiche) pour afficher le bouton sur la carte du client. Aucune récompense n'est liée à l'avis : Google l'interdit.
- Relances : onglet Relances du tableau de bord (liste préparée automatiquement à l'ouverture).
