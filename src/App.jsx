import { useState, useMemo } from "react";
import { BORROWERS, STAGES, STAGE_COLORS, fmt, fmtFull, DASHBOARD_STATS, MONTHLY_DATA } from "./data.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

function RiskRing({ score }) {
  const color = score >= 85 ? "#ef4444" : score >= 65 ? "#f59e0b" : "#22c55e";
  return (
    <div className="risk-ring" style={{ borderColor: color, color }}>
      {score}
    </div>
  );
}

function ProgBar({ value, max, color = "var(--accent)" }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="prog-wrap">
      <div className="prog-bar" style={{ width: pct + "%", background: color }} />
    </div>
  );
}

function CallTypeBadge({ type }) {
  if (type === "ai") return <span className="badge badge-purple">🤖 AI</span>;
  if (type === "incoming") return <span className="badge badge-green">↙ Кириш</span>;
  return <span className="badge badge-blue">↗ Чиқиш</span>;
}

function ResultBadge({ result }) {
  if (result.includes("бош торт") || result.includes("Жавоб берм")) return <span className="badge badge-red">{result}</span>;
  if (result.includes("Ваъда")) return <span className="badge badge-green">{result}</span>;
  if (result.includes("SMS")) return <span className="badge badge-gray">{result}</span>;
  return <span className="badge badge-yellow">{result}</span>;
}

// ─── 360 Tabs ───────────────────────────────────────────────────────────────

function TabCredit({ b }) {
  const progress = Math.round((b.totalPaid / b.amount) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="info-grid">
        <div className="info-item"><span className="info-label">Кредит суммаси</span><span className="info-value amt-accent">{fmtFull(b.amount)}</span></div>
        <div className="info-item"><span className="info-label">Муддати ўтган</span><span className="info-value amt-danger">{fmtFull(b.overdue)}</span></div>
        <div className="info-item"><span className="info-label">DPD (кун)</span><span className="info-value" style={{ color: b.dpd > 90 ? "var(--danger)" : b.dpd > 30 ? "var(--warning)" : "var(--success)" }}>{b.dpd} кун</span></div>
        <div className="info-item"><span className="info-label">Маҳсулот</span><span className="info-value">{b.product}</span></div>
        <div className="info-item"><span className="info-label">Берилган сана</span><span className="info-value">{b.issueDate}</span></div>
        <div className="info-item"><span className="info-label">Тугаш санаси</span><span className="info-value">{b.endDate}</span></div>
        <div className="info-item"><span className="info-label">Шартнома №</span><span className="info-value">{b.contract}</span></div>
        <div className="info-item"><span className="info-label">Босқич</span><span className={`badge ${STAGE_COLORS[b.stage]}`}>{b.stage}</span></div>
      </div>
      <div className="card card-sm">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span className="info-label">Тўлов прогресси</span>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{fmtFull(b.totalPaid)} / {fmtFull(b.amount)} ({progress}%)</span>
        </div>
        <ProgBar value={b.totalPaid} max={b.amount} color={progress > 60 ? "var(--success)" : progress > 30 ? "var(--warning)" : "var(--danger)"} />
      </div>
    </div>
  );
}

function TabClient({ b }) {
  return (
    <div className="info-grid">
      <div className="info-item"><span className="info-label">Тўлиқ исм</span><span className="info-value">{b.name}</span></div>
      <div className="info-item"><span className="info-label">Телефон</span><span className="info-value">{b.phone}</span></div>
      <div className="info-item"><span className="info-label">ИНН</span><span className="info-value">{b.inn}</span></div>
      <div className="info-item"><span className="info-label">Паспорт</span><span className="info-value">{b.passportSeries}</span></div>
      <div className="info-item"><span className="info-label">Манзил</span><span className="info-value">{b.address}</span></div>
      <div className="info-item"><span className="info-label">Иш жойи</span><span className="info-value">{b.employer}</span></div>
      <div className="info-item"><span className="info-label">Ойлик даромад</span><span className="info-value">{fmtFull(b.salary)}</span></div>
      <div className="info-item"><span className="info-label">Коллектор</span><span className="info-value">{b.collector}</span></div>
      <div className="info-item">
        <span className="info-label">Риск балли</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <RiskRing score={b.risk} />
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{b.risk >= 85 ? "Юқори хавф" : b.risk >= 65 ? "Ўрта хавф" : "Паст хавф"}</span>
        </div>
      </div>
    </div>
  );
}

