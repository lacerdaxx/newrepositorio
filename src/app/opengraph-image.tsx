import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const pngPath = path.join(process.cwd(), "public", siteConfig.logo.replace(/^\//, ""));
  const logo = fs.existsSync(pngPath) ? `data:image/png;base64,${fs.readFileSync(pngPath).toString("base64")}` : null;
  const bars = [120, 170, 220, 270, 320];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(circle at 30% 20%, rgba(247,181,44,0.25), #0A0A0A 60%)",
          color: "#FAFAFA",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: 80, bottom: 0, display: "flex", alignItems: "flex-end", gap: 14, opacity: 0.5 }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                width: 48,
                height: h,
                borderRadius: 6,
                background: i >= 3 ? "linear-gradient(#F7B52C, #F29A1E)" : "linear-gradient(#E5E5E5, #8A8A8A)",
              }}
            />
          ))}
        </div>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" style={{ height: 90, objectFit: "contain", alignSelf: "flex-start" }} />
        ) : (
          <div style={{ display: "flex", fontSize: 64, fontWeight: 900, letterSpacing: -2 }}>
            <span style={{ color: "#D4D4D4" }}>BUILD</span>
            <span style={{ color: "#F7B52C" }}>SCALE</span>
          </div>
        )}
        <div style={{ marginTop: 36, fontSize: 54, fontWeight: 800, lineHeight: 1.1, maxWidth: 820, letterSpacing: -1.5 }}>
          Agenda cheia de orçamentos direto com o dono da casa.
        </div>
        <div style={{ marginTop: 28, fontSize: 22, letterSpacing: 6, color: "#F7B52C", textTransform: "uppercase" }}>{siteConfig.slogan}</div>
      </div>
    ),
    size,
  );
}
