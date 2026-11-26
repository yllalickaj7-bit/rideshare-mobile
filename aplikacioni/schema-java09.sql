-- Java 9: udhëtimet e ruajtura (të preferuarat). Të dhëna fiktive, pa email apo adresa reale.
-- Çelësi primar (github_id, udhetim_id) e ndalon dublikatin edhe kur shtypet dy herë butoni.
CREATE TABLE IF NOT EXISTS te_preferuarat (
  github_id  TEXT NOT NULL REFERENCES profilet(github_id),
  udhetim_id TEXT NOT NULL REFERENCES udhetimet(id),
  krijuar    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (github_id, udhetim_id)
);

SELECT github_id, udhetim_id FROM te_preferuarat ORDER BY krijuar;
