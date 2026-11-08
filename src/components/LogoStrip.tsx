const SOURCES = [
  "Fireflies",
  "Jira",
  "GitHub Actions",
  "Slack",
  "Helm",
  "Ollama",
  "Claude Code",
];

export default function LogoStrip() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
      <p className="body text-muted">
        The starter repo ships with read-only connectors for:
      </p>
      <ul className="mt-7 flex flex-wrap items-center gap-x-9 gap-y-4">
        {SOURCES.map((name) => (
          <li
            key={name}
            className="body font-bold tracking-tight text-ink opacity-70"
          >
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}
