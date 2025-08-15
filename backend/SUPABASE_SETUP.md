# Supabase Setup Guide

This guide will help you set up Supabase for your Google Drive clone backend.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `google-drive-clone`
   - Database Password: Choose a strong password
   - Region: Choose closest to you
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## 3. Create Database Tables

Run the following SQL in your Supabase SQL Editor:

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    hashed_password VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own data
CREATE POLICY "Users can manage their own data" ON users
    FOR ALL USING (auth.uid()::text = id::text);
```

### Files Table
```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    mime_type VARCHAR NOT NULL,
    size INTEGER NOT NULL,
    storage_path VARCHAR NOT NULL,
    folder_id UUID REFERENCES folders(id),
    owner_id UUID NOT NULL REFERENCES users(id),
    is_starred BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own files
CREATE POLICY "Users can manage their own files" ON files
    FOR ALL USING (auth.uid()::text = owner_id::text);
```

### Folders Table
```sql
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    parent_id UUID REFERENCES folders(id),
    owner_id UUID NOT NULL REFERENCES users(id),
    is_starred BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own folders
CREATE POLICY "Users can manage their own folders" ON folders
    FOR ALL USING (auth.uid()::text = owner_id::text);
```

## 4. Update Environment Variables

Create a `.env` file in your backend directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here

# JWT Configuration
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 5. Test the Setup

1. Install dependencies: `pip install -r requirements.txt`
2. Test imports: `python test_imports.py`
3. Start the server: `python start.py`

## 6. Verify API Endpoints

Once running, test these endpoints:

- **Health Check**: `GET http://localhost:8000/health`
- **API Docs**: `http://localhost:8000/docs`

## 7. Test Authentication

1. **Signup**: `POST http://localhost:8000/auth/signup`
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Login**: `POST http://localhost:8000/auth/login`
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

## Troubleshooting

### Common Issues

1. **Connection Error**: Check your SUPABASE_URL and SUPABASE_KEY
2. **Table Not Found**: Make sure you've run the SQL commands
3. **Permission Denied**: Check Row Level Security policies

### Useful Supabase Commands

- **View Tables**: Go to **Table Editor** in your dashboard
- **View Logs**: Go to **Logs** in your dashboard
- **Test Queries**: Use the **SQL Editor**

## Next Steps

After setup, you can:
1. Upload files using the `/files/upload` endpoint
2. Create folders using the `/folders/create` endpoint
3. List files and folders using the respective endpoints

Your Google Drive clone is now powered by Supabase! 🎉
