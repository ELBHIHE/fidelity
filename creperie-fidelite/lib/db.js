import { neon } from '@neondatabase/serverless';
export const sql = neon(process.env.DATABASE_URL);
export const tel = t => String(t || '').replace(/\D/g, '');
export function autorise(req, res, header, secret) {
  if (!secret || req.headers[header] !== secret) {
    res.status(401).json({ error: 'Code incorrect' });
    return false;
  }
  return true;
}
// Nombre de tampons pour une crêpe offerte : 2 pour les tests, mettre TAMPONS_REQUIS=10 en production
export const REQUIS = Number(process.env.TAMPONS_REQUIS) || 2;
