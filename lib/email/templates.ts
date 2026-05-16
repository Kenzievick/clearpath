export function welcomeEmail(params: { firstName?: string }) {
  const name = params.firstName || "there";
  return {
    subject: "Welcome to Clearpath",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Clearpath</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAF7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="padding: 0 0 32px 0;">
              <span style="font-size: 24px; font-weight: 700; color: #1B3A6B;">Clear</span><span style="font-size: 24px; font-weight: 700; color: #0B0E0D;">path</span>
            </td>
          </tr>
          <tr>
            <td style="background-color: #FFFFFF; border-radius: 16px; padding: 48px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
              <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700; color: #0B0E0D; line-height: 1.2;">
                You are in the right place, ${name}.
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #5C6360; line-height: 1.7;">
                Clearpath is ready to help you understand your child's evaluation report and walk into your IEP meeting prepared.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #5C6360; line-height: 1.7;">
                Here is how to get started:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F3F4F6;">
                    <span style="font-size: 14px; font-weight: 700; color: #1B3A6B;">1.</span>
                    <span style="font-size: 14px; color: #0B0E0D; margin-left: 8px;">Add your child's profile in the dashboard</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F3F4F6;">
                    <span style="font-size: 14px; font-weight: 700; color: #1B3A6B;">2.</span>
                    <span style="font-size: 14px; color: #0B0E0D; margin-left: 8px;">Upload your child's evaluation report as a PDF</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="font-size: 14px; font-weight: 700; color: #1B3A6B;">3.</span>
                    <span style="font-size: 14px; color: #0B0E0D; margin-left: 8px;">Get your plain-English brief in about 5 minutes</span>
                  </td>
                </tr>
              </table>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #1B3A6B; border-radius: 8px;">
                    <a href="https://itsclearpath.com/dashboard" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none;">
                      Go to your dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 0 0 0; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #9CA3AF;">
                Clearpath · itsclearpath.com
              </p>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #9CA3AF;">
                Your child's report is never stored on our servers.
              </p>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #9CA3AF;">
                <a href="https://itsclearpath.com/privacy" style="color: #9CA3AF;">Privacy Policy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };
}

export function briefReadyEmail(params: {
  firstName?: string;
  childName: string;
  briefId: string;
  isSubscribed: boolean;
}) {
  const name = params.firstName || "there";
  const briefUrl = `https://itsclearpath.com/dashboard/briefs/${params.briefId}`;

  return {
    subject: `${params.childName}'s IEP brief is ready`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAF7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="padding: 0 0 32px 0;">
              <span style="font-size: 24px; font-weight: 700; color: #1B3A6B;">Clear</span><span style="font-size: 24px; font-weight: 700; color: #0B0E0D;">path</span>
            </td>
          </tr>
          <tr>
            <td style="background-color: #FFFFFF; border-radius: 16px; padding: 48px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
              <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700; color: #0B0E0D; line-height: 1.2;">
                ${params.childName}'s brief is ready.
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #5C6360; line-height: 1.7;">
                Hi ${name}, Clearpath has finished reading ${params.childName}'s evaluation report. Your personalized meeting brief is ready to read.
              </p>
              ${
                params.isSubscribed
                  ? `
              <p style="margin: 0 0 32px 0; font-size: 16px; color: #5C6360; line-height: 1.7;">
                Your brief includes all seven sections — scores explained, services to request, accommodations, 10 meeting questions, what to watch for, and your state-specific rights. You can also download it as a PDF to bring to the meeting.
              </p>
              `
                  : `
              <p style="margin: 0 0 32px 0; font-size: 16px; color: #5C6360; line-height: 1.7;">
                Your free brief includes Section 1 — a plain-English summary of what the evaluators found. Upgrade to unlock all seven sections including scores explained, services to request, 10 meeting questions, and your state-specific rights.
              </p>
              `
              }
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #1B3A6B; border-radius: 8px;">
                    <a href="${briefUrl}" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none;">
                      Read ${params.childName}'s brief →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 0 0 0; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #9CA3AF;">Clearpath · itsclearpath.com</p>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #9CA3AF;">Your child's report is never stored on our servers.</p>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #9CA3AF;"><a href="https://itsclearpath.com/privacy" style="color: #9CA3AF;">Privacy Policy</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };
}

export function subscriptionConfirmedEmail(params: { firstName?: string }) {
  const name = params.firstName || "there";
  return {
    subject: "Your Clearpath membership is active",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAF7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="padding: 0 0 32px 0;">
              <span style="font-size: 24px; font-weight: 700; color: #1B3A6B;">Clear</span><span style="font-size: 24px; font-weight: 700; color: #0B0E0D;">path</span>
            </td>
          </tr>
          <tr>
            <td style="background-color: #FFFFFF; border-radius: 16px; padding: 48px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
              <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700; color: #0B0E0D;">
                You are all set, ${name}.
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #5C6360; line-height: 1.7;">
                Your Clearpath membership is now active at $27/month. You have full access to everything — all seven brief sections, the IEP Document Analyzer, unlimited chat, and PDF download.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0; background-color: #EEF2F9; border-radius: 12px; padding: 24px;">
                <tr><td style="font-size: 14px; color: #0B0E0D; padding: 6px 0;">✓ All 7 brief sections unlocked</td></tr>
                <tr><td style="font-size: 14px; color: #0B0E0D; padding: 6px 0;">✓ IEP Document Analyzer</td></tr>
                <tr><td style="font-size: 14px; color: #0B0E0D; padding: 6px 0;">✓ Unlimited chat grounded in your child's report</td></tr>
                <tr><td style="font-size: 14px; color: #0B0E0D; padding: 6px 0;">✓ PDF download to bring to the meeting</td></tr>
                <tr><td style="font-size: 14px; color: #0B0E0D; padding: 6px 0;">✓ Every new feature as it launches</td></tr>
              </table>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #1B3A6B; border-radius: 8px;">
                    <a href="https://itsclearpath.com/dashboard" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none;">
                      Go to your dashboard →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0 0; font-size: 14px; color: #9CA3AF;">
                You can manage or cancel your subscription anytime from your account settings. Questions? Reply to this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 0 0 0; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #9CA3AF;">Clearpath · itsclearpath.com</p>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #9CA3AF;"><a href="https://itsclearpath.com/privacy" style="color: #9CA3AF;">Privacy Policy</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };
}
