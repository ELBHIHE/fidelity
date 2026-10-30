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
