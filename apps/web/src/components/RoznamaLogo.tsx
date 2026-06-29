/** Official Roznama logo (tear-off calendar lockup). Served from /public. */
export function RoznamaLogo({ size = 44 }: { size?: number }) {
  return (
    <img
      src="/roznama-logo.png"
      alt="روزنامة"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", display: "inline-block", verticalAlign: "middle", flex: "none" }}
    />
  );
}
