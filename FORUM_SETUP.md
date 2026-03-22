# 🎮 Forum Setup & Configuration Guide

## Fitur Forum

✅ **Authentication**
- Email & Password login
- Google OAuth login
- Anonymous login
- User profiles

✅ **Forum Features**
- Create/read threads
- Real-time replies
- Category filtering
- Search functionality
- Thread stats (views, likes, replies)

✅ **User Features**
- User dashboard
- Profile management
- Thread history
- Activity tracking

---

## Setup Firebase

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "teknologi-santuy-forum")
4. Accept terms and create project
5. Wait for project to be created

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable providers:
   - **Email/Password**: Click "Email/Password" → Enable
   - **Google**: Click "Google" → Enable
   - **Anonymous**: Click "Anonymous" → Enable

### 3. Create Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click "Create Database"
3. Select region (e.g., asia-southeast1 for Indonesia)
4. Choose **Start in test mode** (for development)
5. Create database

### 4. Set Firestore Security Rules

Replace default rules with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth.uid == userId;
    }

    // Forum threads
    match /forum_threads/{threadId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.author.uid;

      // Thread replies (subcollection)
      match /replies/{replyId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update, delete: if request.auth.uid == resource.data.author.uid;
      }
    }
  }
}
```

### 5. Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Copy the config object
5. Fill in `.env.local` with your config values

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=teknologi-santuy-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=teknologi-santuy-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=teknologi-santuy-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://teknologi-santuy-xxx.firebaseio.com
```

---

## Forum Database Structure

### Collections

```
users/ 
  ├── {uid}
  │   ├── email: string
  │   ├── displayName: string
  │   ├── photoURL: string (optional)
  │   ├── bio: string
  │   ├── createdAt: timestamp
  │   ├── isAnonymous: boolean
  │   └── role: string (user, moderator, admin)

forum_threads/
  ├── {threadId}
  │   ├── title: string
  │   ├── content: string
  │   ├── category: string (game-pc, game-mobile, emulator, tips-tricks, announcement)
  │   ├── author: {uid, name, photoURL}
  │   ├── views: number
  │   ├── likes: number
  │   ├── replies: number
  │   ├── createdAt: timestamp
  │   ├── lastReplyAt: timestamp
  │   └── replies/ (subcollection)
  │       └── {replyId}
  │           ├── content: string
  │           ├── author: {uid, name, photoURL}
  │           ├── likes: number
  │           └── createdAt: timestamp
```

---

## Pages & Routes

### Public Routes
- `/auth/login` - Login page
- `/auth/signup` - Signup page

### Protected Routes (Require Authentication)
- `/forum` - Forum home, list all threads
- `/forum/[categoryId]` - Threads by category
- `/forum/thread/[threadId]` - Thread detail & replies

### Future Routes
- `/dashboard` - User profile & settings
- `/forum/my-threads` - User's own threads
- `/forum/search` - Advanced search

---

## Development

### Install Dependencies

```bash
npm install
```

### Get Deps Status

```bash
npm ls firebase
```

### Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000/forum](http://localhost:3000/forum)

---

## Testing

1. **Sign up** dengan email atau Google
2. **Create Thread** dari forum home
3. **Reply** ke thread
4. **Filter** by category
5. **View** thread details
6. **Logout** via sidebar

---

## Troubleshooting

### Error: "Firebase config is invalid"
- Check `.env.local` file exists
- Verify all NEXT_PUBLIC_FIREBASE_* variables are set
- For Google OAuth, also setup OAuth consent screen in Google Cloud Console

### Error: "Permission denied" on Firestore
- Check security rules are updated
- Verify authentication is enabled for your provider
- Check user is authenticated (browser console)

### Threads not appearing
- Verify `/forum_threads` collection exists in Firestore
- Check Firestore security rules allow `read` access
- Check browser console for errors

---

## Next Features to Add

- [ ] Real-time updates using Socket.io
- [ ] Thread search functionality
- [ ] User notifications
- [ ] Like/upvote functionality
- [ ] Mention (@username) system
- [ ] Rich text editor
- [ ] Image uploads
- [ ] Moderation tools
- [ ] Thread pinning/locking
- [ ] User roles & permissions

---

## File Structure

```
app/
├── auth/
│   ├── login/page.js
│   └── signup/page.js
├── forum/
│   ├── layout.js (Sidebar & navigation)
│   ├── page.js (Forum home)
│   ├── [categoryId]/page.js (Category view)
│   └── thread/
│       └── [threadId]/page.js (Thread detail)
└── providers.js (AuthProvider wrapper)

lib/
├── firebase.js (Firebase initialization)
└── auth-context.js (Authentication context)

.env.local.example (Environment template)
```

---

## Support

For issues or questions about the forum setup, check:
1. Browser console for JavaScript errors
2. Firebase Console for Firestore/Auth errors
3. Network tab for API request failures

---

Happy forumming! 🎮💬
