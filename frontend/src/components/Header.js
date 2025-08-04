import React from 'react';
import { useAuth } from '../services/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">Task Manager</h1>
        <div className="header-user">
          <span className="welcome-text">Welcome, {user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
