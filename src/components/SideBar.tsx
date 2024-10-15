// Sidebar.jsx
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg"
const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-gray-800 text-white md:static md:translate-x-0 transition-transform duration-200 ease-in-out z-50`}
      >
        <div className="flex items-center justify-center py-8 bg-gray-900">
          <img src={logo} className="w-20 h-20 rounded-xl" alt="logo" />
        </div>
        <nav className="flex flex-col mt-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white ${
                isActive ? "bg-gray-700 text-white" : ""
              }`
            }
            onClick={toggleSidebar} // Close sidebar when link is clicked
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
            onClick={toggleSidebar} // Close sidebar when link is clicked
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
            onClick={toggleSidebar} // Close sidebar when link is clicked
          >
            contact info
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
