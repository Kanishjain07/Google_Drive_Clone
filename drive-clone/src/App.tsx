import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Trash from './pages/Trash';
import Recent from './pages/Recent';
import Starred from './pages/Starred';
import Shared from './pages/Shared';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/recent" element={isAuthenticated ? <Recent /> : <Navigate to="/login" />} />
        <Route path="/starred" element={isAuthenticated ? <Starred /> : <Navigate to="/login" />} />
        <Route path="/shared" element={isAuthenticated ? <Shared /> : <Navigate to="/login" />} />
        <Route
          path="/trash"
          element={isAuthenticated ? <Trash /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
