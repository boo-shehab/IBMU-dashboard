import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage';
import AboutUnion from './pages/AboutUnion';

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
        element: <HomePage />,
      },
    ],

  }
]
const router = createBrowserRouter(routesConfig);
return <RouterProvider router={router} />
}

export default App
