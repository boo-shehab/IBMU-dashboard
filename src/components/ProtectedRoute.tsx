import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

const ProtectedRoute = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
