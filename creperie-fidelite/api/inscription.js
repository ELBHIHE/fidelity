import { sql, tel, REQUIS } from '../lib/db.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { telephone, prenom, naissance, consent } = req.body || {};
  const t = tel(telephone);
  if (t.length < 9 || !prenom?.trim())
    return res.status(400).json({ error: 'Prénom et téléphone valides requis' });
  const r = await sql`
    INSERT INTO clients (telephone, prenom, date_naissance, consentement_marketing)
    VALUES (${t}, ${prenom.trim().slice(0, 50)}, ${naissance || null}, ${!!consent})
    ON CONFLICT (telephone) DO UPDATE SET telephone = EXCLUDED.telephone
    RETURNING telephone, prenom, tampons, recompenses_dispo`;
  res.json({ ...r[0], requis: REQUIS });
}
