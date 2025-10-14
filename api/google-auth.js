// Serverless function for Google OAuth token exchange
// Deploy this to Netlify Functions

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': 'https://coachpack.org',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Add CORS headers for security
  const headers = {
    'Access-Control-Allow-Origin': 'https://coachpack.org',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Rate limiting (simple in-memory cache)
  const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  const rateLimitKey = `rate_limit_${clientIP}`;
  
  // Check rate limit (max 10 requests per minute)
  const rateLimit = global.rateLimitCache || (global.rateLimitCache = new Map());
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;
  
  if (rateLimit.has(rateLimitKey)) {
    const { count, resetTime } = rateLimit.get(rateLimitKey);
    if (now < resetTime) {
      if (count >= maxRequests) {
        return {
          statusCode: 429,
          headers,
          body: JSON.stringify({ error: 'Too many requests' }),
        };
      }
      rateLimit.set(rateLimitKey, { count: count + 1, resetTime });
    } else {
      rateLimit.set(rateLimitKey, { count: 1, resetTime: now + windowMs });
    }
  } else {
    rateLimit.set(rateLimitKey, { count: 1, resetTime: now + windowMs });
  }

  try {
    const { code, redirectUri, state } = JSON.parse(event.body);

    // Validate required fields
    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Authorization code is required' }),
      };
    }

    // Validate state parameter for CSRF protection
    if (state !== 'simplediaryapp') {
      console.error('Invalid state parameter:', state);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid state parameter' }),
      };
    }

    // Validate redirect URI
    const allowedRedirectUris = [
      'https://coachpack.org/auth/callback',
      'https://www.coachpack.org/auth/callback'
    ];
    
    if (!allowedRedirectUris.includes(redirectUri)) {
      console.error('Invalid redirect URI:', redirectUri);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid redirect URI' }),
      };
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri || 'https://coachpack.org/auth/callback',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Google token exchange failed:', errorData);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Failed to exchange code for tokens' }),
      };
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, id_token } = tokens;

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Failed to get user info' }),
      };
    }

    const userInfo = await userResponse.json();

    // Create or update user in Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userInfo.email,
      email_confirm: true,
      user_metadata: {
        full_name: userInfo.name,
        avatar_url: userInfo.picture,
        provider: 'google',
        provider_id: userInfo.id,
      },
    });

    if (authError && authError.message !== 'User already registered') {
      console.error('Supabase user creation error:', authError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create user' }),
      };
    }

    // If user already exists, get their data
    let userData = authData;
    if (authError && authError.message === 'User already registered') {
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(userInfo.email);
      userData = existingUser;
    }

    // Create a session token for the mobile app
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userInfo.email,
    });

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create session' }),
      };
    }

    // Return tokens and user data (without sensitive info)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        user: {
          id: userData.user.id,
          email: userData.user.email,
          full_name: userData.user.user_metadata.full_name,
          avatar_url: userData.user.user_metadata.avatar_url,
        },
        session: {
          access_token: sessionData.properties.hashed_token,
          refresh_token: refresh_token,
        },
      }),
    };

  } catch (error) {
    console.error('OAuth handler error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};