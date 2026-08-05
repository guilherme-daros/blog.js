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
    <section className="max-w-[960px] mx-auto px-6 pt-[80px] pb-20 max-[820px]:pt-[120px]">
      <header className="flex flex-col items-start text-left pb-16 border-b border-border max-w-[640px]">
        <div className="inline-block font-mono text-[12px] tracking-[1.92px] uppercase text-primary border border-primary rounded-[var(--radius)] px-4 py-[6px] mb-8">// Contact</div>
        <h1 className="text-[48px] font-normal leading-[56px] tracking-[-1.5px] text-[var(--heading-color)] mb-6 max-[640px]:text-[28px] max-[640px]:leading-[34px]">Let's talk</h1>
        <p className="text-[20px] leading-[32px] text-muted-foreground max-w-[640px]">
          Have a question about a post, want to collaborate, or just want to say
          hello? Drop me a message below or reach out directly.
        </p>
      </header>

      <div className="grid grid-cols-[1fr_320px] gap-12 pt-10 max-[768px]:grid-cols-1">
        <div className="">
          <h2 className="text-[24px] font-normal text-[var(--heading-color)] mb-6">Send a message</h2>
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-[var(--radius)] p-6">
            <h3>Direct email</h3>
            <p className="text-[20px] leading-[32px] text-muted-foreground max-w-[640px]">Prefer email? Write to me directly at:</p>
            <a href="mailto:hello@terminal.blog" className="font-mono text-[14px] text-primary no-underline border-b border-primary/30 transition-colors duration-200 hover:border-primary">
              hello@terminal.blog
            </a>
          </div>

          <div className="bg-surface border border-border rounded-[var(--radius)] p-6">
            <h3>Response time</h3>
            <p className="text-[20px] leading-[32px] text-muted-foreground max-w-[640px]">
              I typically respond within <strong>48 hours</strong>. For urgent
              matters, DM me on Twitter.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-[var(--radius)] p-6">
            <h3>What I can help with</h3>
            <ul className="list-none flex flex-col gap-2 p-0">
              <li>Questions about posts or analysis</li>
              <li>Collaboration or guest posts</li>
              <li>Data sources and methodology</li>
              <li>Speaking or consulting inquiries</li>
            </ul>
          </div>

          <div className="bg-surface border border-border rounded-[var(--radius)] p-6">
            <h3>Find me elsewhere</h3>
            <div className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[12px] text-foreground no-underline flex justify-between items-center px-3 py-2 border border-border rounded-[var(--radius)] transition-colors duration-200 hover:border-[#444] hover:text-[var(--heading-color)] [&>span]:text-muted-foreground [&>span]:transition-all [&>span]:duration-200 hover:[&>span]:text-primary hover:[&>span]:translate-x-[2px]"
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
