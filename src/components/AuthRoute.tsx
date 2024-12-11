import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

const AuthRoute = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default AuthRoute;
