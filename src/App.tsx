import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/60a20438-f8f7-491e-a464-80d2d397aaba";

type Section = "home" | "submit" | "rating" | "admin" | "about" | "contacts";

interface Submission {
  id: number;
  artist: string;
  releaseLink: string;
  tgLink: string;
  description: string;
  submittedAt: string;
  scores?: {
    text: number;
    quality: number;
    charisma: number;
    structure: number;
    vibe: number;
    hit: number;
  };
  total?: number;
  rated: boolean;
}

const CRITERIA = [
  { key: "text", label: "Текст / Образ", max: 10, description: "Смысловая глубина, образность, поэтика" },
  { key: "quality", label: "Качество сведения", max: 10, description: "Звук, микс, мастеринг" },
  { key: "charisma", label: "Харизма / Личность", max: 10, description: "Уникальность подачи и образа" },
  { key: "structure", label: "Структура трека", max: 10, description: "Построение, динамика, аранжировка" },
  { key: "vibe", label: "Вайб", max: 20, description: "Общее ощущение, атмосфера, погружение" },
  { key: "hit", label: "Хитовость", max: 20, description: "Запоминаемость, потенциал, крючки" },
] as const;

const ADMIN_PASSWORD = "lovesongkaiangell";


function PixelHeart({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor">
      <rect x="4" y="8" width="4" height="4" />
      <rect x="8" y="4" width="4" height="4" />
      <rect x="12" y="4" width="4" height="4" />
      <rect x="16" y="8" width="4" height="4" />
      <rect x="20" y="4" width="4" height="4" />
      <rect x="24" y="4" width="4" height="4" />
      <rect x="28" y="8" width="4" height="4" />
      <rect x="4" y="12" width="4" height="4" />
      <rect x="8" y="8" width="4" height="4" />
      <rect x="24" y="8" width="4" height="4" />
      <rect x="28" y="12" width="4" height="4" />
      <rect x="4" y="16" width="4" height="4" />
      <rect x="28" y="16" width="4" height="4" />
      <rect x="8" y="20" width="4" height="4" />
      <rect x="24" y="20" width="4" height="4" />
      <rect x="12" y="24" width="4" height="4" />
      <rect x="20" y="24" width="4" height="4" />
      <rect x="16" y="28" width="4" height="4" />
      <rect x="8" y="12" width="16" height="4" />
      <rect x="8" y="16" width="16" height="4" />
      <rect x="12" y="20" width="8" height="4" />
    </svg>
  );
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const blocks = Math.ceil(max / 2);
  const filled = Math.round((score / max) * blocks);
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: blocks }).map((_, i) => (
        <div
          key={i}
          className={`h-3 w-4 border border-white/60 ${i < filled ? "bg-white" : "bg-white/5"}`}
        />
      ))}
    </div>
  );
}

function NavBar({ current, onChange }: { current: Section; onChange: (s: Section) => void }) {
  const links: { key: Section; label: string }[] = [
    { key: "home", label: "// ГЛАВНАЯ" },
    { key: "submit", label: "// ПОДАТЬ" },
    { key: "rating", label: "// РЕЙТИНГ" },
    { key: "about", label: "// О ПРОЕКТЕ" },
    { key: "contacts", label: "// КОНТАКТЫ" },
  ];

  return (
    <nav className="border-b-2 border-white/20 bg-black/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6 overflow-x-auto">
        <button onClick={() => onChange("home")} className="flex items-center gap-2 shrink-0 mr-4">
          <PixelHeart size={20} />
          <span className="font-pixel text-[9px] text-white leading-none">HEART80</span>
        </button>
        {links.map((l) => (
          <button
            key={l.key}
            onClick={() => onChange(l.key)}
            className={`font-mono text-[11px] tracking-wider whitespace-nowrap transition-colors ${
              current === l.key ? "text-white border-b-2 border-white pb-0.5" : "text-white/40 hover:text-white/80"
            }`}
          >
            {l.label}
          </button>
        ))}
        <div className="ml-auto shrink-0">
          <button
            onClick={() => onChange("admin")}
            className={`pixel-btn text-[10px] py-1.5 px-3 ${current === "admin" ? "!bg-white !text-black" : ""}`}
          >
            ADMIN
          </button>
        </div>
      </div>
    </nav>
  );
}

