-- Java 10: kërkesat për vend. Një udhëtar ka maksimumi një kërkesë për udhëtim.
CREATE TABLE IF NOT EXISTS kerkesat (
  id         SERIAL PRIMARY KEY,
  udhetim_id TEXT NOT NULL REFERENCES udhetimet(id),
  github_id  TEXT NOT NULL REFERENCES profilet(github_id),
  statusi    TEXT NOT NULL DEFAULT 'ne_pritje' CHECK (statusi IN ('ne_pritje', 'pranuar', 'refuzuar')),
  krijuar    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (udhetim_id, github_id)
);

-- Llogari fiktive për prova (nuk hyhet me të; përdoret vetëm si rresht në databazë).
INSERT INTO profilet (github_id, emri, roli)
VALUES ('DEMO-UDHETAR-1', 'Udhëtar demo', 'udhetar')
ON CONFLICT (github_id) DO NOTHING;

SELECT id, udhetim_id, github_id, statusi FROM kerkesat ORDER BY id;
