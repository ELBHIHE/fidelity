CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  telephone TEXT UNIQUE NOT NULL,
  prenom TEXT NOT NULL,
  date_naissance DATE,
  consentement_marketing BOOLEAN DEFAULT false,
  tampons INT DEFAULT 0,
  recompenses_dispo INT DEFAULT 0,
  derniere_visite TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS visites (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES clients(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
