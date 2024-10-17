import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage';
import AboutUnion from './pages/AboutUnion';
import ContactInfoPage from './pages/ContactInfoPage';
import MessagesPage from './pages/MessagesPage';

import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

function App() {
  
const routesConfig = [
  {
    path: "/login",
    element: <LoginPage />
  },
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
        path: "/Messages",
        element: <MessagesPage />,
      },
    ],

  }
]
const router = createBrowserRouter(routesConfig);
return (
  <>
  <RouterProvider router={router} />
  <NotificationContainer />
  </>
)
}

export default App
