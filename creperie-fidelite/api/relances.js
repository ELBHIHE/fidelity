import { sql, autorise } from '../lib/db.js';
export default async function handler(req, res) {
  if (!autorise(req, res, 'x-admin', process.env.ADMIN_PASSWORD)) return;
  if (req.method === 'POST') {
    const { id, statut } = req.body || {};
    if (!['envoye', 'ignore'].includes(statut)) return res.status(400).json({ error: 'Statut invalide' });
    await sql`UPDATE relances SET statut = ${statut}, envoye_at = now() WHERE id = ${id} AND statut = 'a_envoyer'`;
    return res.json({ ok: true });
  }
  // Préparation automatique de la liste du jour, sans doublon sur la période
  await sql`INSERT INTO relances (client_id, type)
    SELECT c.id, 'inactif' FROM clients c
    WHERE c.consentement_marketing AND COALESCE(c.derniere_visite, c.created_at) < now() - interval '30 days'
      AND NOT EXISTS (SELECT 1 FROM relances r WHERE r.client_id = c.id AND r.type = 'inactif' AND r.created_at > now() - interval '30 days')`;
  await sql`INSERT INTO relances (client_id, type)
    SELECT c.id, 'anniversaire' FROM clients c
    WHERE c.consentement_marketing AND to_char(c.date_naissance, 'MM-DD') = to_char(now(), 'MM-DD')
      AND NOT EXISTS (SELECT 1 FROM relances r WHERE r.client_id = c.id AND r.type = 'anniversaire' AND r.created_at > now() - interval '300 days')`;
  const relances = await sql`SELECT r.id, r.type, c.prenom, c.telephone FROM relances r
    JOIN clients c ON c.id = r.client_id WHERE r.statut = 'a_envoyer' ORDER BY r.created_at LIMIT 200`;
  res.json({ relances });
}
