import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequireAuth from './components/RequireAuth'; // đúng path của bạn nhé
import MyProfile from './pages/MyProfile';
import History from './pages/History';

const App: React.FC = () => {
  const token = localStorage.getItem('accessToken');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<MyProfile />} /> 
        <Route path="/history" element={<History />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
