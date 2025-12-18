# ChatFresh Configuration Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Twilio Configuration (for Real SMS OTP)

To enable real SMS OTP sending, you need a Twilio account:

1. Sign up at [twilio.com](https://www.twilio.com/)
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number for sending SMS

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

### Google Gemini AI (for AI Chat Assistant)

To enable the AI Chat Assistant with advanced responses:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key

```env
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Note:** If the Gemini API key is not configured, the AI chat will still work with basic fallback responses.

### Firebase Configuration

For real-time features, authentication, and storage:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Features Configuration

### 1. SMS OTP
- **With Twilio:** Real SMS to user's phone
- **Without Twilio:** OTP shown in-app (development mode)

### 2. AI Chat Assistant
- **With Gemini:** Advanced AI responses
- **Without Gemini:** Basic fallback responses (jokes, time, help)

### 3. Video/Audio Calls
- Currently simulated with UI
- For real WebRTC calls, integrate with a signaling server

### 4. Status/Stories
- Fully functional with mock data
- Images stored locally or via Firebase Storage

## Feature List

✅ **Complete Registration/Profile System**
- Multi-step registration flow
- Phone verification with OTP
- Profile creation with avatar upload
- Bio and username support

✅ **Group Creation & Chat**
- Create groups with multiple members
- Group name, description, and image
- Group admin management

✅ **Status/Stories Feature**
- Text and image statuses
- 24-hour expiration
- Views and likes tracking
- Beautiful gradient backgrounds

✅ **Video & Audio Calls**
- One-on-one calls
- Group video/voice calls (Telegram-like)
- Mute, video toggle, screen share
- Call history

✅ **AI Chat Assistant**
- Powered by Google Gemini
- Fallback responses without API key
- Conversation history
- Quick suggestions

✅ **Profile Management**
- Full profile editing
- Privacy settings
- Notification preferences
- Appearance customization
- Theme toggle (Dark/Light)

### Unique Features

- 🎤 **Voice Notes** - Record and send voice messages
- 💬 **Message Reactions** - React with emojis
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Glassmorphism and animations
- 🔒 **Privacy Controls** - Last seen, read receipts
- 🌙 **Dark Mode** - Full dark theme support

## Running the App

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** TailwindCSS, Framer Motion
- **State Management:** Zustand
- **UI Components:** Custom components with Radix primitives
- **Backend:** Next.js API Routes
- **Database:** Firebase Realtime Database (optional: MongoDB)
- **Authentication:** Phone OTP (Twilio)
- **AI:** Google Gemini
