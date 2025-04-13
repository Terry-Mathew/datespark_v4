import { useEffect, useRef, useState } from "react";

interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

const LazyLoad = ({ children, className = "", threshold = 0.1 }: LazyLoadProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: "50px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : <div className="h-[200px] bg-muted animate-pulse rounded-lg" />}
    </div>
  );
};

export default LazyLoad; 