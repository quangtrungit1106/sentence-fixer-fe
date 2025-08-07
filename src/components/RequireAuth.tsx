import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactElement;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  const isAuthenticated = token && token !== 'undefined' && token !== 'null';

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;
