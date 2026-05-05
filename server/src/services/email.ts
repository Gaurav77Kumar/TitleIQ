import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is missing');
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export async function sendOtpEmail(email: string, code: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not set. OTP code for', email, 'is:', code);
    return;
  }

  console.log(`[AUTH] Sending OTP ${code} to ${email}`);

  try {
    await getResend().emails.send({
      from: 'TitleIQ <onboarding@resend.dev>',
      to: email,
      subject: 'Your TitleIQ Access Code',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; padding: 40px;">
          <h2 style="color: #4f46e5; margin-top: 0;">Welcome to TitleIQ</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.5;">Use the following code to sign in to your account. This code will expire in 10 minutes.</p>
          <div style="background: #f3f4f6; padding: 24px; border-radius: 12px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827; margin: 32px 0;">
            ${code}
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
            If you didn't request this code, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send email via Resend:', err);
    throw new Error('Failed to send verification email. Please try again later.');
  }
}

export async function sendWelcomeEmail(email: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not set. Skipping welcome email for', email);
    return;
  }

  try {
    await resend.emails.send({
      from: 'TitleIQ <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to TitleIQ!',
      html: `
        <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 40px 10px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
            <!-- Header -->
            <div style="background-color: #111827; padding: 32px; text-align: left;">
              <span style="color: #ffffff; font-size: 24px; font-weight: bold; font-style: italic;">Title<span style="color: #6366f1;">IQ</span></span>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px;">
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Hi there,</p>
              <h1 style="color: #111827; font-size: 28px; font-weight: bold; margin: 0 0 24px 0; letter-spacing: -0.025em;">Your TitleIQ account is ready.</h1>
              <p style="color: #4b5563; font-size: 16px; margin-bottom: 32px; line-height: 1.5;">You're all set. Here's everything you can do right now — for free, today.</p>
              
              <!-- Features Box -->
              <div style="background-color: #f3f4f6; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="vertical-align: top; padding-bottom: 16px; color: #6366f1; font-weight: bold; width: 24px;">✓</td>
                    <td style="padding-bottom: 16px; padding-left: 8px; color: #374151; font-size: 14px; line-height: 1.5;">
                      <strong style="color: #111827;">Analyze 3 titles per day</strong> — get a score, sub-scores, and specific improvement tips for each one.
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align: top; padding-bottom: 16px; color: #6366f1; font-weight: bold;">✓</td>
                    <td style="padding-bottom: 16px; padding-left: 8px; color: #374151; font-size: 14px; line-height: 1.5;">
                      <strong style="color: #111827;">Get 1 alternative title</strong> — AI-generated based on what performs best in your niche.
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align: top; color: #6366f1; font-weight: bold;">✓</td>
                    <td style="padding-left: 8px; color: #374151; font-size: 14px; line-height: 1.5;">
                      <strong style="color: #111827;">See your weaknesses clearly</strong> — know exactly which dimension is dragging your CTR down.
                    </td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #4b5563; font-size: 16px; margin-bottom: 32px; line-height: 1.5;">
                Most creators improve their title score by <strong style="color: #111827;">20+ points</strong> after just 3 analyses. Go test your next video title now.
              </p>
              
              <div style="text-align: left; margin-bottom: 40px;">
                <a href="${process.env.CLIENT_URL || 'https://titleiq.com'}/#analyzer" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 18px 36px; border-radius: 14px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">Analyze a title now →</a>
              </div>
              
              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 40px 0;">
              
              <p style="color: #9ca3af; font-size: 13px; line-height: 1.6;">
                Want even more? <strong style="color: #6b7280;">Pro gives you unlimited analyses, 5 title alternatives, thumbnail analysis, and full history tracking</strong> — all for $9/month. No pressure — you'll know when you need it.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="padding: 32px; background-color: #fcfcfd; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin-bottom: 12px;">You're receiving this because you signed up at titleiq.com.</p>
              <div style="color: #9ca3af; font-size: 12px;">
                <a href="#" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a> · 
                <a href="#" style="color: #9ca3af; text-decoration: underline; margin-left: 8px;">Privacy policy</a>
              </div>
            </div>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send welcome email:', err);
  }
}
