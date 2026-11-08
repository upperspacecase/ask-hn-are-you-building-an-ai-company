import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <main>
      <section className="mx-auto w-full max-w-5xl px-6 pt-20 sm:pt-28">
        <h1 className="display">Privacy</h1>
        <p className="body mt-6 max-w-2xl text-muted">
          The only data this page collects is the email address you type into
          the form. It is used once, to send you the starter repo, and is not
          shared or sold. Write to the contact address below to have it
          removed.
        </p>
      </section>
      <Footer />
    </main>
  );
}
