# Admission System

React + Supabase admission management system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Create the `applications` table in Supabase:
```sql
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  date_of_birth TEXT,
  gender TEXT,
  education TEXT,
  program TEXT,
  user_email TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_profiles table to store registration data
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  address TEXT NOT NULL,
  strand_course TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

4. Enable Email Authentication in Supabase:
   - Go to Authentication > Providers
   - Enable Email provider
   - Create an admin user in Authentication > Users

5. Set up Row Level Security (optional but recommended):
```sql
-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (applicants)
CREATE POLICY "Anyone can submit applications"
ON applications FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users can view (admins)
CREATE POLICY "Authenticated users can view applications"
ON applications FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users can update (admins)
CREATE POLICY "Authenticated users can update applications"
ON applications FOR UPDATE
TO authenticated
USING (true);
```

6. Run the dev server:
```bash
npm run dev
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAIL`
6. Click "Deploy"

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Add environment variables in Site settings → Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAIL`
6. Click "Deploy site"

## Features

### Student Portal
- User registration and login
- Submit admission applications
- Track application status
- View application history
- Personal dashboard

### Admin Portal
- Admin authentication with Supabase Auth
- View all applications with filtering (all/pending/approved/rejected)
- Approve or reject applications
- Real-time status updates
- Secure admin access
