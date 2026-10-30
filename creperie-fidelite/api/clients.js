import { sql, autorise, REQUIS } from '../lib/db.js';
export default async function handler(req, res) {
  if (!autorise(req, res, 'x-admin', process.env.ADMIN_PASSWORD)) return;
  const clients = await sql`
    SELECT prenom, telephone, tampons, recompenses_dispo,
           consentement_marketing AS offres, derniere_visite, created_at
    FROM clients ORDER BY created_at DESC LIMIT 2000`;
  res.json({ clients, requis: REQUIS });
}
