const LINKS = [
  { label: "Contact", href: "mailto:hello@clientbrain.dev" },
  {
    label: "The HN thread that started this",
    href: "https://news.ycombinator.com/item?id=50379710",
  },
  { label: "Privacy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-6 pb-14 pt-6">
      <nav className="flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-line pt-8">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="body cursor-pointer font-medium text-muted transition-colors duration-200 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
