// Super simple Google OAuth function - no external dependencies
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': 'https://coachpack.org',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': 'https://coachpack.org',
    'Content-Type': 'application/json',
  };

  try {
    const { code, redirectUri, state } = JSON.parse(event.body);

    // Validate state parameter
    if (state !== 'simplediaryapp') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid state parameter' }),
      };
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri || 'https://coachpack.org/auth/callback',
      }),
    });

    if (!tokenResponse.ok) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Failed to exchange code for tokens' }),
      };
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token } = tokens;

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

    // Create Supabase session using direct API call (no SDK needed)
    const supabaseResponse = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        email: userInfo.email,
        password: Math.random().toString(36), // Temporary password
        data: {
          full_name: userInfo.name,
          avatar_url: userInfo.picture,
        }
      }),
    });

    // Return user info and tokens
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        user: {
          email: userInfo.email,
          full_name: userInfo.name,
          avatar_url: userInfo.picture,
        },
        session: {
          access_token: access_token,
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
