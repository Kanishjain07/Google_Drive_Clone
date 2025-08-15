from supabase import create_client, Client
from config import settings

# Initialize Supabase client
supabase: Client = create_client(settings.supabase_url, settings.supabase_key)

# Check if Supabase is configured
if settings.supabase_url == "your_supabase_url_here" or settings.supabase_key == "your_supabase_anon_key_here":
    print("Warning: Please configure SUPABASE_URL and SUPABASE_KEY in your .env file")
    print("Using mock mode for development")

# Database table names
USERS_TABLE = "users"
FILES_TABLE = "files"
FOLDERS_TABLE = "folders"
