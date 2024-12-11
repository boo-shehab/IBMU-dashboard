import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { OrbitProgress } from "react-loading-indicators";

const ProtectedRoute = () => {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <OrbitProgress variant="dotted" color="#32cd32" size="large" text="" textColor="#520d0d" />
      </div>
    );
  }

  if (error) {
    return <div>Error checking authentication status</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
