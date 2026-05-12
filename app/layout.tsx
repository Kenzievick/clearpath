import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clearpath — Understand Your Child's Evaluation Report",
  description:
    "Clearpath reads your child's neuropsychological evaluation report and gives you a plain-English brief, the right questions to ask, and the services worth requesting — before you walk into the IEP meeting.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
