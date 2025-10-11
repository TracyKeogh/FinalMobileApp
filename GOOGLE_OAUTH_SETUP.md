# Google OAuth Setup for NOWHITESPACE App

## 🔧 Fix Required: Supabase Google OAuth Configuration

You need to configure your Supabase project to accept the correct redirect URLs for your mobile app.

## 📋 Steps to Fix:

### 1. Go to Supabase Dashboard
- Visit: https://app.supabase.com/project/bqxypskdebsesfwpqrfv
- Go to **Authentication** → **Providers** → **Google**

### 2. Update Redirect URLs
In the Google OAuth settings, add these redirect URLs:

```
simplediaryapp://auth/callback
```

### 3. Update Site URL (Optional)
Change the Site URL from `coachpack.org` to:
```
simplediaryapp://auth/callback
```

### 4. Google Cloud Console Setup
You also need to update your Google Cloud Console:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID: `579431569676-jbu1k9dev5cj8lk6b5djgc7jsa20ph6e.apps.googleusercontent.com`
3. Add authorized redirect URIs:
   ```
   simplediaryapp://auth/callback
   ```

## 🎯 What This Fixes:

### Problem 1: "Continue to Supabase" vs "Continue to No White Space"
- **Before**: Google shows "Continue to Supabase" because redirect URL points to Supabase
- **After**: Google will show "Continue to Simple Diary" (your app name)

### Problem 2: Redirects to coachpack.org
- **Before**: After login, redirects to coachpack.org (wrong site URL)
- **After**: After login, stays in your app and shows the diary

## 🧪 Testing:

1. **Update the Supabase settings** (steps above)
2. **Restart your app** (the QR code should work)
3. **Try Google Sign-In again**
4. **You should see**: "Continue to Simple Diary" instead of "Continue to Supabase"
5. **After login**: You should go directly to your diary page

## 📱 Current App Configuration:

- **App Scheme**: `simplediaryapp`
- **Redirect URI**: `simplediaryapp://auth/callback`
- **App Name**: "Simple Diary"
- **Bundle ID**: `com.simplediaryapp.diary`

## 🚨 Important Notes:

- You need to update **both** Supabase AND Google Cloud Console
- The redirect URI must match exactly: `simplediaryapp://auth/callback`
- After making changes, it may take a few minutes to take effect
- Test with a fresh Google sign-in (logout first if needed)

## ✅ Expected Result:

After fixing these settings:
1. Google sign-in shows "Continue to Simple Diary"
2. After successful login, you see your diary with time slots (5AM-11PM)
3. No more redirects to coachpack.org
4. Smooth authentication flow

Let me know once you've updated the Supabase and Google Cloud Console settings!