function HomePage({ onChange }: { onChange: (s: Section) => void }) {
  return (
    <div className="min-h-screen grid-bg scanlines">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        <div className="fade-in">
          <div className="flex items-center gap-4 mb-8">
            <PixelHeart size={48} />
            <div>
              <p className="font-mono text-white/40 text-xs tracking-widest mb-2">ТГК - @Heart80P</p>
              <h1 className="font-pixel text-3xl md:text-5xl text-white leading-tight">
                HEART<span className="text-white/50">80</span>
              </h1>
            </div>
          </div>

          <div className="border-l-4 border-white/30 pl-6 mb-12">
            <p className="font-mono text-white/70 text-base leading-relaxed max-w-2xl">
              Независимая система оценивания музыкальных работ.<br />
              Максимум <span className="text-white font-bold">80 баллов</span>. Честно. Прямо. По критериям.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
            {CRITERIA.map((c) => (
              <div key={c.key} className="pixel-card hover:border-white/60 transition-colors cursor-default">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-mono text-white/50 text-[10px] uppercase tracking-wider">{c.label}</p>
                  <span className="font-pixel text-xs text-white">{c.max}</span>
                </div>
                <p className="font-mono text-white/30 text-[10px]">{c.description}</p>
              </div>
            ))}
          </div>

          <div className="pixel-card border-white/30 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-white blink" />
              <span className="font-pixel text-xs text-white">КАК ЭТО РАБОТАЕТ</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { n: "01", t: "Подаёшь работу", d: "Заполняешь анкету: ник, ссылка на релиз, TG, описание" },
                { n: "02", t: "Экспертная оценка", d: "Работа оценивается по 6 критериям с ползунками" },
                { n: "03", t: "Попадаешь в рейтинг", d: "Итоговый балл и позиция в таблице участников" },
              ].map((s) => (
                <div key={s.n} className="flex gap-3">
                  <span className="font-pixel text-[10px] text-white/20 shrink-0 mt-1">{s.n}</span>
                  <div>
                    <p className="font-mono font-bold text-white text-sm mb-1">{s.t}</p>
                    <p className="font-mono text-white/40 text-[11px] leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={() => onChange("submit")} className="pixel-btn-white text-sm">
              ПОДАТЬ РАБОТУ →
            </button>
            <button onClick={() => onChange("rating")} className="pixel-btn text-sm">
              СМОТРЕТЬ РЕЙТИНГ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitPage() {
  const [form, setForm] = useState({ artist: "", releaseLink: "", tgLink: "", description: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const wordCount = form.description.trim() ? form.description.trim().split(/\s+/).length : 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.artist.trim()) e.artist = "Введите ник артиста";
    if (!form.releaseLink.trim()) e.releaseLink = "Введите ссылку на релиз";
    if (!form.tgLink.trim()) e.tgLink = "Введите ссылку на TG";
    if (!form.description.trim()) e.description = "Добавьте описание";
    if (wordCount > 80) e.description = "Максимум 80 слов";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrors({ artist: data.error || "Ошибка при отправке" });
      }
    } catch {
      setErrors({ artist: "Ошибка сети, попробуйте снова" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center px-4">
        <div className="pixel-card border-white max-w-md w-full text-center fade-in">
          <div className="flex justify-center mb-6">
            <PixelHeart size={48} />
          </div>
          <h2 className="font-pixel text-sm text-white mb-4">РАБОТА ПОДАНА!</h2>
          <p className="font-mono text-white/60 text-sm leading-relaxed">
            Анкета получена. Ожидайте оценки.<br />
            Результат появится в таблице рейтинга.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ artist: "", releaseLink: "", tgLink: "", description: "" }); }}
            className="pixel-btn mt-6 text-xs"
          >
            ПОДАТЬ ЕЩЁ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg px-4 py-16">
      <div className="max-w-2xl mx-auto fade-in">
        <div className="mb-10">
          <p className="font-mono text-white/30 text-xs tracking-widest mb-3">АНКЕТА УЧАСТНИКА</p>
          <h2 className="font-pixel text-lg text-white">ПОДАТЬ РАБОТУ</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-mono text-xs text-white/60 tracking-wider block mb-2">
              01. НИК АРТИСТА <span className="text-white/30">*</span>
            </label>
            <input
              className="pixel-input"
              placeholder="VELVET.EXE"
              value={form.artist}
              onChange={e => setForm({ ...form, artist: e.target.value })}
            />
            {errors.artist && <p className="font-mono text-red-400 text-[11px] mt-1">{errors.artist}</p>}
          </div>

          <div>
            <label className="font-mono text-xs text-white/60 tracking-wider block mb-2">
              02. ССЫЛКА НА РЕЛИЗ <span className="text-white/30">*</span>
            </label>
            <input
              className="pixel-input"
              placeholder="https://music.yandex.ru/..."
              value={form.releaseLink}
              onChange={e => setForm({ ...form, releaseLink: e.target.value })}
            />
            {errors.releaseLink && <p className="font-mono text-red-400 text-[11px] mt-1">{errors.releaseLink}</p>}
          </div>

          <div>
            <label className="font-mono text-xs text-white/60 tracking-wider block mb-2">
              03. ССЫЛКА НА TG ДЛЯ СВЯЗИ <span className="text-white/30">*</span>
            </label>
            <input
              className="pixel-input"
              placeholder="https://t.me/username"
              value={form.tgLink}
              onChange={e => setForm({ ...form, tgLink: e.target.value })}
            />
            {errors.tgLink && <p className="font-mono text-red-400 text-[11px] mt-1">{errors.tgLink}</p>}
          </div>

          <div>
            <label className="font-mono text-xs text-white/60 tracking-wider block mb-2">
              04. ОПИСАНИЕ РАБОТЫ <span className="text-white/30">*</span>
              <span className={`ml-3 ${wordCount > 80 ? "text-red-400" : "text-white/30"}`}>
                {wordCount}/80 слов
              </span>
            </label>
            <textarea
              className="pixel-input resize-none"
              rows={5}
              placeholder="Коротко о работе — идея, контекст, что хотел сказать. До 80 слов."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <p className="font-mono text-red-400 text-[11px] mt-1">{errors.description}</p>}
          </div>

          <button type="submit" disabled={loading} className="pixel-btn-white w-full text-sm py-3 disabled:opacity-50">
            {loading ? "ОТПРАВЛЯЮ..." : "ОТПРАВИТЬ АНКЕТУ →"}
          </button>
        </form>
      </div>
    </div>
  );
}

