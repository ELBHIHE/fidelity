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
