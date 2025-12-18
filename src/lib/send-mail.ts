import nodemailer from 'nodemailer';

// Lazy-initialize transporter on-demand (compatible with Next.js SSR)
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
    if (!transporter) {
        // Support both GMAIL_USER and SMTP_USER for compatibility
        const emailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
        const emailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS; // Changed from SMTP_PASSWORD to SMTP_PASS

        console.log('📧 Email Config:', {
            user: emailUser ? `${emailUser.substring(0, 5)}...` : 'NOT SET',
            pass: emailPass ? '***SET***' : 'NOT SET',
            service: 'gmail'
        });

        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });
    }
    return transporter;
}

export async function sendEmailOTP(email: string, otp: string) {
    const emailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
    const emailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS; // Changed from SMTP_PASSWORD to SMTP_PASS

    if (!emailUser || !emailPass) {
        console.error('❌ Gmail credentials not configured!');
        console.error('Set SMTP_USER and SMTP_PASS in .env.local');
        throw new Error('Gmail credentials not found in environment variables.');
    }

    const mailOptions = {
        from: `"Fresh Chat Security" <${emailUser}>`,
        to: email,
        subject: 'Your Fresh Chat Login Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #3390ec; text-align: center;">🔐 Fresh Chat Login</h2>
                <p style="font-size: 16px; color: #333;">Hello,</p>
                <p style="font-size: 16px; color: #333;">Your verification code is:</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
                <p style="font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
            </div>
        `,
    };

    try {
        console.log(`📨 Sending OTP to ${email}...`);
        const transporter = getTransporter();
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent successfully to ${email}`);
        console.log('📧 Message ID:', info.messageId);
        return info;
    } catch (error: any) {
        console.error('❌ Error sending email:', error);
        console.error('Error details:', {
            code: error.code,
            command: error.command,
            message: error.message
        });
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
}
