# WhatsApp Clone - Modern Real-Time Chat Application

A production-quality WhatsApp clone built with **Next.js 14**, **TypeScript**, **TailwindCSS**, and **Zustand**. Features a clean, modern UI with dark/light mode, responsive design, and WhatsApp-like interactions.

![WhatsApp Clone](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)

## ✨ Features

### 🎨 UI/UX
- **WhatsApp-like Design**: Clean, modern interface matching WhatsApp Web and Mobile
- **Dark/Light Mode**: Seamless theme switching with persistent preferences
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Polished transitions and micro-interactions
- **Mobile Bottom Navigation**: Native app-like experience on mobile

### 💬 Chat Features
- **Chat List**: Recent conversations with last message preview
- **Message Bubbles**: Sent/received styling with timestamps
- **Typing Indicators**: Animated dots when someone is typing
- **Read Receipts**: Delivered/read status with blue ticks
- **Date Separators**: Organized message history by date
- **Search**: Find chats and contacts quickly
- **Pin/Mute**: Organize important conversations

### 🔧 Additional Features
- **User Authentication**: Login/Register pages (UI only)
- **Settings Panel**: Profile, notifications, privacy, and theme settings
- **Emoji Picker**: Full emoji support in messages
- **File Upload UI**: Placeholder for image/video/document sharing
- **Group Chats**: UI support for group conversations
- **Status Feature**: WhatsApp Status-like functionality (UI)
- **Contact List**: Manage and view contacts

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Emoji Picker**: emoji-picker-react
- **Notifications**: react-hot-toast

## 📁 Project Structure

```
whatsapp-next/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── chat/                 # Chat application
│   │   │   ├── [chatId]/         # Dynamic chat routes
│   │   │   ├── layout.tsx        # Chat layout with sidebar
│   │   │   └── page.tsx          # Main chat page
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page (redirects)
│   │
│   ├── components/               # React components
│   │   ├── chat/                 # Chat-specific components
│   │   │   ├── chat-header.tsx
│   │   │   ├── chat-item.tsx
│   │   │   ├── chat-list.tsx
│   │   │   ├── chat-window.tsx
│   │   │   ├── message-bubble.tsx
│   │   │   ├── message-input.tsx
│   │   │   ├── message-list.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── typing-indicator.tsx
│   │   ├── mobile/               # Mobile components
│   │   │   └── bottom-nav.tsx
│   │   ├── providers/            # Context providers
│   │   │   └── theme-provider.tsx
│   │   ├── settings/             # Settings components
│   │   │   └── settings-panel.tsx
│   │   └── ui/                   # Reusable UI components
│   │       ├── avatar.tsx
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── modal.tsx
│   │       └── theme-toggle.tsx
│   │
│   ├── lib/                      # Utilities and helpers
│   │   ├── constants.ts          # App constants
│   │   ├── mock-data.ts          # Mock data for development
│   │   └── utils.ts              # Utility functions
│   │
│   ├── store/                    # Zustand stores
│   │   ├── auth-store.ts         # Authentication state
│   │   ├── chat-store.ts         # Chats state
│   │   ├── message-store.ts      # Messages state
│   │   └── theme-store.ts        # Theme state
│   │
│   └── types/                    # TypeScript types
│       └── index.ts              # Type definitions
│
├── public/                       # Static assets
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies

```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "c:\Users\Lenovo\CHATING APP\whatsapp-next"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎯 Usage

### Authentication
- Navigate to `/auth/login` or `/auth/register`
- Currently uses mock authentication (frontend only)
- Automatically redirects to chat after "login"

### Chatting
- Select a chat from the sidebar
- Type messages in the input box
- Press Enter or click Send button
- Emoji picker available via smile icon
- File upload and voice message buttons (UI placeholders)

### Settings
- Click the settings icon in sidebar (desktop)
- Or use bottom navigation on mobile
- Customize profile, notifications, privacy, and theme

### Theme Switching
- Click sun/moon icon in sidebar
- Or toggle in Settings > Theme tab
- Preference is saved to localStorage

## 🔌 Backend Integration Guide

This is currently a **frontend-only** application with mock data. To integrate with a real backend:

### 1. **Replace Mock Data Services**

Update `src/lib/mock-data.ts` to fetch from your API:

```typescript
// Before (mock)
export const mockChats: Chat[] = [...];

// After (real API)
export async function fetchChats(): Promise<Chat[]> {
  const response = await fetch('/api/chats');
  return response.json();
}
```

### 2. **Implement Real-Time with Socket.io**

Create `src/lib/socket-service.ts`:

```typescript
import { io } from 'socket.io-client';

const socket = io('your-backend-url');

socket.on('message', (message) => {
  // Update message store
});

socket.on('typing', ({ chatId, userId }) => {
  // Update typing indicators
});
```

### 3. **Update Zustand Stores**

Modify stores to call API endpoints:

```typescript
// src/store/message-store.ts
sendMessage: async (chatId, content) => {
  const response = await fetch('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ chatId, content }),
  });
  const message = await response.json();
  // Update state
}
```

### 4. **Authentication**

Implement real auth in `src/store/auth-store.ts`:

```typescript
login: async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  const { user, token } = await response.json();
  // Store token, update state
}
```

### Recommended Backend Stack
- **Firebase**: Easy real-time database and authentication
- **Supabase**: PostgreSQL with real-time subscriptions
- **Socket.io + Express**: Custom Node.js backend
- **Next.js API Routes**: Built-in API endpoints

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  primary: {
    DEFAULT: "#25D366", // WhatsApp green
    dark: "#00A884",
  },
  // ... more colors
}
```

### Fonts
Change font in `src/app/layout.tsx`:

```typescript
import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });
```

## 📱 Responsive Design

- **Desktop (1024px+)**: Sidebar + chat window layout
- **Tablet (768px-1023px)**: Collapsible sidebar
- **Mobile (<768px)**: Full-screen views with bottom navigation

## 🐛 Known Limitations

- **No Real Backend**: Uses mock data and simulated delays
- **No File Uploads**: UI only, no actual file handling
- **No Voice Messages**: Placeholder button
- **No Video/Audio Calls**: UI buttons only
- **No Push Notifications**: Browser notifications not implemented

## 🚀 Future Enhancements

- [ ] Integrate Firebase/Supabase for real-time messaging
- [ ] Implement file upload with cloud storage
- [ ] Add WebRTC for video/audio calls
- [ ] Push notifications with service workers
- [ ] End-to-end encryption
- [ ] Message reactions and replies
- [ ] Voice messages with recording
- [ ] Status/Stories feature
- [ ] Group admin features
- [ ] Message search within chats

## 📄 License

This project is for educational purposes. WhatsApp is a trademark of Meta Platforms, Inc.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your own use!

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using Next.js 14 and TypeScript**
