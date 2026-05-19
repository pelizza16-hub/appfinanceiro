import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
          borderRadius: 96,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 260,
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
