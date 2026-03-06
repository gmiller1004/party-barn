import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Party Barn Mercantile",
};

export default function TermsPage() {
  return (
    <section className="section-spacing bg-brand-offwhite">
      <div className="container-narrow">
        <h1 className="font-serif text-3xl font-semibold text-brand-ink">
          Terms and Conditions
        </h1>
        <p className="mt-6 text-brand-ink/80 leading-relaxed">
          This is a placeholder. Add your terms and conditions content here.
        </p>
      </div>
    </section>
  );
}
