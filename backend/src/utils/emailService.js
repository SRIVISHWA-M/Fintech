const { Resend } = require('resend');

// We use process.env.RESEND_API_KEY if it exists, otherwise a dummy key
// Note: Without a valid RESEND_API_KEY, actual email sending will fail,
// but the Resend client can still be instantiated.
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_dev');

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:8081/verify-email?token=${token}`;
  
  console.log('\n=============================================');
  console.log(`[EMAIL SERVICE] Sending Verification Email to ${email}`);
  console.log(`[EMAIL SERVICE] Link: ${verificationUrl}`);
  console.log('=============================================\n');

  if (!process.env.RESEND_API_KEY) {
    console.log('[EMAIL SERVICE] Missing RESEND_API_KEY. Skipping actual email send via Resend.');
    return true;
  }

  try {
    const data = await resend.emails.send({
      from: 'Hidel Finance <onboarding@resend.dev>', // resend.dev is the default sandbox domain
      to: [email],
      subject: 'Verify your Hidel Finance Account',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111827;">Welcome to Hidel Finance!</h2>
          <p style="color: #4B5563; font-size: 16px;">
            Thank you for creating an account with us. Please verify your email address by clicking the button below.
          </p>
          <div style="margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #A3E635; color: #111827; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Verify Email
            </a>
          </div>
          <p style="color: #6B7280; font-size: 14px;">
            If the button doesn't work, you can copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #60A5FA;">${verificationUrl}</a>
          </p>
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            This link will expire in 30 minutes.
          </p>
        </div>
      `
    });
    
    console.log('[EMAIL SERVICE] Email sent successfully via Resend. ID:', data.id);
    return true;
  } catch (error) {
    console.error('[EMAIL SERVICE] Failed to send email via Resend:', error);
    // We throw or handle error depending on requirements. For now, log it.
    throw new Error('Failed to send verification email');
  }
};

module.exports = {
  sendVerificationEmail
};
