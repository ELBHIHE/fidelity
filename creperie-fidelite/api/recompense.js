import { sql, tel, autorise, REQUIS } from '../lib/db.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!autorise(req, res, 'x-pin', process.env.STAFF_PIN)) return;
  const r = await sql`
    UPDATE clients SET recompenses_dispo = recompenses_dispo - 1
    WHERE telephone = ${tel(req.body?.telephone)} AND recompenses_dispo > 0
    RETURNING prenom, tampons, recompenses_dispo`;
  r.length ? res.json({ ...r[0], requis: REQUIS }) : res.status(404).json({ error: 'Aucune récompense disponible' });
}
