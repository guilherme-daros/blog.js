import prisma from "@/lib/prisma";
import ContactForm from "@/components/public/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Terminal Blog",
};

export default async function ContactPage() {
  const socialLinks = await prisma.socialLink.findMany({
    orderBy: { sort_order: "asc" },
  });

  return (
    <section className="contact">
      <header className="contact-header">
        <div className="hero-tag">// Contact</div>
        <h1>Let's talk</h1>
        <p>
          Have a question about a post, want to collaborate, or just want to say
          hello? Drop me a message below or reach out directly.
        </p>
      </header>

      <div className="contact-grid">
        <div className="contact-form-wrapper">
          <h2>Send a message</h2>
          <ContactForm />
        </div>

        <aside className="contact-sidebar">
          <div className="contact-info-card">
            <h3>Direct email</h3>
            <p>Prefer email? Write to me directly at:</p>
            <a href="mailto:hello@terminal.blog" className="contact-email">
              hello@terminal.blog
            </a>
          </div>

          <div className="contact-info-card">
            <h3>Response time</h3>
            <p>
              I typically respond within <strong>48 hours</strong>. For urgent
              matters, DM me on Twitter.
            </p>
          </div>

          <div className="contact-info-card">
            <h3>What I can help with</h3>
            <ul className="contact-list">
              <li>Questions about posts or analysis</li>
              <li>Collaboration or guest posts</li>
              <li>Data sources and methodology</li>
              <li>Speaking or consulting inquiries</li>
            </ul>
          </div>

          <div className="contact-info-card">
            <h3>Find me elsewhere</h3>
            <div className="contact-social">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-link"
                >
                  {link.platform} <span>→</span>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
