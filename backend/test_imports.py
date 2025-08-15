#!/usr/bin/env python3
"""
Test script to verify all imports work correctly
"""

def test_imports():
    try:
        print("Testing imports...")
        
        # Test basic imports
        from config import settings
        print("✓ Config imported successfully")
        
        from supabase_client import supabase
        print("✓ Supabase client imported successfully")
        
        from schemas import UserCreate, UserLogin, UserResponse, Token
        print("✓ Schemas imported successfully")
        
        from auth_utils import verify_password, get_password_hash, create_access_token
        print("✓ Auth utils imported successfully")
        
        from auth import router as auth_router
        print("✓ Auth router imported successfully")
        
        from files import router as files_router
        print("✓ Files router imported successfully")
        
        from folders import router as folders_router
        print("✓ Folders router imported successfully")
        
        print("\n🎉 All imports successful! The backend is ready to run.")
        print("\n⚠️  Remember to:")
        print("   1. Set up your Supabase project")
        print("   2. Create the database tables")
        print("   3. Update your .env file with Supabase credentials")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    test_imports()
