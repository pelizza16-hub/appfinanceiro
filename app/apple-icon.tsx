import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
          borderRadius: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 100,
          fontWeight: "bold",
          fontFamily: "sans-serif",
        }}
      >
        F
      </div>
    ),
    { ...size }
  );
}
