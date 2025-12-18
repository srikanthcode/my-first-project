# OTP Troubleshooting Guide

## Error: `auth/billing-not-enabled`

This error occurs when you are using a Firebase **Spark (Free)** plan and trying to send SMS to a real phone number.

### 2 Ways to Fix:

#### Option 1: Use Test Numbers (Free, Recommended for Dev)
You can whitelist specific phone numbers that will always work without sending a real SMS.

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Authentication** > **Sign-in method**.
3. Click on the **Phone** provider.
4. Scroll down to **Phone numbers for testing**.
5. Add a number (e.g., `+1 650-555-1234`) and a verification code (e.g., `123456`).
6. **In the app**, use this exact number. When asked for OTP, enter the code you set (`123456`).

#### Option 2: Enable Billing (Production)
To send real SMS to any number, you must upgrade your Firebase project to the **Blaze (Pay as you go)** plan.

1. Go to Firebase Console.
2. Click **Upgrade** in the bottom left.
3. Select **Blaze Plan**.
4. You will get 10 free SMS/day, then pay per SMS.
