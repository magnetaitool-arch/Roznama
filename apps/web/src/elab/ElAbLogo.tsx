/** Official الأب logo (tear-off calendar). Served from /public/elab-logo.png. */
export function ElAbLogo({ size = 46 }: { size?: number }) {
  return (
    <img
      src="/elab-logo.png"
      alt="الأب"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", display: "block", flex: "none" }}
    />
  );
}
