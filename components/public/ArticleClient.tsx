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
    <button className="share-btn" onClick={handleCopy}>
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}

export function ArticleBody({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<{ id: string; text: string; tag: string }[]>([]);

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
  }, [content]);

  return (
    <>
      {toc.length > 1 && (
        <nav className="toc" id="toc" style={{ display: "block" }}>
          <div className="toc-title">Table of contents</div>
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
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}
