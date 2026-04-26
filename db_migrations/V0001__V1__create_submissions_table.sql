
CREATE TABLE t_p93967550_heart80_creation_pro.submissions (
  id SERIAL PRIMARY KEY,
  artist TEXT NOT NULL,
  release_link TEXT NOT NULL,
  tg_link TEXT NOT NULL,
  description TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW(),
  rated BOOLEAN DEFAULT FALSE,
  score_text INTEGER DEFAULT 0,
  score_quality INTEGER DEFAULT 0,
  score_charisma INTEGER DEFAULT 0,
  score_structure INTEGER DEFAULT 0,
  score_vibe INTEGER DEFAULT 0,
  score_hit INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  rated_at TIMESTAMP
);

INSERT INTO t_p93967550_heart80_creation_pro.submissions
  (artist, release_link, tg_link, description, rated, score_text, score_quality, score_charisma, score_structure, score_vibe, score_hit, total)
VALUES
  ('VELVET.EXE', 'https://music.yandex.ru/example1', 'https://t.me/velvetexe', 'Трек о потере связи с реальностью в эпоху цифрового шума. Написан за одну ночь, продюсирование совместное.', TRUE, 8, 9, 8, 9, 17, 16, 67),
  ('MRAK SOUND', 'https://music.yandex.ru/example2', 'https://t.me/mraksound', 'Инструментальный эксперимент на стыке дрим-попа и нойза. Три месяца работы.', TRUE, 6, 8, 7, 8, 14, 12, 55),
  ('SOLNCE_OFF', 'https://music.yandex.ru/example3', 'https://t.me/solnceoff', 'Лирический альбом о городе и одиночестве. Записан на домашней студии.', FALSE, 0, 0, 0, 0, 0, 0, 0);
