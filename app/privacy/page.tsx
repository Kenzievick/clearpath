import Link from "next/link";
import Logo from "@/components/Logo";

const INK = "#0B0E0D";
const BODY = "#374151";
const MUTED = "#5C6360";
const NAVY = "#1B3A6B";
const NAVY_SUBTLE = "#EEF2F9";
const BG = "#FAFAF7";

export const metadata = {
  title: "Privacy Policy · Clearpath",
  description:
    "Clearpath is built on a simple principle: your child's information belongs to you.",
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-bold mt-10 mb-4"
      style={{ color: INK, fontSize: "20px", lineHeight: 1.3 }}
    >
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-4"
      style={{ color: BODY, fontSize: "16px", lineHeight: 1.8 }}
    >
      {children}
    </p>
  );
}

export default function PrivacyPage() {
  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 bg-white"
        style={{ borderBottom: "1px solid #E5E7EB" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" variant="light" linkTo="/" />
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium transition-colors"
              style={{ color: MUTED }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="btn-press text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
              style={{ background: NAVY }}
            >
              Translate my report
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="px-4 sm:px-6 py-10 sm:py-16">
        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          <div
            className="bg-white rounded-2xl privacy-card"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            {/* Header */}
            <h1
              className="font-bold"
              style={{
                color: INK,
                fontSize: "clamp(28px, 5vw, 40px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Privacy Policy
            </h1>
            <p
              className="mt-2"
              style={{ color: MUTED, fontSize: "15px" }}
            >
              Last updated: May 2026
            </p>

            {/* Summary box */}
            <div
              className="mt-6 rounded-xl"
              style={{
                background: NAVY_SUBTLE,
                borderLeft: `3px solid ${NAVY}`,
                padding: "16px 20px",
              }}
            >
              <p
                style={{
                  color: INK,
                  fontSize: "15px",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Clearpath is built on a simple principle: your child&apos;s
                information belongs to you. We never sell your data, never share
                it with school districts, and never store the evaluation reports
                you upload.
              </p>
            </div>

            {/* Section 1 */}
            <SectionHeading>What Clearpath Does With Your Data</SectionHeading>
            <Body>
              Clearpath is a tool that helps parents understand their child&apos;s
              educational evaluation reports and IEP documents. When you use
              Clearpath, here is exactly what happens with your information:
            </Body>
            <Body>
              When you upload an evaluation report or IEP document, the file is
              processed entirely in our server&apos;s memory. The text is
              extracted, analyzed by our AI, and the structured output is saved
              to your account. The original document is never written to disk
              and never stored in our database. It is discarded immediately
              after processing.
            </Body>
            <Body>
              When you create a child profile, we store the information you
              provide — your child&apos;s first name, age, grade, state, and any
              disability categories you select. This information is used to
              personalize your brief and is never shared with anyone.
            </Body>
            <Body>
              When Clearpath generates a brief or IEP analysis, the structured
              output is saved to your account so you can access it later. This
              is the plain-English interpretation of your document — not the
              document itself.
            </Body>
            <Body>
              When you use the chat feature, your conversation history is saved
              per brief so you can continue where you left off. Chat messages
              are stored in your account and are never used to train any AI
              model.
            </Body>

            {/* Section 2 */}
            <SectionHeading>What We Never Do</SectionHeading>
            <ul
              className="list-disc pl-6 space-y-3 mb-4"
              style={{ color: BODY, fontSize: "16px", lineHeight: 1.8 }}
            >
              <li>
                We never store the raw PDF of your child&apos;s evaluation
                report or IEP document.
              </li>
              <li>
                We never share your data with school districts, administrators,
                or any educational institution.
              </li>
              <li>
                We never sell your personal information to third parties.
              </li>
              <li>
                We never use your child&apos;s information to train AI models.
                Your data is yours.
              </li>
              <li>
                We never share your information with other Clearpath users.
              </li>
              <li>
                We never send your data to any party except the service
                providers listed below, who are bound by strict data processing
                agreements.
              </li>
            </ul>

            {/* Section 3 */}
            <SectionHeading>Information We Collect</SectionHeading>
            <Body>
              <strong style={{ color: INK }}>Account information:</strong> Your
              email address and encrypted password when you create an account.
            </Body>
            <Body>
              <strong style={{ color: INK }}>Child profile information:</strong>{" "}
              Your child&apos;s first name, age, grade, state, disability
              categories, school name, and district — only what you choose to
              provide.
            </Body>
            <Body>
              <strong style={{ color: INK }}>
                Brief and analysis outputs:
              </strong>{" "}
              The structured plain-English briefs and IEP analyses generated
              from your uploaded documents. These are stored so you can access
              them from any device.
            </Body>
            <Body>
              <strong style={{ color: INK }}>Chat history:</strong> Conversations
              you have with Clearpath about your child&apos;s brief. Stored per
              brief, accessible only to you.
            </Body>
            <Body>
              <strong style={{ color: INK }}>Payment information:</strong>{" "}
              Clearpath uses Stripe to process payments. We never see or store
              your credit card number. Stripe handles all payment processing
              and is PCI-DSS compliant. We store only your Stripe customer ID
              to manage your subscription.
            </Body>
            <Body>
              <strong style={{ color: INK }}>Usage data:</strong> Basic
              analytics about how you use the product (which pages you visit,
              when you generate a brief) to help us improve Clearpath. This
              data is anonymized and never tied to your child&apos;s
              information.
            </Body>

            {/* Section 4 */}
            <SectionHeading>How Long We Keep Your Data</SectionHeading>
            <Body>
              Your account data (email, child profiles, briefs, chat history)
              is kept as long as your account is active.
            </Body>
            <Body>
              If you delete your account, all of your data is permanently
              deleted within 30 days, including all child profiles, briefs, IEP
              analyses, and chat history. This deletion is irreversible.
            </Body>
            <Body>
              You can request deletion of specific briefs or child profiles at
              any time from your account settings without deleting your entire
              account.
            </Body>
            <Body>
              We do not keep backups of deleted user data beyond 30 days.
            </Body>

            {/* Section 5 */}
            <SectionHeading>Service Providers We Use</SectionHeading>
            <Body>
              Clearpath works with a small number of trusted service providers
              to deliver the product. Each provider is bound by a data
              processing agreement and may only use your data to provide
              services to Clearpath — never for their own purposes.
            </Body>
            <Body>
              <strong style={{ color: INK }}>Supabase</strong> — database and
              authentication. Your account data and brief outputs are stored
              in Supabase&apos;s encrypted database infrastructure.{" "}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: NAVY, textDecoration: "underline" }}
              >
                supabase.com/privacy
              </a>
            </Body>
            <Body>
              <strong style={{ color: INK }}>Anthropic</strong> — AI processing.
              When you upload a document, the extracted text is sent to
              Anthropic&apos;s Claude API for analysis. Anthropic does not
              train its models on API data.{" "}
              <a
                href="https://www.anthropic.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: NAVY, textDecoration: "underline" }}
              >
                anthropic.com/privacy
              </a>
            </Body>
            <Body>
              <strong style={{ color: INK }}>Stripe</strong> — payment
              processing. Stripe handles all subscription billing. We share
              your email address with Stripe to create your billing account.{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: NAVY, textDecoration: "underline" }}
              >
                stripe.com/privacy
              </a>
            </Body>
            <Body>
              <strong style={{ color: INK }}>Vercel</strong> — hosting.
              Clearpath runs on Vercel&apos;s infrastructure.{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: NAVY, textDecoration: "underline" }}
              >
                vercel.com/legal/privacy-policy
              </a>
            </Body>
            <Body>
              <strong style={{ color: INK }}>PostHog</strong> — product
              analytics. We use PostHog to understand how parents use Clearpath
              so we can improve it. Analytics data is anonymized.{" "}
              <a
                href="https://posthog.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: NAVY, textDecoration: "underline" }}
              >
                posthog.com/privacy
              </a>
            </Body>

            {/* Section 6 */}
            <SectionHeading>Your Rights</SectionHeading>
            <Body>
              You have the right to access all data Clearpath holds about you
              and your child. Email us at{" "}
              <a
                href="mailto:privacy@getclearpath.com"
                style={{ color: NAVY, textDecoration: "underline" }}
              >
                privacy@getclearpath.com
              </a>{" "}
              and we will send you a complete export within 5 business days.
            </Body>
            <Body>
              You have the right to correct any inaccurate information in your
              account. You can update your child&apos;s profile information at
              any time from your dashboard.
            </Body>
            <Body>
              You have the right to delete your account and all associated
              data. Go to Settings → Delete Account. All data is permanently
              deleted within 30 days.
            </Body>
            <Body>
              You have the right to export your data. Go to Settings to
              download a copy of your briefs and child profiles at any time.
            </Body>
            <Body>
              If you are in the European Economic Area or United Kingdom, you
              have additional rights under GDPR including the right to data
              portability and the right to object to processing. Contact us at{" "}
              <a
                href="mailto:privacy@getclearpath.com"
                style={{ color: NAVY, textDecoration: "underline" }}
              >
                privacy@getclearpath.com
              </a>{" "}
              with any requests.
            </Body>

            {/* Section 7 */}
            <SectionHeading>Children&apos;s Privacy</SectionHeading>
            <Body>
              Clearpath is designed for use by parents and caregivers — not by
              children directly. Our users are adults acting on behalf of their
              children. We do not knowingly collect personal information
              directly from children under 13.
            </Body>
            <Body>
              The child information stored in Clearpath (first name, age,
              grade, disability categories) is provided by the parent or
              caregiver and is used solely to personalize the parent&apos;s
              advocacy tools. This information is never shared, sold, or used
              for any purpose other than delivering Clearpath&apos;s services to
              the parent.
            </Body>
            <Body>
              If you believe we have inadvertently collected information from a
              child, please contact us at{" "}
              <a
                href="mailto:privacy@getclearpath.com"
                style={{ color: NAVY, textDecoration: "underline" }}
              >
                privacy@getclearpath.com
              </a>{" "}
              and we will delete it immediately.
            </Body>

            {/* Section 8 */}
            <SectionHeading>Security</SectionHeading>
            <Body>
              All data transmitted between your browser and Clearpath is
              encrypted using HTTPS. All data stored in our database is
              encrypted at rest. We use row-level security to ensure that your
              data is only accessible to your account — no other user can
              access your briefs, child profiles, or chat history, even in the
              event of a database breach.
            </Body>
            <Body>
              We never log the contents of evaluation reports or IEP documents.
              The raw text extracted from your documents exists only in server
              memory during processing and is discarded immediately after.
            </Body>
            <Body>
              Despite our best efforts, no system is perfectly secure. If we
              become aware of a security breach that affects your data, we will
              notify you by email within 72 hours.
            </Body>

            {/* Section 9 */}
            <SectionHeading>Contact Us</SectionHeading>
            <Body>
              If you have questions about this privacy policy or how Clearpath
              handles your data, contact us at:
            </Body>
            <Body>
              Email:{" "}
              <a
                href="mailto:privacy@getclearpath.com"
                style={{ color: NAVY, textDecoration: "underline" }}
              >
                privacy@getclearpath.com
              </a>
            </Body>
          </div>

          {/* Page footer note */}
          <p
            className="text-center mt-8"
            style={{ color: MUTED, fontSize: "13px", lineHeight: 1.7 }}
          >
            This privacy policy was last reviewed in May 2026. We will notify
            you by email if we make material changes to how we handle your
            data.
          </p>
        </div>
      </main>

      <style>{`
        .privacy-card { padding: 24px; }
        @media (min-width: 768px) {
          .privacy-card { padding: 48px; }
        }
      `}</style>
    </div>
  );
}