function RatingPage() {
  const [rated, setRated] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}?action=rating`)
      .then(r => r.json())
      .then(data => setRated(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen grid-bg px-4 py-16">
      <div className="max-w-5xl mx-auto fade-in">
        <div className="mb-10">
          <p className="font-mono text-white/30 text-xs tracking-widest mb-3">ТАБЛИЦА УЧАСТНИКОВ</p>
          <h2 className="font-pixel text-lg text-white">РЕЙТИНГ</h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-2 h-2 bg-white blink inline-block mr-2" />
            <span className="font-mono text-white/30 text-sm">ЗАГРУЖАЮ...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-white/20">
                    <th className="font-mono text-[10px] text-white/40 text-left py-3 px-3 tracking-wider w-12">#</th>
                    <th className="font-mono text-[10px] text-white/40 text-left py-3 px-3 tracking-wider">АРТИСТ</th>
                    <th className="font-mono text-[10px] text-white/40 text-left py-3 px-3 tracking-wider hidden md:table-cell">ТЕКСТ</th>
                    <th className="font-mono text-[10px] text-white/40 text-left py-3 px-3 tracking-wider hidden md:table-cell">КАЧЕСТВО</th>
                    <th className="font-mono text-[10px] text-white/40 text-left py-3 px-3 tracking-wider hidden md:table-cell">ХАРИЗМА</th>
                    <th className="font-mono text-[10px] text-white/40 text-left py-3 px-3 tracking-wider hidden md:table-cell">СТРУКТУРА</th>
                    <th className="font-mono text-[10px] text-white/40 text-left py-3 px-3 tracking-wider hidden md:table-cell">ВАЙБ</th>
                    <th className="font-mono text-[10px] text-white/40 text-left py-3 px-3 tracking-wider hidden md:table-cell">ХИТ</th>
                    <th className="font-mono text-[10px] text-white/40 text-right py-3 px-3 tracking-wider">ИТОГО</th>
                  </tr>
                </thead>
                <tbody>
                  {rated.map((s, i) => (
                    <tr key={s.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="font-pixel text-[10px] py-4 px-3 text-white/30">{String(i + 1).padStart(2, "0")}</td>
                      <td className="py-4 px-3">
                        <p className="font-mono font-bold text-white text-sm">{s.artist}</p>
                        <a href={s.releaseLink} target="_blank" rel="noreferrer"
                          className="font-mono text-[10px] text-white/30 hover:text-white/70 transition-colors">
                          → слушать
                        </a>
                      </td>
                      {s.scores && (
                        <>
                          <td className="font-mono text-sm text-white/70 py-4 px-3 hidden md:table-cell">{s.scores.text}<span className="text-white/20">/10</span></td>
                          <td className="font-mono text-sm text-white/70 py-4 px-3 hidden md:table-cell">{s.scores.quality}<span className="text-white/20">/10</span></td>
                          <td className="font-mono text-sm text-white/70 py-4 px-3 hidden md:table-cell">{s.scores.charisma}<span className="text-white/20">/10</span></td>
                          <td className="font-mono text-sm text-white/70 py-4 px-3 hidden md:table-cell">{s.scores.structure}<span className="text-white/20">/10</span></td>
                          <td className="font-mono text-sm text-white/70 py-4 px-3 hidden md:table-cell">{s.scores.vibe}<span className="text-white/20">/20</span></td>
                          <td className="font-mono text-sm text-white/70 py-4 px-3 hidden md:table-cell">{s.scores.hit}<span className="text-white/20">/20</span></td>
                        </>
                      )}
                      <td className="py-4 px-3 text-right">
                        <span className="font-pixel text-sm text-white">{s.total}</span>
                        <span className="font-mono text-white/30 text-xs">/80</span>
                        <div className="mt-1 flex justify-end">
                          <ScoreBar score={s.total ?? 0} max={80} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rated.length === 0 && (
              <div className="text-center py-20">
                <p className="font-mono text-white/30">Оценённых работ пока нет</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});

  const loadSubmissions = useCallback(async (password: string) => {
    setLoadingList(true);
    try {
      const res = await fetch(API, {
        headers: { "X-Admin-Password": password },
      });
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuth(true);
      setPwErr(false);
      loadSubmissions(pw);
    } else {
      setPwErr(true);
    }
  };

  const startEdit = (s: Submission) => {
    setEditing(s.id);
    setScores(
      s.scores
        ? { ...s.scores }
        : { text: 0, quality: 0, charisma: 0, structure: 0, vibe: 0, hit: 0 }
    );
  };

  const saveScores = async (id: number) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": ADMIN_PASSWORD,
        },
        body: JSON.stringify({ scores }),
      });
      if (res.ok) {
        setEditing(null);
        loadSubmissions(ADMIN_PASSWORD);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!auth) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center px-4">
        <div className="pixel-card border-white max-w-sm w-full fade-in">
          <div className="flex items-center gap-3 mb-8">
            <Icon name="Lock" size={16} className="text-white" />
            <h2 className="font-pixel text-xs text-white">ADMIN ACCESS</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-mono text-[11px] text-white/50 block mb-2">ПАРОЛЬ</label>
              <input
                type="password"
                className="pixel-input"
                placeholder="••••••••"
                value={pw}
                onChange={e => { setPw(e.target.value); setPwErr(false); }}
              />
              {pwErr && <p className="font-mono text-red-400 text-[11px] mt-1">Неверный пароль</p>}
            </div>
            <button type="submit" className="pixel-btn-white w-full text-xs py-3">ВОЙТИ →</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg px-4 py-16">
      <div className="max-w-4xl mx-auto fade-in">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-mono text-white/30 text-xs tracking-widest mb-3">ПАНЕЛЬ АДМИНИСТРАТОРА</p>
            <h2 className="font-pixel text-lg text-white">АНКЕТЫ</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 bg-white ${loadingList ? "blink" : ""}`} />
            <span className="font-mono text-[11px] text-white/50">
              {loadingList ? "ЗАГРУЖАЮ..." : `${submissions.filter(s => s.rated).length}/${submissions.length} оценено`}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {submissions.map(s => (
            <div
              key={s.id}
              className={`pixel-card transition-colors ${s.rated ? "border-white/30" : "border-white/10"}`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${
                      s.rated
                        ? "border-white/40 text-white/60"
                        : "border-yellow-400/60 text-yellow-400/80"
                    }`}>
                      {s.rated ? "ОЦЕНЕНО" : "ОЖИДАЕТ"}
                    </span>
                    <span className="font-mono text-white/30 text-[10px]">{s.submittedAt}</span>
                  </div>
                  <h3 className="font-mono font-bold text-white text-base">{s.artist}</h3>
                </div>
                {s.rated && s.total !== undefined && (
                  <div className="text-right shrink-0">
                    <span className="font-pixel text-2xl text-white">{s.total}</span>
                    <span className="font-mono text-white/30 text-xs">/80</span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-4 text-[11px]">
                <div>
                  <span className="font-mono text-white/30">РЕЛИЗ: </span>
                  <a
                    href={s.releaseLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-white/70 hover:text-white underline break-all"
                  >
                    {s.releaseLink}
                  </a>
                </div>
                <div>
                  <span className="font-mono text-white/30">TG: </span>
                  <a
                    href={s.tgLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-white/70 hover:text-white underline"
                  >
                    {s.tgLink}
                  </a>
                </div>
              </div>

              <p className="font-mono text-white/50 text-xs leading-relaxed mb-4 border-l-2 border-white/20 pl-3">
                {s.description}
              </p>

              {editing === s.id ? (
                <div className="border-t-2 border-white/20 pt-4 space-y-5">
                  <p className="font-pixel text-[10px] text-white/60">ВЫСТАВИТЬ БАЛЛЫ</p>
                  {CRITERIA.map(c => (
                    <div key={c.key}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-mono text-xs text-white/70">{c.label}</label>
                        <div className="flex items-center gap-2">
                          <span className="font-pixel text-sm text-white w-6 text-right">
                            {scores[c.key] ?? 0}
                          </span>
                          <span className="font-mono text-white/30 text-xs">/ {c.max}</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={c.max}
                        step={1}
                        value={scores[c.key] ?? 0}
                        onChange={e => setScores({ ...scores, [c.key]: Number(e.target.value) })}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="font-mono text-[9px] text-white/20">0</span>
                        <span className="font-mono text-[9px] text-white/20">{c.max}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div>
                      <span className="font-mono text-white/40 text-xs">ИТОГО: </span>
                      <span className="font-pixel text-base text-white">
                        {Object.values(scores).reduce((a, b) => a + (b || 0), 0)}
                      </span>
                      <span className="font-mono text-white/30 text-xs">/80</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(null)} className="pixel-btn text-xs py-2 px-3">
                        ОТМЕНА
                      </button>
                      <button onClick={() => saveScores(s.id)} disabled={saving} className="pixel-btn-white text-xs py-2 px-3 disabled:opacity-50">
                        {saving ? "СОХРАНЯЮ..." : "СОХРАНИТЬ →"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button onClick={() => startEdit(s)} className="pixel-btn text-[11px] py-2 px-4">
                  {s.rated ? "РЕДАКТИРОВАТЬ ОЦЕНКУ" : "ВЫСТАВИТЬ ОЦЕНКУ →"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen grid-bg px-4 py-16">
      <div className="max-w-2xl mx-auto fade-in">
        <div className="mb-10">
          <p className="font-mono text-white/30 text-xs tracking-widest mb-3">ИНФОРМАЦИЯ</p>
          <h2 className="font-pixel text-lg text-white">О ПРОЕКТЕ</h2>
        </div>

        <div className="space-y-6">
          <div className="pixel-card">
            <h3 className="font-pixel text-[10px] text-white mb-4">ЧТО ТАКОЕ HEART80</h3>
            <p className="font-mono text-white/60 text-sm leading-relaxed">
              Heart80 — независимый проект для оценивания музыкальных работ.
              Максимум 80 баллов, 6 критериев, честная позиция.
            </p>
          </div>

          <div className="pixel-card">
            <h3 className="font-pixel text-[10px] text-white mb-6">ШКАЛА ОЦЕНИВАНИЯ</h3>
            <div className="space-y-4">
              {CRITERIA.map((c, i) => (
                <div key={c.key} className="flex items-start gap-4">
                  <span className="font-pixel text-[9px] text-white/20 mt-1 w-4 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono font-bold text-white text-sm">{c.label}</span>
                      <span className="font-pixel text-[10px] text-white">до {c.max}</span>
                    </div>
                    <p className="font-mono text-white/40 text-xs">{c.description}</p>
                    <div className="mt-2">
                      <ScoreBar score={c.max} max={c.max} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/20 mt-6 pt-4 flex justify-between">
              <span className="font-mono text-white/50 text-sm">МАКСИМУМ</span>
              <span className="font-pixel text-sm text-white">80 БАЛЛОВ</span>
            </div>
          </div>

          <div className="pixel-card">
            <h3 className="font-pixel text-[10px] text-white mb-4">ПРАВИЛА</h3>
            <ul className="space-y-2">
              {[
                "Работа должна быть доступна по ссылке",
                "Описание — до 80 слов, честно и по делу",
                "Одна заявка от одного артиста",
                "Решение жюри окончательное",
                "Результаты публикуются в таблице рейтинга",
              ].map((r, i) => (
                <li key={i} className="flex gap-3 font-mono text-sm text-white/60">
                  <span className="text-white/20 shrink-0">→</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactsPage() {
  return (
    <div className="min-h-screen grid-bg px-4 py-16">
      <div className="max-w-xl mx-auto fade-in">
        <div className="mb-10">
          <p className="font-mono text-white/30 text-xs tracking-widest mb-3">СВЯЗЬ</p>
          <h2 className="font-pixel text-lg text-white">КОНТАКТЫ</h2>
        </div>

        <div className="space-y-4">
          <div className="pixel-card border-white/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-white/30 flex items-center justify-center shrink-0">
                <Icon name="Send" size={16} className="text-white" />
              </div>
              <div>
                <p className="font-mono text-white/40 text-[10px] mb-1">TELEGRAM КАНАЛ</p>
                <a href="https://t.me/Heart80P" target="_blank" rel="noreferrer"
                  className="font-mono text-white text-sm hover:text-white/70 transition-colors">
                  @Heart80P
                </a>
              </div>
            </div>
          </div>

          <div className="pixel-card">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-white/30 flex items-center justify-center shrink-0">
                <PixelHeart size={18} />
              </div>
              <div>
                <p className="font-mono text-white/40 text-[10px] mb-1">ПРОЕКТ</p>
                <p className="font-mono text-white text-sm">ТГК - @Heart80P</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgreementModal({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center px-4">
      <div className="grid-bg absolute inset-0 scanlines pointer-events-none" />
      <div className="relative pixel-card border-white max-w-lg w-full fade-in">
        <div className="flex items-center gap-3 mb-6">
          <PixelHeart size={24} />
          <h2 className="font-pixel text-[11px] text-white leading-relaxed">HEART80</h2>
        </div>

        <p className="font-pixel text-[9px] text-white/60 mb-5 leading-relaxed">ПРЕЖДЕ ЧЕМ ВОЙТИ</p>

        <div className="space-y-3 mb-6">
          {[
            "Все поданные анкеты публично доступны — их видят все посетители сайта",
            "Ник артиста, ссылки и описание отображаются в открытом рейтинге",
            "Администрация не несёт ответственности за содержимое анкет",
            "Подавая анкету, вы соглашаетесь на публикацию данных",
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <span className="font-pixel text-[8px] text-white/20 shrink-0 mt-[3px]">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-mono text-white/60 text-xs leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-6 group">
          <div
            onClick={() => setChecked(!checked)}
            className={`w-5 h-5 border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors cursor-pointer ${
              checked ? "border-white bg-white" : "border-white/40 bg-transparent group-hover:border-white/70"
            }`}
          >
            {checked && <span className="font-pixel text-black text-[8px]">✓</span>}
          </div>
          <span className="font-mono text-sm text-white/70 leading-relaxed select-none">
            Я понимаю, что мои данные будут публично доступны
          </span>
        </label>

        <button
          onClick={onAccept}
          disabled={!checked}
          className="pixel-btn-white w-full text-xs py-3 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ВОЙТИ НА САЙТ →
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [section, setSection] = useState<Section>("home");
  const [agreed, setAgreed] = useState(() => {
    return sessionStorage.getItem("heart80_agreed") === "true";
  });

  const handleAccept = () => {
    sessionStorage.setItem("heart80_agreed", "true");
    setAgreed(true);
  };

  if (!agreed) {
    return <AgreementModal onAccept={handleAccept} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar current={section} onChange={setSection} />
      {section === "home" && <HomePage onChange={setSection} />}
      {section === "submit" && <SubmitPage />}
      {section === "rating" && <RatingPage />}
      {section === "admin" && <AdminPage />}
      {section === "about" && <AboutPage />}
      {section === "contacts" && <ContactsPage />}
    </div>
  );
}