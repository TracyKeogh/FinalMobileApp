# OAuth Issues - Complete Fix Guide

This guide will help you resolve both Google OAuth issues with your Simple Diary app.

## 🔍 Root Causes Identified

### Issue 1: "Continue to Supabase" instead of "Continue to No White Space"
**Root Cause**: The OAuth consent screen application name in Google Cloud Console is set to "Supabase"

### Issue 2: "No Authentication Data" error on callback
**Root Cause**: Supabase OAuth returns tokens in URL **hash fragments** (`#access_token=...`) not query parameters (`?access_token=...`). The callback pages were parsing query parameters instead of hash fragments.

## ✅ What's Been Fixed (Automatically)

### 1. Callback HTML Files Updated
Both `auth-callback.html` and `coachpack-auth-callback.html` have been updated to:
- Parse URL hash fragments instead of query parameters
- Include better logging for debugging
- Show error descriptions when authentication fails
- Properly redirect back to the app with the hash fragment

### 2. AuthContext Updated
The `contexts/AuthContext.tsx` file has been updated to:
- Extract tokens from hash fragments in the deep link URL
- Add logging to help debug the OAuth flow
- Properly handle the Supabase OAuth response format

## 🛠️ What You Need to Do Manually

### Step 1: Create .env File
Since .env files are git-ignored, you need to create one manually:

1. Create a new file named `.env` in the project root
2. Add the following content:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://bqxypskdebsesfwpqrfv.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeHlwc2tkZWJzZXNmd3BxcmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzE0MTksImV4cCI6MjA2NTk0NzQxOX0.xmg8dQFM9i9Dt33XPSOeHvAsA6s68LBdPCZurfz7X08
```

⚠️ **IMPORTANT**: Do NOT commit the service role key to git. Keep it private.

### Step 2: Update Google Cloud Console OAuth Consent Screen

This is the fix for **Issue 1** - changing "Continue to Supabase" to "Continue to No White Space":

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project: `weighty-legend-466712-c5`
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Click **EDIT APP** at the top
5. Change the **Application name** from "Supabase" to "**No White Space**" or "**Simple Diary**"
6. Optionally update:
   - **Application logo**: Upload your app logo
   - **Application home page**: Set to your app's website
   - **Application privacy policy link**: Add if you have one
   - **Application terms of service link**: Add if you have one
7. Click **SAVE AND CONTINUE** through all steps
8. Click **BACK TO DASHBOARD**

### Step 3: Deploy Callback Page to CoachPack

You need to deploy the updated callback page to your CoachPack website:

1. Copy `coachpack-auth-callback.html` to your CoachPack repository
2. Rename it to match your deployment structure (e.g., to `auth/callback.html` or `auth-callback.html`)
3. Make sure it's accessible at: `https://coachpack.org/auth/callback`
4. Commit and push the changes
5. Verify the deployment is live

### Step 4: Verify Supabase Configuration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `bqxypskdebsesfwpqrfv`
3. Go to **Authentication** → **URL Configuration**
4. Verify the following settings:
   - **Site URL**: `https://coachpack.org` (or your preferred URL)
   - **Redirect URLs**: Should include `https://coachpack.org/auth/callback`

5. Go to **Authentication** → **Providers** → **Google**
6. Verify both Client IDs are configured:
   - Web Client ID: `579431569676-53ejmft2l1hhe8g8mit1aqqtfe1hm9fl.apps.googleusercontent.com`
   - Android Client ID: `579431569676-jbu1k9dev5cj8lk6b5djgc7jsa20ph6e.apps.googleusercontent.com`

## 🧪 Testing the OAuth Flow

### Test on iOS/Android:

1. Build and run your app:
   ```bash
   npx expo start
   ```

2. Tap the "Sign in with Google" button

3. **Expected flow**:
   - Opens browser with Google sign-in
   - Shows "**Continue to No White Space**" (after Step 2 is completed)
   - After authentication, redirects to `https://coachpack.org/auth/callback`
   - Callback page extracts tokens from hash fragment
   - Redirects back to app: `simplediaryapp://auth/callback#access_token=...&refresh_token=...`
   - App receives deep link and sets session
   - User is logged in!

### Debugging:

If you encounter issues:

1. **Check browser console** on the callback page:
   - Open `https://coachpack.org/auth/callback` after OAuth
   - Open DevTools Console (F12)
   - Look for logs showing "Hash:", "Access Token:", etc.

2. **Check app logs**:
   - Look for "Auth callback URL:" in your app's console
   - Verify tokens are being extracted

3. **Common issues**:
   - **Still shows "Continue to Supabase"**: Complete Step 2
   - **"No Authentication Data"**: Verify callback page is deployed correctly
   - **App doesn't open**: Check that `simplediaryapp://` scheme is registered in `app.json`
   - **Session not set**: Check that tokens are being extracted from hash fragment

## 📋 Technical Details

### OAuth Flow:
1. App initiates OAuth with `supabase.auth.signInWithOAuth()`
2. User authenticates with Google
3. Google redirects to Supabase
4. Supabase redirects to `https://coachpack.org/auth/callback#access_token=...&refresh_token=...`
5. Callback page extracts tokens from hash fragment
6. Callback page redirects to `simplediaryapp://auth/callback#access_token=...&refresh_token=...`
7. App handles deep link and extracts tokens from hash fragment
8. App calls `supabase.auth.setSession()` to establish session

### Key Files Modified:
- ✅ `contexts/AuthContext.tsx` - Updated to parse hash fragments
- ✅ `auth-callback.html` - Updated to parse hash fragments
- ✅ `coachpack-auth-callback.html` - Updated to parse hash fragments

### Configuration:
- **App Scheme**: `simplediaryapp://`
- **Bundle ID**: `com.simplediaryapp.diary`
- **Supabase URL**: `https://bqxypskdebsesfwpqrfv.supabase.co`
- **OAuth Redirect**: `https://coachpack.org/auth/callback`
- **Google Project ID**: `weighty-legend-466712-c5`

## 🎉 Expected Results

After completing all steps:

✅ **Issue 1 Fixed**: OAuth consent screen shows "Continue to No White Space"
✅ **Issue 2 Fixed**: Authentication tokens are properly extracted and user is logged in
✅ **Flow works**: Seamless redirect from browser back to mobile app

## 📞 Need Help?

If you still encounter issues:
1. Check the browser console logs on the callback page
2. Check the app console logs
3. Verify all URLs are correct
4. Ensure the callback page is deployed and accessible
5. Verify Google OAuth consent screen has been updated

---

**Last Updated**: October 13, 2025
**App Version**: 1.0.0
**Expo SDK**: 54

