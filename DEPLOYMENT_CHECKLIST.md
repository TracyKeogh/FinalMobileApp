# OAuth Fix - Deployment Checklist

## ✅ Completed (Automated Fixes)

- [x] Fixed `auth-callback.html` to parse URL hash fragments
- [x] Fixed `coachpack-auth-callback.html` to parse URL hash fragments  
- [x] Updated `contexts/AuthContext.tsx` to extract tokens from hash fragments
- [x] Added debug logging to all OAuth flow components
- [x] Created comprehensive fix guide: `OAUTH_FIX_GUIDE.md`

## 📋 Manual Steps Required

### 1. Environment Setup
- [ ] Create `.env` file with Supabase credentials (see OAUTH_FIX_GUIDE.md)
- [ ] Verify `.env` is in `.gitignore`

### 2. Google Cloud Console
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Navigate to OAuth consent screen
- [ ] Change application name from "Supabase" to "No White Space"
- [ ] Save changes

### 3. Deploy Callback Page
- [ ] Copy `coachpack-auth-callback.html` to CoachPack repository
- [ ] Deploy to `https://coachpack.org/auth/callback`
- [ ] Verify page is accessible at that URL
- [ ] Test that page loads without errors

### 4. Supabase Configuration Check
- [ ] Verify Site URL is set correctly
- [ ] Verify redirect URL `https://coachpack.org/auth/callback` is allowed
- [ ] Confirm both Google Client IDs are configured

### 5. Testing
- [ ] Run `npx expo start`
- [ ] Test Google OAuth on iOS
- [ ] Test Google OAuth on Android
- [ ] Verify "Continue to No White Space" text appears
- [ ] Verify successful redirect back to app
- [ ] Verify user session is established

## 🔑 Key Technical Changes

### Root Cause - Hash vs Query Parameters
**Problem**: Supabase OAuth returns tokens in URL hash fragments (`#access_token=...`), not query parameters (`?access_token=...`)

**Solution**: Updated all token extraction to use `window.location.hash` instead of `window.location.search`

### Files Modified
1. **contexts/AuthContext.tsx** (lines 96-119)
   - Changed from `url.searchParams` to parsing `url.hash`
   - Added URLSearchParams parsing of hash fragment
   - Added debug logging

2. **auth-callback.html** (lines 87-130)
   - Changed from query parameters to hash fragment parsing
   - Updated redirect URL to use hash fragment
   - Added better error messages and logging

3. **coachpack-auth-callback.html** (lines 87-130)
   - Same changes as auth-callback.html

## 🚀 Post-Deployment Verification

After completing all manual steps:

1. **Check OAuth consent screen**:
   - Should show "Continue to No White Space"
   
2. **Check callback page**:
   - Open browser DevTools console
   - Should see: "Access Token: Present"
   - Should see: "Refresh Token: Present"
   
3. **Check app**:
   - Should automatically open after callback
   - User should be logged in
   - Check session with: `console.log('Session:', session)`

## 📊 Success Criteria

- ✅ OAuth consent shows "Continue to No White Space" (not "Supabase")
- ✅ Callback page receives and parses tokens correctly
- ✅ App opens automatically after authentication
- ✅ User session is established in the app
- ✅ No "No Authentication Data" errors
- ✅ No browser/app redirect issues

## 🐛 Troubleshooting

### Issue: Still shows "Continue to Supabase"
**Solution**: Complete manual Step 2 (Google Cloud Console)

### Issue: "No Authentication Data" error
**Solutions**:
- Verify callback page is deployed correctly
- Check browser console for hash content
- Verify URL is `https://coachpack.org/auth/callback#access_token=...` (with `#`)

### Issue: App doesn't open after callback
**Solutions**:
- Verify `simplediaryapp://` scheme is registered in app.json
- Check that callback page is redirecting with hash fragment
- Test deep link manually: `simplediaryapp://auth/callback#access_token=test`

### Issue: Session not established
**Solutions**:
- Check app console logs for token extraction
- Verify tokens are being passed to `supabase.auth.setSession()`
- Check that Supabase client is initialized correctly

## 📝 Configuration Reference

```
Supabase URL: https://bqxypskdebsesfwpqrfv.supabase.co
OAuth Redirect: https://coachpack.org/auth/callback
App Scheme: simplediaryapp://
Bundle ID: com.simplediaryapp.diary
Google Project: weighty-legend-466712-c5
Web Client ID: 579431569676-53ejmft2l1hhe8g8mit1aqqtfe1hm9fl.apps.googleusercontent.com
Android Client ID: 579431569676-jbu1k9dev5cj8lk6b5djgc7jsa20ph6e.apps.googleusercontent.com
```

---

**Ready to test?** Complete the manual steps above, then run `npx expo start` to test the OAuth flow!

