import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const alt = "Terminal Blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  let fontData: Buffer;
  try {
    const fontPath = path.join(process.cwd(), "public/fonts/JetBrainsMono-Regular.ttf");
    fontData = fs.readFileSync(fontPath);
  } catch (e) {
    throw new Error(`Failed to load JetBrains Mono font locally: ${(e as Error).message}`);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#1e2127",
          fontFamily: "JetBrains Mono",
          display: "flex",
          flexDirection: "column",
          padding: "50px",
          color: "#d8dee9",
          border: "12px solid #191c22",
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
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            marginBottom: "50px",
          }}
        >
          {/* Dots */}
          <div style={{ display: "flex", gap: "8px", marginRight: "20px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#bf616a" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ebcb8b" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#a3be8c" }} />
          </div>
          {/* Path */}
          <div style={{ fontSize: "16px", color: "#7b88a1" }}>
            guest@terminal-blog:~
          </div>
        </div>

        {/* Command Prompts */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: "28px", color: "#7b88a1", marginBottom: "20px" }}>
            <span style={{ color: "#ff6b00", marginRight: "12px" }}>$</span>
            <span>npm run dev</span>
          </div>

          <div
            style={{
              fontSize: "72px",
              fontWeight: 500,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <span>Terminal</span>
            <span style={{ color: "#ff6b00" }}>.</span>
            <span style={{ color: "#ff6b00" }}>blog</span>
            <div
              style={{
                width: "24px",
                height: "64px",
                backgroundColor: "#ff6b00",
                marginLeft: "16px",
              }}
            />
          </div>

          <div style={{ fontSize: "24px", color: "#7b88a1" }}>
            A minimalist terminal-themed space for code, systems, and design.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            fontSize: "16px",
            color: "#7b88a1",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            paddingTop: "24px",
          }}
        >
          <div>Status: Online</div>
          <div>Version: 1.0.0</div>
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
