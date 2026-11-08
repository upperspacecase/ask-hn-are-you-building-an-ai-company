import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const DEMO_FPS = 30;
export const DEMO_DURATION = 225;
export const DEMO_WIDTH = 1280;
export const DEMO_HEIGHT = 620;

const C = {
  bg: "#f8fafc",
  surface: "#ffffff",
  ink: "#1e293b",
  muted: "#475569",
  faint: "#94a3b8",
  line: "#dde3ea",
  blue: "#2563eb",
  blueSoft: "#dbeafe",
  green: "#059669",
  sans: "var(--font-inter, Inter), system-ui, -apple-system, sans-serif",
};

const QUESTION = "¿En qué estado está el deploy de Grupo Andino?";

// Timeline (frames at 30fps)
const T = {
  typeStart: 6,
  typeEnd: 60,
  submit: 68,
  sourcesStart: 76,
  sourceGap: 11,
  answerStart: 124,
  answerEnd: 196,
  fadeOut: 212,
};

type Source = {
  n: number;
  kind: string;
  meta: string;
  text: string;
};

const SOURCES: Source[] = [
  {
    n: 1,
    kind: "Transcripción",
    meta: "Fireflies · 4 nov · weekly Grupo Andino",
    text: "Martín: congelamos el release 2.15 hasta que pase la auditoría de seguridad.",
  },
  {
    n: 2,
    kind: "Ticket",
    meta: "Jira · AND-312 · En progreso",
    text: "Timeout en /api/facturas en staging con más de 500 ítems.",
  },
  {
    n: 3,
    kind: "Deploy log",
    meta: "GitHub Actions · andino-prod",
    text: "3 nov 22:14 · v2.14.1 rollback a v2.14.0 · ok",
  },
  {
    n: 4,
    kind: "Config",
    meta: "clients/andino/values.yaml",
    text: "replicas: 2 · region: sa-east-1 · sso: azure-ad",
  },
];

type Segment = { text: string; cite?: number };

const ANSWER: Segment[] = [
  { text: "Grupo Andino corre " },
  { text: "v2.14.0 en producción tras el rollback del 3 nov", cite: 3 },
  { text: ". El release 2.15 está " },
  { text: "congelado hasta la auditoría de seguridad que pidió Martín", cite: 1 },
  { text: ". Bloqueante abierto: " },
  { text: "AND-312, timeout en /api/facturas, en progreso", cite: 2 },
  { text: ". Su entorno: " },
  { text: "2 réplicas en sa-east-1 con SSO Azure AD", cite: 4 },
  { text: "." },
];

const ANSWER_LEN = ANSWER.reduce((n, s) => n + s.text.length, 0);

function ease(frame: number, from: number, to: number, a: number, b: number) {
  return interpolate(frame, [from, to], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

function Cite({ n, active }: { n: number; active: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        minWidth: 24,
        height: 24,
        lineHeight: "24px",
        marginLeft: 6,
        borderRadius: 6,
        textAlign: "center",
        fontSize: 15,
        fontWeight: 700,
        color: active ? C.surface : C.blue,
        background: active ? C.blue : C.blueSoft,
        verticalAlign: "2px",
      }}
    >
      {n}
    </span>
  );
}

function SourceCard({ s, frame }: { s: Source; frame: number }) {
  const start = T.sourcesStart + (s.n - 1) * T.sourceGap;
  const opacity = ease(frame, start, start + 10, 0, 1);
  const x = ease(frame, start, start + 12, -24, 0);
  const matched = frame >= start + 14;

  // Highlight when the answer reaches this citation.
  const citeFrame = citationFrame(s.n);
  const hot = frame >= citeFrame && frame < citeFrame + 26;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        background: C.surface,
        border: `2px solid ${hot ? C.blue : C.line}`,
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 12,
        fontFamily: C.sans,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 15,
          color: C.muted,
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            lineHeight: "24px",
            textAlign: "center",
            borderRadius: 6,
            background: hot ? C.blue : C.blueSoft,
            color: hot ? C.surface : C.blue,
            fontWeight: 700,
          }}
        >
          {s.n}
        </span>
        <span style={{ fontWeight: 700, color: C.ink }}>{s.kind}</span>
        <span>{s.meta}</span>
        <span
          style={{
            marginLeft: "auto",
            color: C.green,
            fontWeight: 600,
            opacity: matched ? 1 : 0,
          }}
        >
          cliente: andino
        </span>
      </div>
      <div style={{ marginTop: 8, fontSize: 17, color: C.ink, lineHeight: 1.4 }}>
        {s.text}
      </div>
    </div>
  );
}

