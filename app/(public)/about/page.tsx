import Link from "next/link";
import prisma from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Terminal Blog",
};

export default async function AboutPage() {
  const socialLinks = await prisma.socialLink.findMany({
    orderBy: { sort_order: "asc" },
  });

  return (
    <section className="max-w-[960px] mx-auto px-6 pt-[80px] pb-20 max-[820px]:pt-[120px]">
      <header className="flex flex-col items-start text-left pb-16 border-b border-border grid grid-cols-[1fr_auto] gap-12 max-[640px]:grid-cols-1">
        <div className="max-w-[640px]">
          <div className="inline-block font-mono text-[12px] tracking-[1.92px] uppercase text-primary border border-primary rounded-[var(--radius)] px-4 py-[6px] mb-8">// About</div>
          <h1 className="text-[48px] font-normal leading-[56px] tracking-[-1.5px] text-[var(--heading-color)] mb-6 max-[640px]:text-[28px] max-[640px]:leading-[34px]">Turning noise into signal</h1>
          <p>
            Independent research and analysis for those who prefer code over
            headlines.
          </p>
        </div>
        <div className="">
          <div className="bg-background border border-border rounded-[var(--radius)] px-8 py-6 font-mono text-[13px] leading-[22px] text-left min-w-[320px] min-w-[280px] text-[12px] leading-[20px]">
            <div className="text-muted-foreground">$ whoami</div>
            <div className="text-white">terminal</div>
            <div className="text-muted-foreground">$ cat role.txt</div>
            <div className="text-[var(--chart-green)]">engineer / analyst / builder</div>
            <div className="text-muted-foreground">$ uptime</div>
            <div className="text-primary">writing since 2024</div>
            <div>
              <br />
              <span className="text-muted-foreground">$</span>{" "}
              <span className="cursor-blink"></span>
            </div>
          </div>
        </div>
      </header>

      <div className="py-12 border-b border-border last:border-b-0">
        <h2 className="text-[24px] font-normal text-[var(--heading-color)] mb-6">Who I am</h2>
        <div className="text-foreground text-[16px] leading-[26px] [&>p]:mb-4 [&>p:last-child]:mb-0">
          <p>
            I'm an independent software engineer and technical analyst. I started
            this blog to document what I learn about building robust systems,
            data analysis, and technical architecture — with the rigor I wish I'd
            found when I started my journey.
          </p>
          <p>
            My background spans full-stack development and quantitative analysis.
            I believe the best engineering decisions come from combining
            technical literacy with practical intuition, and that complex problems
            often require simple, well-thought-out solutions.
          </p>
          <p>
            When I'm not optimizing data pipelines, you'll find me writing Python
            scripts, exploring new frameworks, or arguing about system
            architecture on the web.
          </p>
        </div>
      </div>

      <div className="py-12 border-b border-border last:border-b-0">
        <h2 className="text-[24px] font-normal text-[var(--heading-color)] mb-6">What this blog covers</h2>
        <div className="text-foreground text-[16px] leading-[26px] [&>p]:mb-4 [&>p:last-child]:mb-0">
          <div className="grid grid-cols-2 gap-6 max-[640px]:grid-cols-1">
            <div className="flex gap-4 items-start">
              <span className="text-primary text-[10px] mt-[6px] shrink-0">◆</span>
              <div>
                <h3>System Analysis</h3>
                <p>
                  Deep dives into software architecture and technical systems —
                  costs, performance, scalability, and practical trade-offs.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-primary text-[10px] mt-[6px] shrink-0">◆</span>
              <div>
                <h3>Technical Strategy</h3>
                <p>
                  Design patterns, clean code practices, and architectural
                  frameworks tailored to modern development.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-primary text-[10px] mt-[6px] shrink-0">◆</span>
              <div>
                <h3>Data Infrastructure</h3>
                <p>
                  Pipelines, databases, real-time dynamics, and what they mean
                  for your application's performance.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-primary text-[10px] mt-[6px] shrink-0">◆</span>
              <div>
                <h3>Technical Guides</h3>
                <p>
                  Python tools, development workflows, and automation for builders
                  who like to own their infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 border-b border-border last:border-b-0">
        <h2 className="text-[24px] font-normal text-[var(--heading-color)] mb-6">Background</h2>
        <div className="text-foreground text-[16px] leading-[26px] [&>p]:mb-4 [&>p:last-child]:mb-0">
          <div className="flex flex-col gap-6">
            <div className="flex gap-6 items-start max-[640px]:flex-col max-[640px]:gap-1">
              <span className="font-mono text-[12px] text-primary tracking-[0.5px] shrink-0 w-16 pt-[2px] max-[640px]:w-auto">2024 —</span>
              <div>
                <h3>Terminal Blog</h3>
                <p>
                  Launched this blog to share independent research on technical
                  systems and software strategy.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start max-[640px]:flex-col max-[640px]:gap-1">
              <span className="font-mono text-[12px] text-primary tracking-[0.5px] shrink-0 w-16 pt-[2px] max-[640px]:w-auto">2020 —</span>
              <div>
                <h3>Independent Builder</h3>
                <p>
                  Full-time focus on technical architecture and systematic
                  development using modern technology stacks.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start max-[640px]:flex-col max-[640px]:gap-1">
              <span className="font-mono text-[12px] text-primary tracking-[0.5px] shrink-0 w-16 pt-[2px] max-[640px]:w-auto">2016 —</span>
              <div>
                <h3>Software Engineering</h3>
                <p>
                  Built data systems and analytics platforms. Learned to think in
                  pipelines, distributions, and edge cases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 border-b border-border last:border-b-0">
        <h2 className="text-[24px] font-normal text-[var(--heading-color)] mb-6">Philosophy</h2>
        <div className="text-foreground text-[16px] leading-[26px] [&>p]:mb-4 [&>p:last-child]:mb-0">
          <blockquote className="border-l-2 border-primary px-6 py-4 mb-8 italic text-[17px] leading-[28px] text-muted-foreground">
            "The goal is not to predict every requirement. It's to build a
            system that doesn't require you to."
          </blockquote>
          <div className="grid grid-cols-2 gap-6 max-[640px]:grid-cols-1">
            <div className="flex gap-4 items-start [&>p]:text-[14px] [&>p]:leading-[22px] [&>p]:text-muted-foreground [&>p]:mb-0 [&_strong]:text-[var(--heading-color)]">
              <span className="font-mono text-[12px] text-primary shrink-0 pt-[2px]">01</span>
              <p>
                <strong>Data over narrative.</strong> Every claim should be backed
                by benchmarks and evidence. If the data doesn't support the
                thesis, the approach is wrong.
              </p>
            </div>
            <div className="flex gap-4 items-start [&>p]:text-[14px] [&>p]:leading-[22px] [&>p]:text-muted-foreground [&>p]:mb-0 [&_strong]:text-[var(--heading-color)]">
              <span className="font-mono text-[12px] text-primary shrink-0 pt-[2px]">02</span>
              <p>
                <strong>Performance matters.</strong> Latency, overhead, and
                complexity compound just like features — except against you.
                Always account for the true cost of architecture.
              </p>
            </div>
            <div className="flex gap-4 items-start [&>p]:text-[14px] [&>p]:leading-[22px] [&>p]:text-muted-foreground [&>p]:mb-0 [&_strong]:text-[var(--heading-color)]">
              <span className="font-mono text-[12px] text-primary shrink-0 pt-[2px]">03</span>
              <p>
                <strong>Simplicity scales.</strong> A system you understand and
                maintain beats a "sophisticated" one you can't. Complexity is not
                a feature.
              </p>
            </div>
            <div className="flex gap-4 items-start [&>p]:text-[14px] [&>p]:leading-[22px] [&>p]:text-muted-foreground [&>p]:mb-0 [&_strong]:text-[var(--heading-color)]">
              <span className="font-mono text-[12px] text-primary shrink-0 pt-[2px]">04</span>
              <p>
                <strong>Context matters.</strong> Every technical choice has a
                trade-off. Importing solutions without adaptation to your specific
                constraints is a recipe for failure.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 border-b border-border last:border-b-0">
        <h2 className="text-[24px] font-normal text-[var(--heading-color)] mb-6">Tools &amp; stack</h2>
        <div className="text-foreground text-[16px] leading-[26px] [&>p]:mb-4 [&>p:last-child]:mb-0">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-primary w-[72px] shrink-0">analysis</span>
              <div className="flex gap-2 flex-wrap">
                <span className="font-mono text-[12px] text-foreground bg-surface border border-border rounded-[var(--radius)] px-2.5 py-1">Python</span>
                <span className="font-mono text-[12px] text-foreground bg-surface border border-border rounded-[var(--radius)] px-2.5 py-1">pandas</span>
                <span className="font-mono text-[12px] text-foreground bg-surface border border-border rounded-[var(--radius)] px-2.5 py-1">NumPy</span>
                <span className="font-mono text-[12px] text-foreground bg-surface border border-border rounded-[var(--radius)] px-2.5 py-1">SQL</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-primary w-[72px] shrink-0">data</span>
              <div className="flex gap-2 flex-wrap">
                <span className="font-mono text-[12px] text-foreground bg-surface border border-border rounded-[var(--radius)] px-2.5 py-1">REST APIs</span>
                <span className="font-mono text-[12px] text-foreground bg-surface border border-border rounded-[var(--radius)] px-2.5 py-1">JSON/CSV</span>
                <span className="font-mono text-[12px] text-foreground bg-surface border border-border rounded-[var(--radius)] px-2.5 py-1">PostgreSQL</span>
                <span className="font-mono text-[12px] text-foreground bg-surface border border-border rounded-[var(--radius)] px-2.5 py-1">SQLite</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-primary w-[72px] shrink-0">infra</span>
              <div className="flex gap-2 flex-wrap">
                <span className="font-mono text-[12px] text-foreground bg-surface border border-border rounded-[var(--radius)] px-2.5 py-1">Docker</span>
                <span className="font-mono text-[12px] text-foreground bg-surface border border-border rounded-[var(--radius)] px-2.5 py-1">Next.js</span>
                <span className="font-mono text-[12px] text-foreground bg-surface border border-border rounded-[var(--radius)] px-2.5 py-1">React</span>
                <span className="font-mono text-[12px] text-foreground bg-surface border border-border rounded-[var(--radius)] px-2.5 py-1">Linux</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 border-b border-border last:border-b-0">
        <h2 className="text-[24px] font-normal text-[var(--heading-color)] mb-6">Find me elsewhere</h2>
        <div className="text-foreground text-[16px] leading-[26px] [&>p]:mb-4 [&>p:last-child]:mb-0">
          <div className="flex gap-4 max-[640px]:flex-col">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 px-6 py-4 bg-surface border border-border rounded-[var(--radius)] no-underline transition-colors duration-200 flex-1 hover:border-[#444]"
              >
                <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-muted-foreground">{link.platform}</span>
                <span className="font-mono text-[14px] text-primary">{link.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="py-12 border-b border-border last:border-b-0 border-b-0">
        <div className="bg-surface border border-border rounded-[var(--radius)] p-12 text-center">
          <h2 className="text-[24px] font-normal text-[var(--heading-color)] mb-6">Want to get in touch?</h2>
          <p>
            Whether it's a question about a post, a collaboration idea, or just
            to say hello.
          </p>
          <Link href="/contact" className="font-mono text-[12px] font-normal leading-[18px] tracking-[1.92px] uppercase no-underline inline-flex items-center justify-center px-7 py-3 rounded-[var(--radius)] cursor-pointer transition-all duration-200 bg-primary text-white border border-primary hover:bg-[#e05e00] hover:border-[#e05e00]">
            Contact me
          </Link>
        </div>
      </div>
    </section>
  );
}
