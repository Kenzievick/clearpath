import { useEffect, useRef, useState } from "react";

interface UseFadeInOptions {
  threshold?: number;
  delay?: number;
  once?: boolean;
}

export function useFadeIn<T extends HTMLElement = HTMLDivElement>(
  options: UseFadeInOptions = {}
) {
  const { threshold = 0.1, delay = 0, once = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setIsVisible(true), delay);
          if (once) observer.unobserve(element);
          return () => clearTimeout(t);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, delay, once]);

  return { ref, isVisible };
}
