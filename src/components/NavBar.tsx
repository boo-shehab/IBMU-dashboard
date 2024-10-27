import { getAuth, signOut } from 'firebase/auth';
import { useState } from 'react';
import Button from './Button';
import { FaBars } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }: any) => {
  const [loading, setLoading] = useState(false);
  const handleLogout = () => {
    setLoading(true)
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log("User logged out");
    }).catch((error) => {
      console.error("Error logging out: ", error);
    }).finally(() => {
      setLoading(false)
    });
  };
  
  return (
    <nav className="bg-gray-900 text-white h-16 flex items-center justify-between px-4 shadow-md z-40">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none lg:hidden"
        >
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-bold">IBMU Dashboard</h1>
      </div>
      <div>
        <Button isLoading={loading} className='bg-gray-900 hover:bg-gray-900' onClick={() => handleLogout()}>logout</Button>
      </div>
    </nav>
  );
};

export default Navbar;
