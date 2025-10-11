# Environment Setup

## Supabase Configuration

To enable authentication features, you need to set up Supabase environment variables.

### Steps:

1. **Create a `.env` file** in the root directory of your project (same level as `package.json`)

2. **Add the following variables** to your `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. **Get your Supabase credentials**:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project or create a new one
   - Go to Settings > API
   - Copy the "Project URL" and paste it as `EXPO_PUBLIC_SUPABASE_URL`
   - Copy the "anon public" key and paste it as `EXPO_PUBLIC_SUPABASE_ANON_KEY`

4. **Restart your development server** after adding the environment variables

### Note:

The app will now run without these variables (using placeholder values), but authentication features won't work until you configure real Supabase credentials.

### Google OAuth Setup:

If you want to enable Google Sign-In:
1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your OAuth credentials from Google Cloud Console
4. Configure the authorized redirect URIs

