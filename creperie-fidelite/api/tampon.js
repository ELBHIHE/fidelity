import { sql, tel, autorise } from '../lib/db.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!autorise(req, res, 'x-pin', process.env.STAFF_PIN)) return;
  const t = tel(req.body?.telephone);
  const r = await sql`
    UPDATE clients
    SET tampons = (tampons + 1) % 10,
        recompenses_dispo = recompenses_dispo + ((tampons + 1) / 10),
        derniere_visite = now()
    WHERE telephone = ${t}
      AND (derniere_visite IS NULL OR derniere_visite < now() - interval '2 minutes')
    RETURNING id, prenom, tampons, recompenses_dispo`;
  if (!r.length)
    return res.status(404).json({ error: 'Client introuvable, ou tampon déjà ajouté à l’instant' });
  await sql`INSERT INTO visites (client_id) VALUES (${r[0].id})`;
  res.json(r[0]);
}
