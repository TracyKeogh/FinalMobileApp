# Simple Diary App

A clean and simple diary app to track your daily activities by time slots. Built with Expo and React Native.

## Features

- Time-slot based diary entries (5AM - 11PM)
- Persistent storage with Supabase
- Clean, minimal interface
- Automatic data sync

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- EAS CLI (for building and deploying)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Run type checking:
```bash
npm run typecheck
```

4. Build for web:
```bash
npm run build:web
```

## Building for Play Store

### Install EAS CLI
```bash
npm install -g eas-cli
```

### Login to Expo
```bash
eas login
```

### Configure the build
The app is already configured with the necessary EAS build settings in `eas.json`.

### Create a production build (AAB for Play Store)
```bash
eas build --platform android --profile production
```

This will create an Android App Bundle (.aab) file ready for Play Store submission.

### Submit to Play Store
After the build completes:
```bash
eas submit --platform android
```

Follow the prompts to submit your app to the Google Play Store.

## Environment Variables

The app requires the following environment variables (already configured):
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## App Configuration

Key configuration in `app.json`:
- **Name**: Simple Diary
- **Package**: com.simplediaryapp.diary
- **Version**: 1.0.0
- **Platforms**: iOS, Android, Web

## Database

The app uses Supabase for data persistence with the following schema:
- **diary_entries** table stores time-slot entries with automatic timestamps

## License

Private
