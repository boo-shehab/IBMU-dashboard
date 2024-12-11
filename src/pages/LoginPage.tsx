import { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/')
      console.log("User logged in successfully");
    } catch (error: any) {
      setError(error.message);
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md outline-none focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-md outline-none focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
