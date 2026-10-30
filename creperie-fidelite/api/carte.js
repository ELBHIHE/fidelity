import { sql, tel, REQUIS } from '../lib/db.js';
export default async function handler(req, res) {
  const r = await sql`SELECT prenom, tampons, recompenses_dispo FROM clients
                      WHERE telephone = ${tel(req.query.telephone)}`;
  r.length ? res.json({ ...r[0], requis: REQUIS }) : res.status(404).json({ error: 'Carte introuvable' });
}
