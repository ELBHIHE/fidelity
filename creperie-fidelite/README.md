# Fidélité crêperie (HTML/CSS/JS + Neon)

1. Créez un projet sur neon.tech et exécutez `schema.sql` dans son éditeur SQL.
2. Poussez ce dossier sur GitHub, puis importez-le sur vercel.com.
3. Dans Vercel > Settings > Environment Variables, ajoutez `DATABASE_URL`, `STAFF_PIN`, `ADMIN_PASSWORD` (voir `.env.example`).
4. Pages : `/` client, `/caisse.html` caissier, `/admin.html` patron.
5. Imprimez un QR code vers l’URL de la page client.

Test local : `npm i -g vercel`, `npm i`, copiez `.env.example` en `.env`, puis `vercel dev`.
