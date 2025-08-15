# Google Drive Clone Backend

A FastAPI-based backend for a Google Drive clone application with user authentication, file management, and folder organization.

## Features

- **User Authentication**: JWT-based authentication with signup/login
- **File Management**: Upload, download, delete, and organize files
- **Folder Organization**: Create, manage, and organize folders hierarchically
- **Security**: Password hashing, JWT tokens, and user isolation
- **Database**: PostgreSQL with SQLAlchemy ORM
- **API Documentation**: Automatic OpenAPI/Swagger documentation

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Database Setup

1. Install PostgreSQL
2. Create a database named `drive_clone`
3. Update the `DATABASE_URL` in your `.env` file:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/drive_clone
```

### 3. Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/drive_clone

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

### 4. Run the Application

```bash
# Development mode
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Files
- `POST /files/upload` - Upload a file
- `GET /files/list` - List user's files
- `GET /files/{file_id}` - Get file details
- `DELETE /files/{file_id}` - Delete a file
- `PUT /files/{file_id}/star` - Toggle file star

### Folders
- `POST /folders/create` - Create a folder
- `GET /folders/list` - List user's folders
- `GET /folders/{folder_id}` - Get folder details
- `PUT /folders/{folder_id}` - Update folder
- `DELETE /folders/{folder_id}` - Delete a folder
- `PUT /folders/{folder_id}/star` - Toggle folder star

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Database Schema

The application uses three main models:
- **User**: User accounts with authentication
- **File**: File metadata and storage information
- **Folder**: Folder hierarchy and organization

## Security Features

- Password hashing using bcrypt
- JWT token authentication
- User isolation (users can only access their own files/folders)
- Input validation using Pydantic schemas
- CORS configuration for frontend integration
