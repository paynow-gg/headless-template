"use client";

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export default function HoverAnimateImage({
  src,
  alt,
  width,
  height,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [firstFrameUrl, setFirstFrameUrl] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      setFirstFrameUrl(canvas.toDataURL());
    };

    img.src = src;
  }, [src]);

  return (
    <div className={twMerge("relative", className)}>
      <canvas ref={canvasRef} className="hidden" />

      {firstFrameUrl && (
        <img
          src={firstFrameUrl}
          alt={alt}
          width={width}
          height={height}
          className="hover:opacity-0 group-hover:opacity-0"
        />
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="absolute inset-0 opacity-0 hover:opacity-100 group-hover:opacity-100"
      />
    </div>
  );
}
