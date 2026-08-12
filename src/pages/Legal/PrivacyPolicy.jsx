import React from "react";
import LegalPageLayout from "../../components/legal/LegalPageLayout";

const Section = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="font-display text-xl md:text-2xl font-light text-[#111111]">
      {title}
    </h2>
    <div className="space-y-3 text-[15px] leading-relaxed text-[#4D4D4D]">
      {children}
    </div>
  </section>
);

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout
      metaTitle="Privacy Policy — Royal Rays BV"
      metaDescription="Learn how Royal Rays BV collects, uses, and protects your personal information across our website and business communications."
      badge="Legal & Compliance"
      title="Privacy Policy"
      subtitle="Your privacy matters to us. This policy explains how Royal Rays BV collects, uses, stores, and protects personal information when you visit our website, request a catalogue, or communicate with our team."
      lastUpdated="March 27, 2026"
    >
      <Section title="1. Who We Are">
        <p>
          Royal Rays BV (“Royal Rays”, “we”, “us”, or “our”) is a diamond
          manufacturing and export company based in Antwerp, Belgium. We operate
          the website royalraysbv.com and related digital channels used for
          business enquiries, catalogue requests, and client communication.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p>We may collect the following categories of information:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Contact details such as name, email address, phone number, and company name</li>
          <li>Business enquiry information submitted through forms or email</li>
          <li>Technical data including IP address, browser type, device information, and usage analytics</li>
          <li>Cookie and preference data related to site functionality and consent choices</li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <p>We use personal information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Respond to enquiries, catalogue requests, and trade communications</li>
          <li>Provide customer support and maintain business relationships</li>
          <li>Improve website performance, security, and user experience</li>
          <li>Comply with legal, regulatory, and industry obligations</li>
          <li>Send relevant business updates where permitted by law and consent</li>
        </ul>
      </Section>

      <Section title="4. Legal Basis for Processing">
        <p>
          Where applicable under GDPR and Belgian data protection law, we process
          personal data based on legitimate business interests, contractual
          necessity, legal compliance, and consent where required — for example,
          for optional marketing communications or non-essential cookies.
        </p>
      </Section>

      <Section title="5. Data Sharing">
        <p>
          We do not sell personal information. We may share data with trusted
          service providers who support hosting, analytics, email delivery, or
          compliance operations, subject to confidentiality and data protection
          obligations. We may also disclose information where required by law or
          regulatory authority.
        </p>
      </Section>

      <Section title="6. International Transfers">
        <p>
          If personal data is transferred outside the European Economic Area, we
          implement appropriate safeguards such as standard contractual clauses or
          equivalent protections consistent with applicable data protection
          requirements.
        </p>
      </Section>

      <Section title="7. Data Retention">
        <p>
          We retain personal information only for as long as necessary to fulfil
          the purposes described in this policy, including legal, accounting, and
          reporting requirements. Retention periods may vary depending on the
          nature of the data and our relationship with you.
        </p>
      </Section>

      <Section title="8. Your Rights">
        <p>
          Depending on your location, you may have the right to access, correct,
          delete, restrict, or object to certain processing of your personal data,
          as well as the right to data portability and to withdraw consent where
          processing is consent-based. To exercise these rights, contact us using
          the details below.
        </p>
      </Section>

      <Section title="9. Security">
        <p>
          We apply appropriate technical and organizational measures designed to
          protect personal information against unauthorized access, alteration,
          disclosure, or destruction. However, no method of transmission over the
          internet is completely secure.
        </p>
      </Section>

      <Section title="10. Contact Us">
        <p>
          For privacy-related questions or requests, contact Royal Rays BV at{" "}
          <a
            href="mailto:belgium@royalraysbv.com"
            className="text-[#111111] underline underline-offset-4 hover:text-[#4D4D4D]"
          >
            belgium@royalraysbv.com
          </a>{" "}
          or write to us at 341, Hoveniersstraat 2, 2018 Antwerpen, Belgium.
        </p>
      </Section>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
