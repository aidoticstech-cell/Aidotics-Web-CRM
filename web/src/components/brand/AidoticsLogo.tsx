import Image from "next/image";

const LOGO_WIDTH = 893;
const LOGO_HEIGHT = 488;

type AidoticsLogoProps = {
  className?: string;
  /** Visual height of the lockup (width scales from asset aspect ratio). */
  height?: number;
  priority?: boolean;
};

export function AidoticsLogo({ className = "", height = 44, priority = false }: AidoticsLogoProps) {
  const width = Math.round((LOGO_WIDTH / LOGO_HEIGHT) * height);

  return (
    <Image
      src="/aidotics-logo.png"
      alt="aidotics"
      width={width}
      height={height}
      priority={priority}
      className={`h-auto max-w-full object-contain object-left ${className}`}
      style={{ height, width }}
    />
  );
}
