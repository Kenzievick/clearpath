import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  linkTo?: string;
  variant?: "light" | "dark";
}

export default function Logo({
  size = "md",
  linkTo = "/",
  variant = "light",
}: LogoProps) {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const pathColor = variant === "dark" ? "text-white" : "text-[#0F1117]";

  const content = (
    <span className={`font-semibold tracking-tight ${sizes[size]}`}>
      <span className="text-[#2D9B83]">Clear</span>
      <span className={pathColor}>path</span>
    </span>
  );

  if (linkTo) {
    return <Link href={linkTo}>{content}</Link>;
  }

  return content;
}
