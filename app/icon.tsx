import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon: "PB" in serif (header style) on brand copper background. */
export default function Icon() {
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
          borderRadius: 6,
          fontFamily: "Georgia, serif",
          fontSize: 15,
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
