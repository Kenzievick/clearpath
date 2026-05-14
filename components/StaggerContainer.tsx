"use client";

import { Children } from "react";
import { FadeIn } from "./FadeIn";

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  baseDelay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 80,
  baseDelay = 0,
  direction = "up",
  duration,
  className = "",
}: StaggerContainerProps) {
  // Handle non-array children (single child, null, undefined) gracefully.
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, index) => (
        <FadeIn
          key={index}
          delay={baseDelay + index * staggerDelay}
          direction={direction}
          duration={duration}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  );
}
