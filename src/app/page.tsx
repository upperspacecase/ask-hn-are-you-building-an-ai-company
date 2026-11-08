import DemoPlayer from "@/components/DemoPlayer";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LogoStrip from "@/components/LogoStrip";

const OBJECTIONS = [
  {
    q: "Onyx is free and Hyper already exists. Why this?",
    a: "Both index Slack and docs and answer \u201cfind me the document\u201d; neither keys every source to a specific client and its deployment, which is the question your CTO actually asks on Monday.",
  },
  {
    q: "I can build this myself with Claude Code in a weekend.",
    a: "The chat box is the weekend; keeping transcripts, tickets and logs current, deduplicated and permissioned per client is the quarter, and that is the part shipped here.",
  },
  {
    q: "Our enterprise clients will not let their data touch a US SaaS.",
    a: "Nothing leaves your VPC except calls to the model endpoint you configure, and you can point that at a local model if the contract requires it.",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Hero />

      <section className="mx-auto mt-12 w-full max-w-5xl px-6 sm:mt-16">
        <DemoPlayer />
      </section>

      <LogoStrip />

      <dl className="mx-auto w-full max-w-5xl space-y-8 px-6 pb-20 sm:pb-24">
        {OBJECTIONS.map(({ q, a }) => (
          <div key={q} className="max-w-2xl">
            <dt className="body font-semibold text-ink">{q}</dt>
            <dd className="body mt-2 text-muted">{a}</dd>
          </div>
        ))}
      </dl>

      <Footer />
    </main>
  );
}