function TabCalls({ calls }) {
  if (!calls.length) return <div className="empty"><div className="empty-icon">📞</div><p>Қўнғироқлар йўқ</p></div>;
  return (
    <div className="timeline">
      {calls.map((c) => (
        <div key={c.id} className="tl-item">
          <div className="tl-dot">{c.type === "ai" ? "🤖" : c.type === "incoming" ? "↙" : "↗"}</div>
          <div className="tl-body">
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="tl-title">{c.date} — {c.time}</span>
              <CallTypeBadge type={c.type} />
              <ResultBadge result={c.result} />
              <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: "auto" }}>⏱ {c.duration}</span>
            </div>
            <div className="tl-meta">Оператор: {c.operator}</div>
            {c.note && <div className="tl-text">{c.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function TabAI({ aiChats, aiRecs }) {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState(aiChats);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date();
    const t = now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");
    setChats((p) => [
      ...p,
      { role: "user", text: input, time: t },
      { role: "bot", text: "Маълумот қабул қилинди. Коллекция менежери 24 соат ичида боғланади.", time: t },
    ]);
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>AI Тавсиялар</div>
        {aiRecs.map((r, i) => (
          <div key={i} className={`rec-item ${r.type}`}>
            <span className="rec-icon">{r.icon}</span>
            <div className="rec-body">
              <div className="rec-title">{r.title}</div>
              <div className="rec-desc">{r.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <hr className="divider" />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>AI Мулоқот Тарихи</div>
        <div className="chat-wrap">
          {chats.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="msg-avatar">{m.role === "bot" ? "🤖" : "👤"}</div>
              <div>
                <div className="msg-bubble">{m.text}</div>
                <div className="msg-time">{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input
            className="input"
            placeholder="Хабар юборинг..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="btn btn-primary" onClick={send}>Юбориш</button>
        </div>
      </div>
    </div>
  );
}

function TabCollateral({ collateral }) {
  if (!collateral.length) return <div className="empty"><div className="empty-icon">🏠</div><p>Гаров маълумотлари йўқ</p></div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {collateral.map((g) => (
        <div key={g.id} className="card card-sm">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{g.object}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{g.id}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <span className={`badge ${g.auctioned ? "badge-red" : "badge-green"}`}>{g.status}</span>
              {g.auctioned && <span className="badge badge-orange">Аукционда</span>}
            </div>
          </div>
          <div className="info-grid">
            <div className="info-item"><span className="info-label">Гаров тури</span><span className="info-value">{g.type}</span></div>
            <div className="info-item"><span className="info-label">Манзил</span><span className="info-value">{g.address}</span></div>
            <div className="info-item"><span className="info-label">Баҳоланган қиймат</span><span className="info-value amt-accent">{fmtFull(g.value)}</span></div>
            <div className="info-item"><span className="info-label">Кадастр рақами</span><span className="info-value">{g.cadastre}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabCourt({ court }) {
  if (!court.length) return <div className="empty"><div className="empty-icon">⚖️</div><p>Суд жараёнлари йўқ</p></div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {court.map((c) => (
        <div key={c.id}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 600 }}>Иш №: {c.id}</span>
            <span className="badge badge-yellow">{c.stage}</span>
            <span className="badge badge-blue">{c.status}</span>
          </div>
          <div className="info-grid" style={{ marginBottom: 14 }}>
            <div className="info-item"><span className="info-label">Охирги қарор</span><span className="info-value">{c.lastDecision || "—"}</span></div>
            <div className="info-item"><span className="info-label">Кейинги мажлис</span><span className="info-value">{c.nextDate || "—"}</span></div>
            <div className="info-item"><span className="info-label">Масъул юрист</span><span className="info-value">{c.lawyer}</span></div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Жараён тарихи</div>
          <div className="timeline">
            {c.timeline.map((t, i) => (
              <div key={i} className="tl-item">
                <div className="tl-dot">⚖</div>
                <div className="tl-body">
                  <div className="tl-title">{t.event}</div>
                  <div className="tl-meta">{t.date}</div>
                  {t.desc && <div className="tl-text">{t.desc}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TabMIB({ mib }) {
  if (!mib.length) return <div className="empty"><div className="empty-icon">🏛️</div><p>МИБ маълумотлари йўқ</p></div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {mib.map((m) => (
        <div key={m.id}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 600 }}>Ижро иши: {m.id}</span>
            <span className={`badge ${m.status === "Фаол" ? "badge-green" : m.status === "Аукцион" ? "badge-red" : "badge-gray"}`}>{m.status}</span>
          </div>
          <div className="info-grid" style={{ marginBottom: 12 }}>
            <div className="info-item"><span className="info-label">Давлат ижрочиси</span><span className="info-value">{m.executor}</span></div>
            <div className="info-item"><span className="info-label">Телефон</span><span className="info-value">{m.executorPhone}</span></div>
            <div className="info-item"><span className="info-label">Ундирилган маблағ</span><span className="info-value amt-success">{fmtFull(m.collected)}</span></div>
            <div className="info-item"><span className="info-label">Қолдиқ қарздорлик</span><span className="info-value amt-danger">{fmtFull(m.remaining)}</span></div>
            <div className="info-item"><span className="info-label">Охирги ҳаракат</span><span className="info-value">{m.lastAction}</span></div>
          </div>
          {m.collected > 0 && <ProgBar value={m.collected} max={m.collected + m.remaining} color="var(--success)" />}
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, marginBottom: 14 }}>
            {Math.round((m.collected / (m.collected + m.remaining)) * 100)}% ундирилди
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Ҳаракатлар тарихи</div>
          <div className="timeline">
            {m.actions.map((a, i) => (
              <div key={i} className="tl-item">
                <div className="tl-dot">📋</div>
                <div className="tl-body">
                  <div className="tl-title">{a.action}</div>
                  <div className="tl-meta">{a.date}</div>
                  {a.amount > 0 && <div className="tl-text amt-success">+{fmtFull(a.amount)}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TabAuction({ auction }) {
  if (!auction.length) return <div className="empty"><div className="empty-icon">🔨</div><p>Аукцион маълумотлари йўқ</p></div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {auction.map((a) => (
        <div key={a.id} className="card card-sm">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>Аукцион {a.id}</span>
            <span className={`badge ${a.paymentStatus === "Амалга оширилган" ? "badge-green" : "badge-yellow"}`}>{a.paymentStatus}</span>
          </div>
          <div className="info-grid">
            <div className="info-item"><span className="info-label">Аукцион санаси</span><span className="info-value">{a.date}</span></div>
            <div className="info-item"><span className="info-label">Ғолиб</span><span className="info-value">{a.winner || "Ҳали белгиланмаган"}</span></div>
            <div className="info-item"><span className="info-label">Сотув нархи</span><span className="info-value">{a.salePrice ? fmtFull(a.salePrice) : "—"}</span></div>
            <div className="info-item"><span className="info-label">Тўлов муддати</span><span className="info-value">{a.paymentDeadline || "—"}</span></div>
            <div className="info-item"><span className="info-label">Тўлов санаси</span><span className="info-value">{a.paymentDate || "—"}</span></div>
            <div className="info-item"><span className="info-label">Расмийлаштириш</span><span className="info-value">{a.regStatus}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabPayments({ payments }) {
  if (!payments.length) return <div className="empty"><div className="empty-icon">💳</div><p>Тўловлар йўқ</p></div>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="tbl">
        <thead>
          <tr>
            <th>Сана</th><th>Сумма</th><th>Тури</th><th>Канал</th><th>Ҳолат</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, i) => (
            <tr key={i}>
              <td>{p.date}</td>
              <td className="amt-success">{fmtFull(p.amount)}</td>
              <td>{p.type}</td>
              <td>{p.channel}</td>
              <td><span className="badge badge-green">{p.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabNotes({ notes }) {
  const [text, setText] = useState("");
  const [list, setList] = useState(notes);
  const add = () => {
    if (!text.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    setList((p) => [{ date: today, author: "Сиз", text }, ...p]);
    setText("");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <textarea
          className="input"
          rows={3}
          placeholder="Изоҳ қўшинг..."
          style={{ resize: "vertical" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary btn-sm" style={{ alignSelf: "flex-end" }} onClick={add}>Қўшиш</button>
      </div>
      {list.map((n, i) => (
        <div key={i} className="card card-sm">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{n.author}</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{n.date}</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>{n.text}</p>
        </div>
      ))}
    </div>
  );
}

// ─── 360° Card Modal ─────────────────────────────────────────────────────────

const TABS_360 = [
  { key: "credit", label: "💳 Кредит" },
  { key: "client", label: "👤 Мижоз" },
  { key: "calls", label: "📞 Қўнғироқлар" },
  { key: "ai", label: "🤖 AI Панель" },
  { key: "collateral", label: "🏠 Гаров" },
  { key: "court", label: "⚖️ Суд" },
  { key: "mib", label: "🏛️ МИБ" },
  { key: "auction", label: "🔨 Аукцион" },
  { key: "payments", label: "💰 Тўловлар" },
  { key: "notes", label: "📝 Изоҳлар" },
];

function Card360({ b, onClose }) {
  const [activeTab, setActiveTab] = useState("credit");

  const renderTab = () => {
    switch (activeTab) {
      case "credit": return <TabCredit b={b} />;
      case "client": return <TabClient b={b} />;
      case "calls": return <TabCalls calls={b.calls} />;
      case "ai": return <TabAI aiChats={b.aiChats} aiRecs={b.aiRecs} />;
      case "collateral": return <TabCollateral collateral={b.collateral} />;
      case "court": return <TabCourt court={b.court} />;
      case "mib": return <TabMIB mib={b.mib} />;
      case "auction": return <TabAuction auction={b.auction} />;
      case "payments": return <TabPayments payments={b.payments} />;
      case "notes": return <TabNotes notes={b.notes} />;
      default: return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <RiskRing score={b.risk} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  {b.contract} · {b.phone} · DPD: {b.dpd} кун
                </div>
              </div>
              <span className={`badge ${STAGE_COLORS[b.stage]}`} style={{ marginLeft: 4 }}>{b.stage}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginLeft: "auto", alignItems: "center" }}>
            <div style={{ textAlign: "right" }}>
              <div className="info-label">Муддати ўтган</div>
              <div className="amt-danger" style={{ fontWeight: 700, fontSize: 16 }}>{fmtFull(b.overdue)}</div>
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="tabs">
          {TABS_360.map((t) => (
            <button
              key={t.key}
              className={`tab-btn${activeTab === t.key ? " active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="modal-body">
          <div className="tab-panel">{renderTab()}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Borrowers List ───────────────────────────────────────────────────────────

function BorrowerList() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("Барчаси");
  const [selected, setSelected] = useState(null);

  const counts = useMemo(() => {
    const c = {};
    BORROWERS.forEach((b) => { c[b.stage] = (c[b.stage] || 0) + 1; });
    return c;
  }, []);

  const filtered = useMemo(() =>
    BORROWERS.filter((b) => {
      const matchStage = stage === "Барчаси" || b.stage === stage;
      const q = search.toLowerCase();
      const matchSearch = !q || b.name.toLowerCase().includes(q) || b.contract.toLowerCase().includes(q) || b.phone.includes(q);
      return matchStage && matchSearch;
    }), [search, stage]);

  return (
    <div>
      <div className="sec-header">
        <div>
          <div className="sec-title">Муаммоли кредитлар</div>
          <div className="sec-sub">{filtered.length} та кредит топилди</div>
        </div>
        <button className="btn btn-primary btn-sm">+ Янги кредит</button>
      </div>

      <div className="search-row">
        <div className="search-wrap">
          <span className="ico">🔍</span>
          <input
            className="input"
            placeholder="Исм, шартнома рақами ёки телефон..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="stage-filters">
        {STAGES.map((s) => (
          <button
            key={s}
            className={`stage-btn${stage === s ? " active" : ""}`}
            onClick={() => setStage(s)}
          >
            {s}
            {s !== "Барчаси" && counts[s] && <span className="stage-count">{counts[s]}</span>}
            {s === "Барчаси" && <span className="stage-count">{BORROWERS.length}</span>}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Мижоз</th>
                <th>Шартнома</th>
                <th>Маҳсулот</th>
                <th>Муддати ўтган</th>
                <th>DPD</th>
                <th>Босқич</th>
                <th>Коллектор</th>
                <th>Риск</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{b.phone}</div>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{b.contract}</td>
                  <td>{b.product}</td>
                  <td className="amt-danger">{fmt(b.overdue)} сўм</td>
                  <td>
                    <span style={{ fontWeight: 600, color: b.dpd > 90 ? "var(--danger)" : b.dpd > 30 ? "var(--warning)" : "var(--success)" }}>
                      {b.dpd}
                    </span>
                  </td>
                  <td><span className={`badge ${STAGE_COLORS[b.stage]}`}>{b.stage}</span></td>
                  <td style={{ fontSize: 13 }}>{b.collector}</td>
                  <td><RiskRing score={b.risk} /></td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(b)}>
                      360° Карта
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <Card360 b={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function MiniBarChart({ data, key1, key2, label1, label2, color1, color2 }) {
  const max = Math.max(...data.map((d) => Math.max(d[key1], d[key2])));
  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: color1, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: color1, display: "inline-block" }} />
          {label1}
        </span>
        <span style={{ fontSize: 11, color: color2, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: color2, display: "inline-block" }} />
          {label2}
        </span>
      </div>
      <div className="bar-chart">
        {data.map((d, i) => (
          <div key={i} className="bar-col">
            <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 70 }}>
              <div className="bar" style={{ height: `${(d[key1] / max) * 100}%`, background: color1, width: "45%" }} title={label1 + ": " + d[key1]} />
              <div className="bar" style={{ height: `${(d[key2] / max) * 100}%`, background: color2, width: "45%" }} title={label2 + ": " + d[key2]} />
            </div>
            <div className="bar-label">{d.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DateRangeInput({ label, from, to, onFrom, onTo }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {label && <span style={{ fontSize: 12, color: "var(--muted)" }}>{label}:</span>}
      <input type="date" className="input" style={{ width: "auto" }} value={from} onChange={(e) => onFrom(e.target.value)} />
      <span style={{ fontSize: 12, color: "var(--muted)" }}>—</span>
      <input type="date" className="input" style={{ width: "auto" }} value={to} onChange={(e) => onTo(e.target.value)} />
    </div>
  );
}

function Dashboard() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const lastDay = now.toISOString().slice(0, 10);

  const [range1From, setRange1From] = useState(firstDay);
  const [range1To, setRange1To] = useState(lastDay);
  const [range2From, setRange2From] = useState(firstDay);
  const [range2To, setRange2To] = useState(lastDay);
  const [range3From, setRange3From] = useState(firstDay);
  const [range3To, setRange3To] = useState(lastDay);

  const s = DASHBOARD_STATS;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="sec-header">
        <div>
          <div className="sec-title">Бош Панел (Dashboard)</div>
          <div className="sec-sub">Раҳбарият учун асосий кўрсаткичлар (KPI)</div>
        </div>
        <button className="btn btn-ghost btn-sm">📊 Ҳисобот юклаш</button>
      </div>

      {/* KPI Row 1 — Muddatli kredit + Yangi */}
      <div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>📅 Ой бошидаги муаммоли кредитлар</span>
            <DateRangeInput from={range1From} to={range1To} onFrom={setRange1From} onTo={setRange1To} />
          </div>
          <div className="g4">
            <div className="kpi danger">
              <div className="kpi-label">Муаммоли кредитлар сони</div>
              <div className="kpi-value" style={{ color: "var(--danger)" }}>{s.problemStart.count}</div>
              <div className="kpi-sub">{range1From} — {range1To}</div>
              <div className="kpi-trend up">+8 ўтган ойга нисбатан</div>
            </div>
            <div className="kpi danger">
              <div className="kpi-label">Муаммоли кредитлар суммаси</div>
              <div className="kpi-value" style={{ color: "var(--danger)" }}>{fmt(s.problemStart.amount)}</div>
              <div className="kpi-sub">сўм</div>
              <div className="kpi-trend up">+12.3% ўсди</div>
            </div>
            <div className="kpi warning">
              <div className="kpi-label">Янги муаммоли кредитлар сони</div>
              <div className="kpi-value" style={{ color: "var(--warning)" }}>{s.newProblem.count}</div>
              <div className="kpi-sub">{range1From} — {range1To}</div>
              <div className="kpi-trend up">+3 ўтган ойга</div>
            </div>
            <div className="kpi warning">
              <div className="kpi-label">Янги муаммоли суммаси</div>
              <div className="kpi-value" style={{ color: "var(--warning)" }}>{fmt(s.newProblem.amount)}</div>
              <div className="kpi-sub">сўм</div>
              <div className="kpi-trend neu">Барқарор</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row 2 — Undirish */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>✅ Ундирилган кредитлар</span>
          <DateRangeInput from={range2From} to={range2To} onFrom={setRange2From} onTo={setRange2To} />
        </div>
        <div className="g4">
          <div className="kpi success">
            <div className="kpi-label">Ундирилган кредитлар сони</div>
            <div className="kpi-value" style={{ color: "var(--success)" }}>{s.recovered.count}</div>
            <div className="kpi-sub">{range2From} — {range2To}</div>
            <div className="kpi-trend down">+5 ўтган ойга</div>
          </div>
          <div className="kpi success">
            <div className="kpi-label">Ундирилган маблағлар ҳажми</div>
            <div className="kpi-value" style={{ color: "var(--success)" }}>{fmt(s.recoveredAmount)}</div>
            <div className="kpi-sub">сўм</div>
            <div className="kpi-trend down">+18.5% ўсди</div>
          </div>
          <div className="kpi accent">
            <div className="kpi-label">Суд жараёнидаги кредитлар</div>
            <div className="kpi-value" style={{ color: "var(--accent)" }}>{s.inCourt}</div>
            <div className="kpi-sub">та фаол суд иши</div>
            <div className="kpi-trend neu">Барқарор</div>
          </div>
          <div className="kpi purple">
            <div className="kpi-label">МИБ ижросидаги кредитлар</div>
            <div className="kpi-value" style={{ color: "var(--purple)" }}>{s.inMib}</div>
            <div className="kpi-sub">та ижро иши</div>
            <div className="kpi-trend neu">-2 ундирилди</div>
          </div>
        </div>
      </div>

      {/* KPI Row 3 — Auction */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>🔨 Аукцион кўрсаткичлари</span>
          <DateRangeInput from={range3From} to={range3To} onFrom={setRange3From} onTo={setRange3To} />
        </div>
        <div className="g4">
          <div className="kpi warning">
            <div className="kpi-label">Аукционга чиқарилган гаровлар</div>
            <div className="kpi-value" style={{ color: "var(--warning)" }}>{s.auctionTotal}</div>
            <div className="kpi-sub">та мулк</div>
          </div>
          <div className="kpi success">
            <div className="kpi-label">Сотилган гаров мулклари</div>
            <div className="kpi-value" style={{ color: "var(--success)" }}>{s.auctionSold}</div>
            <div className="kpi-sub">та мулк</div>
            <div className="kpi-trend down">+1 ўтган ойга</div>
          </div>
          <div className="kpi warning">
            <div className="kpi-label">Тўлов кутилаётган аукционлар</div>
            <div className="kpi-value" style={{ color: "var(--warning)" }}>{s.auctionPending}</div>
            <div className="kpi-sub">та аукцион</div>
          </div>
          <div className="kpi accent">
            <div className="kpi-label">Ундириш самарадорлиги</div>
            <div className="kpi-value" style={{ color: "var(--accent)" }}>
              {Math.round((s.auctionSold / s.auctionTotal) * 100)}%
            </div>
            <div className="kpi-sub">аукционда сотилди</div>
            <div className="kpi-trend down">+5% ўсди</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="g2">
        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Ойлик динамика</div>
          <MiniBarChart
            data={MONTHLY_DATA}
            key1="recovered" key2="newProblem"
            label1="Ундирилган (млн)" label2="Янги муаммоли (млн)"
            color1="var(--success)" color2="var(--danger)"
          />
        </div>
        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Портфель тузилиши (босқич бўйича)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Боғланиш", count: 52, total: 127, color: "var(--accent)" },
              { label: "Суд", count: 38, total: 127, color: "var(--warning)" },
              { label: "МИБ", count: 29, total: 127, color: "var(--purple)" },
              { label: "Аукцион", count: 8, total: 127, color: "var(--danger)" },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12 }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{item.count} та ({Math.round(item.count / item.total * 100)}%)</span>
                </div>
                <ProgBar value={item.count} max={item.total} color={item.color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent auctions table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Сўнгги аукцион натижалари</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Аукцион №</th><th>Мижоз</th><th>Мулк</th><th>Башланиш нархи</th>
                <th>Сотув нархи</th><th>Сана</th><th>Тўлов</th><th>Расмийлаштириш</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AUK-2024-341</td>
                <td>Бобур Эргашев</td>
                <td>Савдо маркази, Самарқанд</td>
                <td className="amt-accent">280 млн сўм</td>
                <td className="amt-success">—</td>
                <td>2024-07-15</td>
                <td><span className="badge badge-yellow">Кутилmoqda</span></td>
                <td><span className="badge badge-blue">Жараёнда</span></td>
              </tr>
              <tr>
                <td>AUK-2024-298</td>
                <td>Фарруx Тошматов</td>
                <td>2-хонали квартира, Тошкент</td>
                <td className="amt-accent">145 млн сўм</td>
                <td className="amt-success">162 млн сўм</td>
                <td>2024-06-20</td>
                <td><span className="badge badge-green">Тўланди</span></td>
                <td><span className="badge badge-green">Расмийлашди</span></td>
              </tr>
              <tr>
                <td>AUK-2024-271</td>
                <td>Зулфия Назарова</td>
                <td>Chevrolet Equinox 2022</td>
                <td className="amt-accent">48 млн сўм</td>
                <td className="amt-success">51 млн сўм</td>
                <td>2024-06-10</td>
                <td><span className="badge badge-green">Тўланди</span></td>
                <td><span className="badge badge-green">Расмийлашди</span></td>
              </tr>
              <tr>
                <td>AUK-2024-255</td>
                <td>Жасур Холматов</td>
                <td>Омборхона, Фарғона</td>
                <td className="amt-accent">72 млн сўм</td>
                <td className="amt-danger">—</td>
                <td>2024-06-05</td>
                <td><span className="badge badge-red">Тўланмади</span></td>
                <td><span className="badge badge-red">Бекор қилинди</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">Trastbank <span>Collection CRM</span></div>
        <nav className="nav">
          <button
            className={`nav-btn${page === "dashboard" ? " active" : ""}`}
            onClick={() => setPage("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-btn${page === "list" ? " active" : ""}`}
            onClick={() => setPage("list")}
          >
            📋 Кредитлар
          </button>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--accent)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700
          }}>З</div>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Зафар Т.</span>
        </div>
      </header>

      <main className="main">
        {page === "dashboard" && <Dashboard />}
        {page === "list" && <BorrowerList />}
      </main>
    </div>
  );
}
