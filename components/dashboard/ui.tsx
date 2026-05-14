import Link from "next/link";

export const NAVY = "#1B3A6B";
export const NAVY_HOVER = "#152D54";
export const NAVY_SUBTLE = "#EEF2F9";
export const INK = "#0B0E0D";
export const MUTED = "#5C6360";
export const RULE = "#E5E7EB";
export const BG = "#FAFAF7";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
      <div>
        <h1
          className="font-bold"
          style={{ color: INK, fontSize: "clamp(24px, 3vw, 32px)", letterSpacing: "-0.02em" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5" style={{ color: MUTED, fontSize: "16px" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl ${className}`}
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)", padding: "24px" }}
    >
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonProps = {
  variant?: ButtonVariant;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: NAVY, color: "#fff" },
  outline: {
    background: "transparent",
    color: NAVY,
    border: `1px solid ${NAVY}`,
  },
  ghost: { background: "transparent", color: MUTED },
};

export function Button({
  variant = "primary",
  type = "button",
  disabled,
  onClick,
  children,
  className = "",
  title,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        padding: "12px 24px",
        fontSize: "14px",
        ...variantStyles[variant],
      }}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  children,
  className = "",
}: {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors ${className}`}
      style={{
        padding: "12px 24px",
        fontSize: "14px",
        ...variantStyles[variant],
      }}
    >
      {children}
    </Link>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    completed: { bg: "#DCFCE7", fg: "#166534", label: "Completed" },
    processing: { bg: "#FEF3C7", fg: "#92400E", label: "Processing" },
    failed: { bg: "#FEE2E2", fg: "#991B1B", label: "Failed" },
  };
  const s = map[status?.toLowerCase()] ?? { bg: "#F3F4F6", fg: "#374151", label: status };
  return (
    <span
      className="inline-flex items-center rounded-full font-semibold"
      style={{
        background: s.bg,
        color: s.fg,
        padding: "3px 10px",
        fontSize: "11px",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {s.label}
    </span>
  );
}

export const inputClass =
  "w-full rounded-lg border bg-white transition-colors focus:outline-none";
export const inputStyle: React.CSSProperties = {
  borderColor: "#D1D5DB",
  padding: "12px",
  fontSize: "15px",
  color: INK,
};

export function Field({
  label,
  required,
  children,
  error,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span
        className="block mb-2 font-medium"
        style={{ color: INK, fontSize: "14px" }}
      >
        {label}
        {required && <span style={{ color: "#C04A3A" }}> *</span>}
      </span>
      {children}
      {hint && !error && (
        <span className="block mt-1.5" style={{ color: MUTED, fontSize: "12px" }}>
          {hint}
        </span>
      )}
      {error && (
        <span
          className="block mt-1.5 font-medium"
          style={{ color: "#C04A3A", fontSize: "12px" }}
        >
          {error}
        </span>
      )}
    </label>
  );
}
