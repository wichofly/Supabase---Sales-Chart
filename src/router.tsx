import { createBrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './routes/Dashboard';
import Signin from './views/SigninView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Signin />,
  },
  {
    path: '/dashboard',
    element: (
      <div className="min-h-screen bg-gray-100 pt-16">
        <Header />
        <Dashboard />
      </div>
    ),
  },
]);
