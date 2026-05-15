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
    <section className="about">
      <header className="about-hero">
        <div className="about-hero-text">
          <div className="hero-tag">// About</div>
          <h1>Turning noise into signal</h1>
          <p>
            Independent research and analysis for those who prefer code over
            headlines.
          </p>
        </div>
        <div className="about-avatar">
          <div className="terminal-box about-terminal">
            <div className="line-dim">$ whoami</div>
            <div className="line-white">terminal</div>
            <div className="line-dim">$ cat role.txt</div>
            <div className="line-green">engineer / analyst / builder</div>
            <div className="line-dim">$ uptime</div>
            <div className="line-orange">writing since 2024</div>
            <div>
              <br />
              <span className="line-dim">$</span>{" "}
              <span className="cursor-blink"></span>
            </div>
          </div>
        </div>
      </header>

      <div className="about-section">
        <h2>Who I am</h2>
        <div className="about-content">
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

      <div className="about-section">
        <h2>What this blog covers</h2>
        <div className="about-content">
          <div className="about-topics">
            <div className="about-topic">
              <span className="about-topic-icon">◆</span>
              <div>
                <h3>System Analysis</h3>
                <p>
                  Deep dives into software architecture and technical systems —
                  costs, performance, scalability, and practical trade-offs.
                </p>
              </div>
            </div>
            <div className="about-topic">
              <span className="about-topic-icon">◆</span>
              <div>
                <h3>Technical Strategy</h3>
                <p>
                  Design patterns, clean code practices, and architectural
                  frameworks tailored to modern development.
                </p>
              </div>
            </div>
            <div className="about-topic">
              <span className="about-topic-icon">◆</span>
              <div>
                <h3>Data Infrastructure</h3>
                <p>
                  Pipelines, databases, real-time dynamics, and what they mean
                  for your application's performance.
                </p>
              </div>
            </div>
            <div className="about-topic">
              <span className="about-topic-icon">◆</span>
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

      <div className="about-section">
        <h2>Background</h2>
        <div className="about-content">
          <div className="about-timeline">
            <div className="timeline-item">
              <span className="timeline-year">2024 —</span>
              <div>
                <h3>Terminal Blog</h3>
                <p>
                  Launched this blog to share independent research on technical
                  systems and software strategy.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <span className="timeline-year">2020 —</span>
              <div>
                <h3>Independent Builder</h3>
                <p>
                  Full-time focus on technical architecture and systematic
                  development using modern technology stacks.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <span className="timeline-year">2016 —</span>
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

      <div className="about-section">
        <h2>Philosophy</h2>
        <div className="about-content">
          <blockquote className="about-quote">
            "The goal is not to predict every requirement. It's to build a
            system that doesn't require you to."
          </blockquote>
          <div className="about-values">
            <div className="about-value">
              <span className="about-value-label">01</span>
              <p>
                <strong>Data over narrative.</strong> Every claim should be backed
                by benchmarks and evidence. If the data doesn't support the
                thesis, the approach is wrong.
              </p>
            </div>
            <div className="about-value">
              <span className="about-value-label">02</span>
              <p>
                <strong>Performance matters.</strong> Latency, overhead, and
                complexity compound just like features — except against you.
                Always account for the true cost of architecture.
              </p>
            </div>
            <div className="about-value">
              <span className="about-value-label">03</span>
              <p>
                <strong>Simplicity scales.</strong> A system you understand and
                maintain beats a "sophisticated" one you can't. Complexity is not
                a feature.
              </p>
            </div>
            <div className="about-value">
              <span className="about-value-label">04</span>
              <p>
                <strong>Context matters.</strong> Every technical choice has a
                trade-off. Importing solutions without adaptation to your specific
                constraints is a recipe for failure.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Tools &amp; stack</h2>
        <div className="about-content">
          <div className="about-stack">
            <div className="stack-group">
              <span className="stack-label">analysis</span>
              <div className="stack-items">
                <span className="stack-item">Python</span>
                <span className="stack-item">pandas</span>
                <span className="stack-item">NumPy</span>
                <span className="stack-item">SQL</span>
              </div>
            </div>
            <div className="stack-group">
              <span className="stack-label">data</span>
              <div className="stack-items">
                <span className="stack-item">REST APIs</span>
                <span className="stack-item">JSON/CSV</span>
                <span className="stack-item">PostgreSQL</span>
                <span className="stack-item">SQLite</span>
              </div>
            </div>
            <div className="stack-group">
              <span className="stack-label">infra</span>
              <div className="stack-items">
                <span className="stack-item">Docker</span>
                <span className="stack-item">Next.js</span>
                <span className="stack-item">React</span>
                <span className="stack-item">Linux</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Find me elsewhere</h2>
        <div className="about-content">
          <div className="about-social">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <span className="social-platform">{link.platform}</span>
                <span className="social-handle">{link.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="about-section about-cta">
        <div className="about-cta-inner">
          <h2>Want to get in touch?</h2>
          <p>
            Whether it's a question about a post, a collaboration idea, or just
            to say hello.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Contact me
          </Link>
        </div>
      </div>
    </section>
  );
}
