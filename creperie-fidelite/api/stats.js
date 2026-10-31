import { sql, autorise } from '../lib/db.js';
export default async function handler(req, res) {
  if (!autorise(req, res, 'x-admin', process.env.ADMIN_PASSWORD)) return;
  const [s] = await sql`
    SELECT count(*)::int AS total,
      count(*) FILTER (WHERE created_at > now() - interval '30 days')::int AS nouveaux,
      count(*) FILTER (WHERE derniere_visite > now() - interval '30 days')::int AS actifs
    FROM clients`;
  const [v] = await sql`SELECT count(*)::int AS n FROM visites WHERE created_at > now() - interval '30 days'`;
  const inactifs = await sql`
    SELECT prenom, telephone FROM clients
    WHERE consentement_marketing AND derniere_visite < now() - interval '30 days'
    ORDER BY derniere_visite LIMIT 50`;
  const anniv = await sql`
    SELECT prenom, telephone FROM clients
    WHERE consentement_marketing
      AND date_part('month', date_naissance) = date_part('month', now())
      AND date_part('day', date_naissance) = date_part('day', now())`;
  res.json({ ...s, visites30: v.n, inactifs, anniv });
}
