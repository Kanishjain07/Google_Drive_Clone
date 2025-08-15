# Google Drive Clone - Frontend

A modern, responsive Google Drive clone built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### ✅ Completed Features

- **Authentication System**
  - Modern login and signup pages with beautiful UI
  - Google OAuth integration ready
  - Form validation and loading states
  - Responsive design for all devices

- **Dashboard Layout**
  - Clean, Google Drive-inspired sidebar navigation
  - Responsive header with search functionality
  - View mode toggle (Grid/List views)
  - Storage usage indicator with progress bar

- **File Explorer**
  - Grid and List view modes with smooth transitions
  - Drag-and-drop file upload with visual feedback
  - File type icons and previews
  - Context menus with file actions
  - File selection and bulk operations
  - Starred files functionality

- **Navigation & UX**
  - Breadcrumb navigation system
  - Sidebar navigation (My Drive, Recent, Starred, Shared, Trash)
  - Mobile-responsive design with collapsible sidebar
  - Smooth animations and transitions

- **Sharing & Permissions**
  - Advanced share modal with email invites
  - Public link sharing with access controls
  - Permission management (Viewer/Editor roles)
  - Copy link functionality with visual feedback

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS v3 with custom configuration
- **Routing**: React Router DOM v7
- **Icons**: Lucide React (consistent icon set)
- **File Handling**: React Dropzone for drag-and-drop
- **Build Tool**: Create React App with TypeScript template

## 📁 Project Structure

```
src/
├── components/
│   ├── Breadcrumbs.tsx      # Navigation breadcrumbs
│   ├── FileExplorer.tsx     # Main file grid/list component
│   ├── Header.tsx           # Top navigation header
│   ├── Layout.tsx           # Main app layout wrapper
│   ├── ShareModal.tsx       # File sharing modal
│   └── Sidebar.tsx          # Left navigation sidebar
├── pages/
│   ├── Dashboard.tsx        # Main dashboard page
│   ├── Login.tsx           # Authentication login page
│   └── Signup.tsx          # User registration page
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── App.tsx                 # Main app with routing
└── index.tsx              # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone and navigate to the project:**
```bash
cd drive-clone
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

The application will open at `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the development server with hot reload
- `npm build` - Creates optimized production build
- `npm test` - Runs the test suite
- `npm run eject` - Ejects from Create React App (irreversible)

## 🎨 Design Features

### Responsive Design
- **Mobile-first approach** with breakpoint optimization
- **Collapsible sidebar** for mobile devices
- **Touch-friendly interactions** and gestures
- **Adaptive grid layouts** that work on all screen sizes

### User Experience
- **Smooth animations** using CSS transitions
- **Loading states** and user feedback
- **Drag-and-drop** file uploads with visual indicators
- **Context menus** for intuitive file management
- **Keyboard navigation** support

### Accessibility
- **ARIA labels** and semantic HTML
- **Keyboard navigation** throughout the app
- **Screen reader** compatibility
- **High contrast** color schemes
- **Focus indicators** for interactive elements

## 🎨 Customization

### Color Palette
```javascript
// Tailwind config primary colors
primary: {
  50: '#eff6ff',   // Light blue backgrounds
  500: '#3b82f6',  // Primary blue
  600: '#2563eb',  // Hover states
  700: '#1d4ed8'   // Active states
}
```

### Typography
- **Font Family**: Inter (loaded from Google Fonts)
- **Responsive text sizes** with proper scaling
- **Font weight hierarchy** for visual organization

## 🔮 Future Enhancements

### Backend Integration
- [ ] REST API integration with Express.js backend
- [ ] JWT authentication implementation
- [ ] Real file upload/download functionality
- [ ] WebSocket integration for real-time updates

### Advanced Features
- [ ] File versioning system
- [ ] Activity logs and audit trails
- [ ] Advanced search with filters
- [ ] Bulk file operations
- [ ] Keyboard shortcuts

### Performance Optimizations
- [ ] Virtual scrolling for large file lists
- [ ] Image optimization and lazy loading
- [ ] Caching strategies
- [ ] Service worker for offline functionality

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

This frontend is designed to work with:
- **Backend API**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Supabase
- **Storage**: AWS S3 or Supabase Storage
- **Authentication**: Supabase Auth or Custom JWT

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

*Ready for production deployment and backend integration*
