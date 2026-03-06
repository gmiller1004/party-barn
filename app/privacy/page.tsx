import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Party Barn",
};

export default function PrivacyPage() {
  return (
    <section className="section-spacing bg-brand-offwhite">
      <div className="container-narrow">
        <h1 className="font-serif text-3xl font-semibold text-brand-ink">
          Privacy Policy
        </h1>
        <p className="mt-6 text-brand-ink/80 leading-relaxed">
          This is a placeholder. Add your privacy policy content here.
        </p>
      </div>
    </section>
  );
}
