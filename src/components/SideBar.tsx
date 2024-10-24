import { NavLink } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import logo from "../assets/logo.jpg";
import useMediaQuery from "../hooks/useMediaQuery"; 

const Sidebar = ({ isOpen, toggleSidebar }: any) => {
  const isLg = useMediaQuery("(mx-width: 1024px)");
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out z-50 lg:z-auto lg:static lg:translate-x-0 lg:w-64 lg:h-full`}
      >
        <div className="flex items-center justify-between py-8 px-4 bg-gray-900">
          <img src={logo} className="w-20 h-20 rounded-xl" alt="logo" />
          <button
            className="text-white text-2xl lg:hidden"
            onClick={toggleSidebar}
          >
            <IoClose />
          </button>
        </div>

        <nav className="flex flex-col mt-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white ${
                isActive ? "bg-gray-700 text-white" : ""
              }`
            }
            onClick={isLg ? toggleSidebar : undefined}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/about-union"
            className={({ isActive }) =>
              `px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white ${
                isActive ? "bg-gray-700 text-white" : ""
              }`
            }
            onClick={isLg ? toggleSidebar : undefined}
          >
            About Union
          </NavLink>
          <NavLink
            to="/contact-info"
            className={({ isActive }) =>
              `px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white ${
                isActive ? "bg-gray-700 text-white" : ""
              }`
            }
            onClick={isLg ? toggleSidebar : undefined}
          >
            Contact Info
          </NavLink>
          <NavLink
            to="/Messages"
            className={({ isActive }) =>
              `px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white ${
                isActive ? "bg-gray-700 text-white" : ""
              }`
            }
            onClick={isLg ? toggleSidebar : undefined}
          >
            Messages
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) =>
              `px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white ${
                isActive ? "bg-gray-700 text-white" : ""
              }`
            }
            onClick={isLg ? toggleSidebar : undefined}
          >
            Events
          </NavLink>
          <NavLink
            to="/newsAndResearch"
            className={({ isActive }) =>
              `px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white ${
                isActive ? "bg-gray-700 text-white" : ""
              }`
            }
            onClick={isLg ? toggleSidebar : undefined}
          >
            News & Research
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
