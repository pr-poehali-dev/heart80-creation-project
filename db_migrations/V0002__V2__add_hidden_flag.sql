ALTER TABLE t_p93967550_heart80_creation_pro.submissions ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE;

UPDATE t_p93967550_heart80_creation_pro.submissions SET hidden = TRUE WHERE artist IN ('VELVET.EXE', 'MRAK SOUND', 'SOLNCE_OFF', 'TEST_ARTIST');