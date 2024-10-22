import { getAuth, signOut } from 'firebase/auth';
import { FaBars } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }: any) => {

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log("User logged out");
    }).catch((error) => {
      console.error("Error logging out: ", error);
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
        <button onClick={() => handleLogout()}>logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
