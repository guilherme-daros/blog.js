"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="reading-progress"
      id="reading-progress"
      style={{ width: `${progress}%` }}
    />
  );
}

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="font-mono text-[11px] text-muted-foreground bg-transparent border border-border rounded-[var(--radius)] px-3 py-1 cursor-pointer no-underline transition-colors duration-200 hover:border-primary hover:text-primary hover:bg-panel" onClick={handleCopy}>
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}

import DOMPurify from "isomorphic-dompurify";

export function ArticleBody({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<{ id: string; text: string; tag: string }[]>([]);

  const sanitizedContent = DOMPurify.sanitize(content);

  useEffect(() => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll("h2, h3");
      const tocItems: { id: string; text: string; tag: string }[] = [];

      headings.forEach((h, i) => {
        const id = h.id || `heading-${i}`;
        h.id = id;
        tocItems.push({ id, text: h.textContent || "", tag: h.tagName });
      });

      setToc(tocItems);
    }
  }, [sanitizedContent]);

  return (
    <>
      {toc.length > 1 && (
        <nav className="hidden border border-border rounded-[var(--radius)] px-6 py-5 mb-8" id="toc" style={{ display: "block" }}>
          <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-muted-foreground mb-3">Table of contents</div>
          <ul>
            {toc.map((item) => (
              <li
                key={item.id}
                className={item.tag === "H3" ? "toc-indent" : ""}
              >
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div
        className="article-body"
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </>
  );
}
