import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

    const signInWithGoogle = async () => {
    try {
      console.log('🚀 Starting DIRECT Google OAuth (custom branding)...');

      const googleClientId = '579431569676-53ejmft2l1hhe8g8mit1aqqtfe1hm9fl.apps.googleusercontent.com';
      const redirectUri = 'simplediaryapp://auth/callback';

      // Create direct Google OAuth URL
      const authUrl = new URL('https://accounts.google.com/oauth/authorize');
      authUrl.searchParams.set('client_id', googleClientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'openid email profile');
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      authUrl.searchParams.set('state', 'simplediaryapp');

      console.log('🔗 Opening DIRECT Google OAuth URL:', authUrl.toString());

      // Open the OAuth URL in WebBrowser
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl.toString(),
        redirectUri
      );

      console.log('📱 WebBrowser result:', result);

      if (result.type === 'success' && result.url) {
        console.log('✅ OAuth completed successfully');
        console.log('�� Callback URL:', result.url);
        
        // Parse the callback URL for the authorization code
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        
        if (state !== 'simplediaryapp') {
          console.error('❌ Invalid state parameter');
          return { data: null, error: new Error('Invalid state parameter') };
        }
        
        if (code) {
          console.log('✅ Authorization code received');
          return { data: { session: null }, error: null };
        }
      } else if (result.type === 'dismiss') {
        console.log('❌ User cancelled OAuth');
        return { data: null, error: new Error('Authentication was cancelled') };
      }
      
      return { data: null, error: new Error('Authentication failed') };
    } catch (error) {
      console.error('❌ Google Sign-In Error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
