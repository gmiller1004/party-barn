import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: same "PB" branding at 180x180. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#9d755c",
          borderRadius: 24,
          fontFamily: "Georgia, serif",
          fontSize: 72,
          fontWeight: 600,
          color: "#f7f8f3",
        }}
      >
        PB
      </div>
    ),
    { ...size }
  );
}
