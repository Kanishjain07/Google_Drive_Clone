# Google Drive Clone

A full-stack Google Drive clone built with React TypeScript frontend and FastAPI Python backend.

## 🚀 Features

- **User Authentication**: Secure JWT-based login/signup system
- **File Management**: Upload, download, delete, and organize files
- **Folder Organization**: Create, manage, and organize folders hierarchically
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Real-time Updates**: Live file and folder updates
- **Security**: Password hashing, JWT tokens, and user isolation
- **Database**: PostgreSQL with SQLAlchemy ORM
- **API Documentation**: Automatic OpenAPI/Swagger documentation

## 🏗️ Architecture

```
├── backend/                 # FastAPI Python backend
│   ├── auth.py             # Authentication endpoints
│   ├── files.py             # File management endpoints
│   ├── folders.py           # Folder management endpoints
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database configuration
│   ├── auth_utils.py        # JWT and password utilities
│   ├── config.py            # Configuration settings
│   └── main.py              # Main FastAPI application
├── drive-clone/             # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript type definitions
│   └── package.json         # Frontend dependencies
└── README.md                # This file
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Supabase** - Open-source Firebase alternative with PostgreSQL
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Pydantic** - Data validation using Python type annotations

### Frontend
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- pip (Python package manager)
- npm or yarn (Node.js package manager)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd google-drive-clone
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up Supabase (see SUPABASE_SETUP.md for detailed instructions)
# 1. Create a Supabase project at supabase.com
# 2. Create the database tables
# 3. Get your project URL and anon key

# Create .env file with your Supabase credentials
# SUPABASE_URL=https://your-project-id.supabase.co
# SUPABASE_KEY=your-anon-key-here
# SECRET_KEY=your-secret-key-here

# Start the backend server
python start.py
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd drive-clone

# Install Node.js dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3000`

### 4. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Follow the detailed setup guide in `backend/SUPABASE_SETUP.md`
3. Create the required database tables
4. Update your `.env` file with Supabase credentials

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

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

### Frontend Environment Variables

Create a `.env` file in the drive-clone directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🔐 Authentication

The application uses JWT tokens for authentication:

1. **Signup**: `POST /auth/signup`
2. **Login**: `POST /auth/login`
3. **Protected Routes**: Include `Authorization: Bearer <token>` header

## 📁 File Operations

- **Upload**: `POST /files/upload`
- **List**: `GET /files/list`
- **Download**: `GET /files/{file_id}`
- **Delete**: `DELETE /files/{file_id}`
- **Star**: `PUT /files/{file_id}/star`

## 📂 Folder Operations

- **Create**: `POST /folders/create`
- **List**: `GET /folders/list`
- **Update**: `PUT /folders/{folder_id}`
- **Delete**: `DELETE /folders/{folder_id}`
- **Star**: `PUT /folders/{folder_id}/star`

## 🧪 Development

### Backend Development

```bash
cd backend

# Run with auto-reload
python start.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd drive-clone

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database `drive_clone` exists

2. **CORS Errors**
   - Check `FRONTEND_URL` in backend `.env`
   - Ensure frontend is running on the correct port

3. **Import Errors**
   - Verify all dependencies are installed
   - Check Python/Node.js versions

### Logs

- Backend logs are displayed in the terminal
- Frontend errors appear in browser console
- Check browser Network tab for API requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- FastAPI for the excellent backend framework
- React team for the amazing frontend library
- Tailwind CSS for the utility-first CSS framework
- All contributors and supporters

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Open an issue on GitHub
4. Check the logs for error details

---

**Happy coding! 🎉**
