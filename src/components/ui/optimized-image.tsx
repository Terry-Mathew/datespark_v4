import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
}

const OptimizedImage = ({
  src,
  alt,
  className,
  placeholderColor = "#F3F4F6",
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState("");

  useEffect(() => {
    // Create new image object to preload
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: placeholderColor }}
    >
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage; 