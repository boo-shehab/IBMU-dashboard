import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = ({ toggleSidebar }) => {
    return (
      <div className="flex items-center gap-4 bg-gray-900 p-4 text-white">
        <button
          className="text-gray-300 focus:outline-none md:hidden"
          onClick={toggleSidebar}
        >
          <GiHamburgerMenu />
        </button>
        <div className="text-xl font-bold">IBMU Dashboard</div>
        
        {/* Sidebar toggle button */}
      </div>
    );
  };
  
  export default Navbar;
  