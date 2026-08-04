import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import pg from "pg";

export const alt = "Terminal Blog Post";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type Post = {
  title: string;
  slug: string;
  excerpt: string | null;
  read_time: number | null;
  reads: number | null;
  tag: string | null;
};

async function getPost(slug: string): Promise<Post | null> {
  const connectionString = process.env.DATABASE_URL?.replace(
    "sslmode=require",
    "sslmode=require&uselibpqcompat=true"
  );
  const pool = new pg.Pool({ connectionString });
  try {
    const result = await pool.query<Post>(
      `SELECT title, slug, excerpt, read_time, reads, tag
       FROM posts WHERE slug = $1 LIMIT 1`,
      [slug]
    );
    return result.rows[0] ?? null;
  } finally {
    await pool.end();
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return new Response("Not Found", { status: 404 });
  }

  const fontData = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/JetBrainsMono-Regular.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#050505",
          fontFamily: "JetBrains Mono",
          display: "flex",
          flexDirection: "column",
          padding: "50px",
          color: "#c2c2c2",
          border: "12px solid #1f1f1f",
          position: "relative",
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "40px",
            borderBottom: "1px solid #1f1f1f",
            marginBottom: "40px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", marginRight: "20px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#eab308" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
          </div>
          <div style={{ fontSize: "16px", color: "#666666" }}>
            guest@terminal-blog:~/posts
          </div>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: "24px", color: "#666666", marginBottom: "20px" }}>
            <span style={{ color: "#ff6b00", marginRight: "12px" }}>$</span>
            <span>cat {post.tag || "tech"}/{post.slug}.md</span>
          </div>

          <div
            style={{
              fontSize: "60px",
              fontWeight: 500,
              color: "#ffffff",
              display: "flex",
              flexWrap: "wrap",
              lineHeight: "1.2",
              marginBottom: "24px",
            }}
          >
            {post.title}
          </div>

          <div style={{ display: "flex", alignItems: "center", fontSize: "20px" }}>
            <span style={{ color: "#ff6b00", marginRight: "10px" }}>▶</span>
            <span
              style={{
                color: "#c2c2c2",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "1000px",
              }}
            >
              {post.excerpt || "Reading now..."}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            fontSize: "16px",
            color: "#666666",
            borderTop: "1px solid #1f1f1f",
            paddingTop: "24px",
          }}
        >
          <div>Read Time: {post.read_time ?? "?"} min</div>
          <div>Views: {post.reads ?? 0}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "JetBrains Mono",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
