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

  const isDark = variant === "dark";
  const clearColor = isDark ? "text-white" : "text-[#1B3A6B]";
  const pathColor = isDark ? "text-white" : "text-[#0B0E0D]";

  const content = (
    <span className={`font-bold tracking-tight ${sizes[size]}`}>
      <span className={`${clearColor} font-bold`}>Clear</span>
      <span className={`${pathColor} font-bold`}>path</span>
    </span>
  );

  if (linkTo) {
    return <Link href={linkTo}>{content}</Link>;
  }

  return content;
}
