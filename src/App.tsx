import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AboutUnion from './pages/AboutUnion';
import ContactInfoPage from './pages/ContactInfoPage';
import MessagesPage from './pages/MessagesPage';
import EventsPage from './pages/EventsPage';
import NewsAndResearch from './pages/NewsAndResearch';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ProtectedRoute from './components/ProtectedRoute';  // Import ProtectedRoute
import AuthRoute from './components/AuthRoute';  // Import AuthRoute

function App() {

  const routesConfig = [
    {
      path: "/login",
      element: <AuthRoute />,  // Protect login route
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        }
      ]
    },
    {
      element: <ProtectedRoute />,  // Protect other routes
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              path: "/",
              element: <HomePage />,
            },
            {
              path: "/about-union",
              element: <AboutUnion />,
            },
            {
              path: "/contact-info",
              element: <ContactInfoPage />,
            },
            {
              path: "/messages",
              element: <MessagesPage />,
            },
            {
              path: "/events",
              element: <EventsPage />
            },
            {
              path: "/newsAndResearch",
              element: <NewsAndResearch />
            }
          ]
        }
      ]
    }
  ];

  const router = createBrowserRouter(routesConfig);

  return (
    <>
      <RouterProvider router={router} />
      <NotificationContainer />
    </>
  );
}

export default App;
