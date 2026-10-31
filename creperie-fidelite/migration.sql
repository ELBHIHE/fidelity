-- À exécuter une seule fois dans le SQL Editor de Neon (base déjà en service)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS code_parrain TEXT UNIQUE;
UPDATE clients SET code_parrain = upper(substr(md5(random()::text || id::text), 1, 6)) WHERE code_parrain IS NULL;
ALTER TABLE clients ALTER COLUMN code_parrain SET DEFAULT upper(substr(md5(random()::text), 1, 6));
ALTER TABLE clients ADD COLUMN IF NOT EXISTS parrain_id INT REFERENCES clients(id);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS parrainage_valide BOOLEAN DEFAULT false;
CREATE TABLE IF NOT EXISTS relances (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES clients(id),
  type TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'a_envoyer',
  created_at TIMESTAMPTZ DEFAULT now(),
  envoye_at TIMESTAMPTZ
);
