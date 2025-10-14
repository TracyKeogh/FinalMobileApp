# 🚀 Netlify Deployment Guide for Secure Direct Google OAuth

## ✅ What's Been Implemented for Netlify

### **Security Features Added:**
- ✅ **State parameter validation** (CSRF protection)
- ✅ **Rate limiting** (10 requests per minute per IP)
- ✅ **CORS headers** (only allow coachpack.org)
- ✅ **Input validation** (code, redirect URI, state)
- ✅ **Secure token storage** (device Keychain/Keystore)
- ✅ **Development-only logging** (no sensitive data in production)
- ✅ **Server-side token exchange** (client secret never exposed)

## 🔧 Netlify Deployment Steps

### **1. Deploy to Netlify**

**Option A: Drag & Drop (Easiest)**
1. **Zip the project folder** (excluding node_modules)
2. **Go to [netlify.com](https://netlify.com)**
3. **Drag and drop the zip file** onto the deploy area
4. **Wait for deployment** (usually 1-2 minutes)

**Option B: Git Integration (Recommended)**
1. **Push your code to GitHub**
2. **Connect Netlify to your GitHub repository**
3. **Set build settings:**
   - Build command: `npm run build` (or leave empty)
   - Publish directory: `public` (or leave empty for root)
4. **Deploy**

### **2. Set Environment Variables in Netlify**

After deployment, go to **Site Settings → Environment Variables** and add:

```env
SUPABASE_URL=https://bqxypskdebsesfwpqrfv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
GOOGLE_CLIENT_ID=579431569676-53ejmft2l1hhe8g8mit1aqqtfe1hm9fl.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### **3. Update Mobile App with Netlify URL**

After deployment, you'll get a URL like: `https://your-site-name.netlify.app`

Update this line in `contexts/AuthContext.tsx`:
```typescript
// Replace this line:
const tokenResponse = await fetch('https://your-project.vercel.app/api/google-auth', {

// With your actual Netlify URL:
const tokenResponse = await fetch('https://your-site-name.netlify.app/.netlify/functions/google-auth', {
```

### **4. Test the Complete Flow**

1. **Open your mobile app**
2. **Tap "Sign in with Google"**
3. **Should see "Continue to [YOUR APP NAME]"** instead of "Continue to Supabase"
4. **Complete authentication**
5. **User should be logged in successfully**

## 🔐 Security Summary

### **What Makes This Secure:**

1. **Server-Side Token Exchange**
   - Client secret never exposed to mobile app
   - Tokens exchanged server-side only
   - Google tokens immediately converted to Supabase session

2. **Input Validation & CSRF Protection**
   - State parameter validation
   - Redirect URI whitelist
   - Rate limiting (10 req/min per IP)

3. **Secure Token Storage**
   - Tokens stored in device's secure storage (Keychain/Keystore)
   - Encrypted at rest
   - Not accessible to other apps

4. **HTTPS Everywhere**
   - All communications encrypted in transit
   - Google OAuth, Netlify Functions, and Supabase all use HTTPS

5. **Production Security**
   - Development logs removed in production
   - CORS headers restrict access
   - Error messages don't leak sensitive information

## 🎯 Expected Results

- ✅ **OAuth consent screen shows YOUR app name**
- ✅ **No additional monthly costs** (vs $10/month for Supabase Custom Domains)
- ✅ **Shared database** between web and mobile apps
- ✅ **Secure token management**
- ✅ **Professional implementation**

## 🆘 Troubleshooting

### **If you see "Continue to Supabase":**
- Check that you're using the direct OAuth flow (not Supabase OAuth)
- Verify the Google Client ID is correct
- Ensure the Netlify function is deployed and accessible

### **If authentication fails:**
- Check Netlify function logs in the dashboard
- Verify environment variables are set correctly
- Ensure Google Client Secret is correct

### **If tokens aren't stored securely:**
- Check that expo-secure-store is installed
- Verify the app has proper permissions on device

## 📱 Next Steps

1. **Deploy to Netlify** using one of the methods above
2. **Set environment variables** in Netlify dashboard
3. **Update the mobile app** with your Netlify URL
4. **Test the complete flow**
5. **Enjoy your custom-branded OAuth!** 🎉

## 🔗 Netlify Function URL Format

Your function will be available at:
```
https://your-site-name.netlify.app/.netlify/functions/google-auth
```

Make sure to use the full URL including `/.netlify/functions/` in your mobile app!