// Frame at which the typed answer reaches the end of a given citation.
function citationFrame(n: number) {
  let count = 0;
  for (const seg of ANSWER) {
    count += seg.text.length;
    if (seg.cite === n) break;
  }
  return interpolate(
    count,
    [0, ANSWER_LEN],
    [T.answerStart, T.answerEnd]
  );
}

function Answer({ frame }: { frame: number }) {
  const shown = Math.floor(
    interpolate(frame, [T.answerStart, T.answerEnd], [0, ANSWER_LEN], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  let remaining = shown;
  const nodes: React.ReactNode[] = [];
  for (const [i, seg] of ANSWER.entries()) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, seg.text.length);
    const done = take === seg.text.length;
    nodes.push(
      <span key={i} style={{ color: seg.cite ? C.ink : C.muted }}>
        {seg.text.slice(0, take)}
        {seg.cite && done ? (
          <Cite
            n={seg.cite}
            active={
              frame >= citationFrame(seg.cite) &&
              frame < citationFrame(seg.cite) + 26
            }
          />
        ) : null}
      </span>
    );
    remaining -= take;
  }
  const cursorOn = frame < T.answerEnd && Math.floor(frame / 8) % 2 === 0;

  return (
    <div
      style={{
        opacity: ease(frame, T.answerStart - 8, T.answerStart, 0, 1),
        background: C.surface,
        border: `2px solid ${C.line}`,
        borderRadius: 10,
        padding: "20px 22px",
        fontFamily: C.sans,
        minHeight: 300,
      }}
    >
      <div
        style={{
          fontSize: 15,
          color: C.muted,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: 700, color: C.ink }}>
          Estado · Grupo Andino
        </span>
        <span>4 fuentes · modelo: local</span>
      </div>
      <p style={{ marginTop: 14, fontSize: 22, lineHeight: 1.5, fontWeight: 500 }}>
        {nodes}
        <span
          style={{
            display: "inline-block",
            width: 3,
            height: 24,
            marginLeft: 2,
            verticalAlign: "-4px",
            background: C.ink,
            opacity: cursorOn ? 1 : 0,
          }}
        />
      </p>
    </div>
  );
}

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();

  const typed = Math.floor(
    interpolate(frame, [T.typeStart, T.typeEnd], [0, QUESTION.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const cursorOn = frame < T.submit && Math.floor(frame / 8) % 2 === 0;
  const pressed = frame >= T.submit && frame < T.submit + 6;
  const fade = interpolate(frame, [T.fadeOut, DEMO_DURATION - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeIn = ease(frame, 0, 10, 0, 1);

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        fontFamily: C.sans,
        color: C.ink,
        opacity: Math.min(fade, fadeIn),
      }}
    >
      <div style={{ position: "absolute", left: 60, right: 60, top: 48 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 68,
            borderRadius: 12,
            border: `2px solid ${frame >= T.typeStart ? C.ink : C.line}`,
            background: C.surface,
            padding: "0 10px 0 22px",
          }}
        >
          <span style={{ flex: 1, fontSize: 24, fontWeight: 500 }}>
            {QUESTION.slice(0, typed)}
            <span
              style={{
                display: "inline-block",
                width: 3,
                height: 26,
                marginLeft: 2,
                verticalAlign: "-5px",
                background: C.ink,
                opacity: cursorOn ? 1 : 0,
              }}
            />
          </span>
          <span
            style={{
              height: 48,
              lineHeight: "48px",
              padding: "0 18px",
              borderRadius: 8,
              background: C.ink,
              color: C.surface,
              fontSize: 17,
              fontWeight: 600,
              transform: pressed ? "scale(0.94)" : "scale(1)",
              opacity: pressed ? 0.8 : 1,
            }}
          >
            Preguntar
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 60,
          top: 150,
          width: 560,
          opacity: ease(frame, T.sourcesStart - 6, T.sourcesStart, 0, 1),
        }}
      >
        <div style={{ fontSize: 15, color: C.muted, marginBottom: 12 }}>
          Fuentes del cliente andino
        </div>
        {SOURCES.map((s) => (
          <SourceCard key={s.n} s={s} frame={frame} />
        ))}
      </div>

      <div style={{ position: "absolute", left: 660, right: 60, top: 150 }}>
        <div
          style={{
            fontSize: 15,
            color: C.muted,
            marginBottom: 12,
            opacity: ease(frame, T.answerStart - 8, T.answerStart, 0, 1),
          }}
        >
          Respuesta con citas
        </div>
        <Answer frame={frame} />
      </div>
    </AbsoluteFill>
  );
};
