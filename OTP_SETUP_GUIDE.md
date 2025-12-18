# OTP SMS Configuration Guide

## Overview
This application uses OTP (One-Time Password) authentication via SMS for secure login. The OTP system works on **all platforms including iOS**.

## How It Works

### Development Mode
- In development, OTPs are displayed in the browser console and toast notifications
- No actual SMS is sent (unless Twilio is configured)
- Any 6-digit code will work for testing

### Production Mode (iOS-Ready)
- Real SMS messages are sent to users' phones via Twilio
- Works on iOS, Android, and all phone types
- OTPs expire after 10 minutes
- Rate limiting prevents abuse (max 3 attempts per 5 minutes)

## Setting Up SMS for iOS (Twilio Integration)

### Step 1: Create a Twilio Account
1. Go to [Twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Verify your email and phone number

### Step 2: Get Your Twilio Credentials
1. Log in to your Twilio Console
2. Navigate to the Dashboard
3. Find and copy these credentials:
   - **Account SID**
   - **Auth Token**
4. Go to "Phone Numbers" → "Manage" → "Buy a number"
5. Purchase a phone number (trial accounts get $15 credit)
6. Copy your **Twilio Phone Number**

### Step 3: Configure Environment Variables
Create or update your `.env.local` file in the root directory:

```env
# Twilio Configuration for SMS OTP
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# Environment
NODE_ENV=production
```

### Step 4: Test on iOS
1. Make sure your environment variables are set
2. Restart your Next.js server
3. Open the app on your iOS device
4. Enter your phone number (must be in international format: +1234567890)
5. You should receive an SMS with the OTP on your iPhone

## Troubleshooting iOS SMS Issues

### OTP Not Arriving on iPhone?

1. **Check Phone Number Format**
   - Must include country code: `+1234567890`
   - No spaces or special characters

2. **Verify Twilio Configuration**
   - Ensure `.env.local` has correct credentials
   - Restart the Next.js dev server after adding env variables
   - Check Twilio console for error logs

3. **Trial Account Limitations**
   - Twilio trial accounts can only send to verified phone numbers
   - Verify your phone number in Twilio Console → Phone Numbers → Verified Caller IDs
   - Upgrade to a paid account to send to any number

4. **iOS SMS Filtering**
   - Check iPhone's "Unknown & Spam" folder in Messages
   - Add Twilio number to contacts
   - Ensure "Filter Unknown Senders" is off in Settings → Messages

5. **Network Issues**
   - Ensure iPhone has cellular service
   - Try sending from a different network
   - Check if SMS is enabled on your carrier plan

### Alternative SMS Providers

If Twilio doesn't work for you, you can also use:

- **AWS SNS** (Amazon Simple Notification Service)
- **SendGrid** (Email-to-SMS gateway)
- **MessageBird**
- **Vonage** (formerly Nexmo)

Update the `sendOTPViaSMS` function in `/src/app/api/auth/send-otp/route.ts` to use your preferred provider.

## API Endpoints

### Send OTP
```
POST /api/auth/send-otp
Body: { "phoneNumber": "+1234567890" }
```

### Verify OTP
```
POST /api/auth/verify-otp
Body: { "phoneNumber": "+1234567890", "otp": "123456" }
```

## Security Features

- ✅ Rate limiting (max 3 attempts per 5 minutes)
- ✅ OTP expiration (10 minutes)
- ✅ Secure storage (in-memory, use Redis in production)
- ✅ International phone number support
- ✅ Works on iOS, Android, and all devices

## Production Recommendations

1. **Use Redis** for OTP storage instead of in-memory Map
2. **Implement user sessions** with JWT tokens
3. **Add phone number verification** before sending OTP
4. **Monitor Twilio usage** to prevent unexpected charges
5. **Add CAPTCHA** to prevent automated abuse
6. **Store user data** in a proper database (MongoDB, PostgreSQL)

## Cost Estimate

- Twilio: ~$0.0075 per SMS (US)
- Most regions: $0.01 - $0.05 per SMS
- Trial credit: $15 (enough for ~2000 SMS)

## Support

If you're still experiencing issues with OTP on iOS:
1. Check the browser console for development OTP codes
2. Review Twilio logs in the Twilio Console
3. Ensure environment variables are loaded (restart server)
4. Test with a verified phone number first

---

**Note**: The current implementation works perfectly on iOS when Twilio is configured. In development mode, the OTP is shown in the console for easy testing.
