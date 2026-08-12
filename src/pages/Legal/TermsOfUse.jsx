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

const TermsOfUse = () => {
  return (
    <LegalPageLayout
      metaTitle="Terms of Use — Royal Rays BV"
      metaDescription="Read the Terms of Use governing access to the Royal Rays BV website, digital content, and online business communications."
      badge="Legal & Compliance"
      title="Terms of Use"
      subtitle="These Terms of Use govern your access to and use of the Royal Rays BV website and related digital services. By using our website, you agree to these terms."
      lastUpdated="March 27, 2026"
    >
      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using the Royal Rays BV website, you agree to be bound
          by these Terms of Use and all applicable laws and regulations. If you do
          not agree, please do not use this website.
        </p>
      </Section>

      <Section title="2. Website Purpose">
        <p>
          This website is provided for general information about Royal Rays BV,
          our diamond manufacturing capabilities, certifications, events, and
          business contact channels. Content is intended for professional and
          informational purposes and does not constitute a binding commercial
          offer unless confirmed in writing by Royal Rays BV.
        </p>
      </Section>

      <Section title="3. Intellectual Property">
        <p>
          All content on this website — including text, images, videos, logos,
          graphics, design elements, and downloadable materials — is owned by or
          licensed to Royal Rays BV and protected by applicable intellectual
          property laws. You may not copy, reproduce, distribute, modify, or
          exploit any content without prior written permission.
        </p>
      </Section>

      <Section title="4. Permitted Use">
        <p>You may use this website only for lawful purposes. You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Attempt unauthorized access to systems, accounts, or data</li>
          <li>Introduce malware, automated scraping, or disruptive activity</li>
          <li>Misrepresent your identity or affiliation with Royal Rays BV</li>
          <li>Use website content for commercial redistribution without consent</li>
        </ul>
      </Section>

      <Section title="5. Product & Business Information">
        <p>
          Diamond specifications, imagery, availability, pricing, and catalogue
          details displayed on this website may change without notice. Any
          business transaction is subject to separate written agreement,
          certification, and verification processes.
        </p>
      </Section>

      <Section title="6. Third-Party Links">
        <p>
          Our website may contain links to third-party websites or services for
          convenience. Royal Rays BV is not responsible for the content,
          policies, or practices of third-party sites and does not endorse them
          unless explicitly stated.
        </p>
      </Section>

      <Section title="7. Disclaimer">
        <p>
          The website and its content are provided on an “as is” and “as
          available” basis. To the fullest extent permitted by law, Royal Rays BV
          disclaims warranties of any kind, whether express or implied, including
          fitness for a particular purpose and non-infringement.
        </p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>
          Royal Rays BV shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages arising from your use of
          this website, except where liability cannot be excluded under
          applicable law.
        </p>
      </Section>

      <Section title="9. Governing Law">
        <p>
          These Terms of Use are governed by the laws of Belgium. Any disputes
          arising in connection with these terms shall be subject to the exclusive
          jurisdiction of the competent courts in Antwerp, Belgium, unless
          mandatory law provides otherwise.
        </p>
      </Section>

      <Section title="10. Changes to These Terms">
        <p>
          We may update these Terms of Use from time to time. Continued use of the
          website after changes are posted constitutes acceptance of the revised
          terms. We encourage you to review this page periodically.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          For questions regarding these Terms of Use, contact{" "}
          <a
            href="mailto:belgium@royalraysbv.com"
            className="text-[#111111] underline underline-offset-4 hover:text-[#4D4D4D]"
          >
            belgium@royalraysbv.com
          </a>
          .
        </p>
      </Section>
    </LegalPageLayout>
  );
};

export default TermsOfUse;
