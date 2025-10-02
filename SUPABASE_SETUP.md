# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up or sign in
4. Click "New Project"
5. Choose an organization
6. Fill in your project details:
   - Name: `diary-app` (or any name you prefer)
   - Database Password: Create a strong password
   - Region: Choose the closest region to you
7. Click "Create new project"

## 2. Get Your Project Credentials

1. Once your project is created, go to Settings > API
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon/Public Key** (under "Project API keys")

## 3. Update Your App Configuration

1. Open `/lib/supabase.ts`
2. Replace the placeholder values:
   ```typescript
   const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your Project URL
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Anon key
   ```

## 4. Authentication Setup

The authentication is already configured! Supabase automatically creates the necessary auth tables and handles:
- User registration
- Email verification
- Password authentication
- Session management

## 5. Optional: Email Templates

To customize the email verification templates:
1. Go to Authentication > Email Templates in your Supabase dashboard
2. Customize the "Confirm signup" template as needed

## 6. Test Your Setup

1. Run your app: `npm start`
2. Try signing up with a real email address
3. Check your email for the verification link
4. Try signing in after verification

## Database Tables (Optional)

If you want to store diary entries in the database instead of local state, you can create a table:

```sql
-- Create a table for diary entries
create table diary_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  time_slot text not null,
  content text,
  date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table diary_entries enable row level security;

-- Create policy so users can only see their own entries
create policy "Users can view their own diary entries" on diary_entries
  for select using (auth.uid() = user_id);

create policy "Users can insert their own diary entries" on diary_entries
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own diary entries" on diary_entries
  for update using (auth.uid() = user_id);

create policy "Users can delete their own diary entries" on diary_entries
  for delete using (auth.uid() = user_id);
```

Run this SQL in the SQL Editor in your Supabase dashboard if you want to persist diary entries to the database.