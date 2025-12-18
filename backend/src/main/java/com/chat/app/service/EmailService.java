package com.chat.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Send OTP email with simple text format
     */
    public void sendOtpEmail(@NonNull String to, @NonNull String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your OTP Code");
            message.setText("Your OTP is: " + otp);
            mailSender.send(message);
            System.out.println("OTP email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    /**
     * Send OTP email with HTML template for better user experience
     */
    public void sendOtpEmailHtml(@NonNull String to, @NonNull String otp) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Your Fresh Chat Login Code");

            String htmlContent = buildOtpHtmlTemplate(otp);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            System.out.println("HTML OTP email sent successfully to: " + to);
        } catch (MessagingException e) {
            System.err.println("Error sending HTML email: " + e.getMessage());
            // Fallback to simple text email
            sendOtpEmail(to, otp);
        }
    }

    /**
     * Build professional HTML email template for OTP
     */
    private @NonNull String buildOtpHtmlTemplate(String otp) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #3390ec 0%, #00c6ff 100%); padding: 30px; text-align: center; }
                        .header h1 { color: white; margin: 0; font-size: 28px; }
                        .content { padding: 40px 30px; }
                        .content p { color: #333; font-size: 16px; line-height: 1.6; }
                        .otp-box { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0; border: 2px dashed #3390ec; }
                        .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #3390ec; font-family: 'Courier New', monospace; }
                        .footer { padding: 20px; text-align: center; background-color: #f8f9fa; color: #666; font-size: 14px; }
                        .warning { color: #dc3545; fontsize: 14px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Fresh Chat</h1>
                        </div>
                        <div class="content">
                            <h2>Hello!</h2>
                            <p>You have requested to log in to Fresh Chat. Please use the following One-Time Password (OTP) to complete your authentication:</p>

                            <div class="otp-box">
                                <div class="otp-code">"""
                + otp
                + """
                                        </div>
                                    </div>

                                    <p><strong>This code will expire in 10 minutes.</strong></p>
                                    <p class="warning">⚠️ If you didn't request this code, please ignore this email and ensure your account is secure.</p>
                                </div>
                                <div class="footer">
                                    <p>© 2024 Fresh Chat. All rights reserved.</p>
                                    <p>This is an automated message, please do not reply to this email.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                        """;
    }

    /**
     * Send a welcome email to new users
     */
    public void sendWelcomeEmail(@NonNull String to, @NonNull String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Welcome to Fresh Chat!");
            message.setText("Welcome " + userName + "! Thank you for joining Fresh Chat. Start messaging now!");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending welcome email: " + e.getMessage());
        }
    }
}
