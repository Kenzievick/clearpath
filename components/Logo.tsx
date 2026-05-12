import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  linkTo?: string;
}

export default function Logo({ size = "md", linkTo = "/" }: LogoProps) {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const content = (
    <span className={`font-semibold tracking-tight ${sizes[size]}`}>
      <span className="text-blue-600">Clear</span>
      <span className="text-stone-800">path</span>
    </span>
  );

  if (linkTo) {
    return <Link href={linkTo}>{content}</Link>;
  }

  return content;
}
