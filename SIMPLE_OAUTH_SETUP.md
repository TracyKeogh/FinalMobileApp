# Simple OAuth Setup - Back to Basics

## 🎯 Goal
- No White Space mobile app: Google OAuth login
- CoachPack web app: Google OAuth login  
- Shared Supabase database for both apps
- Users can login on either app with same credentials

## 🔧 Simple Approach

### Option 1: Separate Google OAuth Clients (Recommended)
1. **Mobile App Client**: `579431569676-jbu1k9dev5cj8lk6b5djgc7jsa20ph6e.apps.googleusercontent.com` (Android)
2. **Web App Client**: `579431569676-53ejmft2l1hhe8g8mit1aqqtfe1hm9fl.apps.googleusercontent.com` (Web)
3. **Each app uses its own client ID**
4. **Same Supabase database** for data sharing

### Option 2: Single Client with Proper Redirects
1. **One Google OAuth client** for both apps
2. **Multiple redirect URIs**:
   - `https://coachpack.org/auth/callback` (web)
   - `simplediaryapp://auth/callback` (mobile)
3. **Proper app identification** in OAuth flow

## 🚀 Quick Fix

The mobile app should work now with the reverted code. The key changes:
1. ✅ **Reverted to original working code**
2. ✅ **Using proper redirect URI**: `https://coachpack.org/auth/callback`
3. ✅ **Hash fragment parsing** for Supabase OAuth tokens
4. ✅ **Callback page deployed** with correct token extraction

## 🧪 Test Now

The mobile app should work properly now. Try scanning the QR code and testing Google OAuth.

If it still shows "Continue to Supabase", the issue is in Google Cloud Console OAuth consent screen configuration, not the code.
