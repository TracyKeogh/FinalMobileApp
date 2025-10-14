# OAuth Setup Test Guide

Use this guide to systematically test your OAuth setup and identify any remaining issues.

## ✅ Pre-Flight Checklist

Before testing, verify these files/settings are correct:

### 1. Environment Variables
- [ ] `.env` file exists in project root
- [ ] Contains `EXPO_PUBLIC_SUPABASE_URL`
- [ ] Contains `EXPO_PUBLIC_SUPABASE_ANON_KEY`

**Test it**:
```bash
cat .env | grep EXPO_PUBLIC
```

Should show both variables populated.

### 2. Callback Page Deployed
- [ ] `coachpack-auth-callback.html` copied to CoachPack repo
- [ ] Deployed and accessible

**Test it**:
```bash
curl -I https://coachpack.org/auth/callback
```

Should return `HTTP/1.1 200 OK` or `HTTP/2 200`

### 3. Google Cloud Console
- [ ] OAuth consent screen application name changed to "No White Space"

**Test it**: 
- Visit the OAuth consent screen in Google Cloud Console
- Verify the application name displays "No White Space"

---

## 🧪 Testing OAuth Flow

### Test 1: Start the App
```bash
cd "/Users/iggy/Downloads/Final Mobile/FinalMobileApp-main"
npx expo start
```

**Expected**: App starts without errors

---

### Test 2: Initiate Google Sign-In

1. Open the app on iOS Simulator or Android Emulator
2. Tap "Sign in with Google"

**Expected Results**:
- ✅ Browser/WebView opens
- ✅ Shows Google sign-in page
- ✅ Shows "**Continue to No White Space**" (if Google Cloud Console updated)
- ✅ Can select Google account

---

### Test 3: Complete Authentication

1. Select your Google account
2. Grant permissions if prompted

**Expected Results**:
- ✅ Redirects to `https://coachpack.org/auth/callback`
- ✅ Callback page shows "Authentication Successful!"
- ✅ Callback page shows spinner
- ✅ After ~1-2 seconds, app automatically opens

---

### Test 4: Verify App Session

In the app, check:
- ✅ User is logged in
- ✅ User details are shown (email, name, etc.)
- ✅ Can access authenticated features

**In app console, look for**:
```
Using web redirect URI: https://coachpack.org/auth/callback
Auth callback URL: simplediaryapp://auth/callback#access_token=...
Access Token: Present
Refresh Token: Present
```

---

## 🐛 Troubleshooting Tests

### Issue: "Continue to Supabase" still shows

**Problem**: Google Cloud Console not updated
**Solution**: 
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Project: `weighty-legend-466712-c5`
3. APIs & Services → OAuth consent screen → EDIT APP
4. Change Application name to "No White Space"
5. Save

**Re-test**: Start from Test 2

---

### Issue: "No Authentication Data" on callback page

**Problem**: Callback page not parsing hash correctly OR Supabase not sending tokens

**Debug**:
1. Open browser DevTools on callback page (F12)
2. Check Console tab for logs
3. Check Network tab for the request to callback page

**Look for**:
```javascript
Hash: access_token=eyJ...&refresh_token=...
Access Token: Present
Refresh Token: Present
```

**If hash is empty**:
- Problem: Supabase not redirecting with tokens
- Check: Supabase redirect URLs configuration
- Verify: Google OAuth provider is enabled in Supabase

**If hash has data but "Access Token: Missing"**:
- Problem: JavaScript not parsing correctly
- Verify: Latest `coachpack-auth-callback.html` is deployed
- Check: No CDN caching (hard refresh with Ctrl+Shift+R)

**Re-test**: Start from Test 2

---

### Issue: App doesn't open after callback

**Problem**: Deep link not working OR callback not redirecting

**Debug**:
1. Check callback page console: Should see `Redirecting to app: simplediaryapp://...`
2. Check mobile device: Does it prompt to open app?

**Solutions**:
- **iOS Simulator**: Deep links might not work. Test on real device.
- **Android Emulator**: Run `adb shell am start -a android.intent.action.VIEW -d "simplediaryapp://auth/callback"`
- **Callback not redirecting**: Verify `window.location.href` is being called in callback page

**Manual Test**:
```bash
# iOS (if on Mac with device connected)
xcrun simctl openurl booted "simplediaryapp://auth/callback#access_token=test"

# Android (with emulator/device connected)
adb shell am start -a android.intent.action.VIEW -d "simplediaryapp://auth/callback#access_token=test"
```

If this opens the app, deep linking works. Issue is in callback page redirect.

**Re-test**: Start from Test 2

---

### Issue: App opens but no session

**Problem**: Token extraction or session setting failing in app

**Debug**:
1. Check app console logs
2. Look for "Access Token: Present"
3. Check if `supabase.auth.setSession()` is called

**Possible causes**:
- Hash fragment not being parsed (check `url.hash` in AuthContext)
- `setSession` call failing (check for error logs)
- Supabase client not initialized (check `lib/supabase.ts`)

**Test manually in app**:
Add temporary code to AuthContext:
```typescript
console.log('Result URL:', result.url);
console.log('Full hash:', url.hash);
console.log('Parsed hash params:', Object.fromEntries(hashParams));
```

**Re-test**: Start from Test 2

---

## 🔬 Advanced Debugging

### Test Callback Page Standalone

Create a test URL:
```
https://coachpack.org/auth/callback#access_token=test123&refresh_token=test456&token_type=bearer&expires_in=3600
```

Open this in browser with DevTools open.

**Expected console output**:
```
Callback page loaded
Hash: access_token=test123&refresh_token=test456&token_type=bearer&expires_in=3600
Access Token: Present
Refresh Token: Present
Redirecting to app: simplediaryapp://auth/callback#access_token=test123&...
```

If this works, callback page parsing is correct. Issue is with Supabase OAuth flow.

---

### Test Deep Link Handling in App

Manually trigger deep link:

```bash
# iOS Simulator
xcrun simctl openurl booted "simplediaryapp://auth/callback#access_token=test&refresh_token=test"

# Android
adb shell am start -a android.intent.action.VIEW -d "simplediaryapp://auth/callback#access_token=test&refresh_token=test"
```

**Check app console**:
- Should see "Auth callback URL: ..."
- Should see token extraction logs

If this works, deep linking is correct. Issue is in OAuth redirect flow.

---

## 📊 Success Criteria Summary

All tests should pass:

- ✅ App starts without errors
- ✅ Google sign-in opens browser
- ✅ Shows "Continue to No White Space"
- ✅ Redirects to callback page after auth
- ✅ Callback page shows "Authentication Successful"
- ✅ App opens automatically
- ✅ User is logged in with session
- ✅ Console logs show tokens present at each step

---

## 📞 Support

If all tests fail:

1. **Check basics**:
   - Internet connection working?
   - Supabase project is active?
   - Google OAuth credentials not expired?

2. **Review configuration**:
   - `OAUTH_FIX_GUIDE.md` - Full setup guide
   - `DEPLOYMENT_CHECKLIST.md` - Deployment steps
   - `FIXES_SUMMARY.md` - Overview of changes

3. **Collect debug info**:
   - All console logs (browser + app)
   - Network requests (DevTools Network tab)
   - Exact error messages
   - Screenshots of each step

---

**Remember**: The most common issue is the callback page not being deployed or cached. Always hard-refresh (Ctrl+Shift+R) the callback page during testing!

