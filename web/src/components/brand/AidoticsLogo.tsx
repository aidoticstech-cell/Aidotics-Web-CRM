import Image from "next/image";

/** Current brand lockup (white background, green wordmark). */
const LOGO_WIDTH = 217;
const LOGO_HEIGHT = 102;

type AidoticsLogoProps = {
  className?: string;
  /** Visual height of the lockup (width scales from asset aspect ratio). */
  height?: number;
  priority?: boolean;
  /** Center the image in its container (e.g. login card). */
  centered?: boolean;
  /** White pill behind logo on dark UI (dashboard sidebar). */
  onDarkSurface?: boolean;
};

export function AidoticsLogo({
  className = "",
  height = 44,
  priority = false,
  centered = false,
  onDarkSurface = false,
}: AidoticsLogoProps) {
  const width = Math.round((LOGO_WIDTH / LOGO_HEIGHT) * height);

  const img = (
    <Image
      src="/aidotics-logo.png"
      alt="aidotics"
      width={width}
      height={height}
      priority={priority}
      className={`h-auto max-w-full object-contain ${centered ? "object-center" : "object-left"} ${className}`}
      style={{ height, width }}
    />
  );

  if (onDarkSurface) {
    return (
      <div className="inline-block rounded-lg bg-white px-2.5 py-1.5 shadow-sm">
        {img}
      </div>
    );
  }

  return img;
}
