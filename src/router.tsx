import { createBrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './routes/Dashboard';
import SigninView from './views/SigninView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SigninView />,
  },
  {
    path: '/dashboard',
    element: (
      <div className="min-h-screen pt-16">
        <Header />
        <Dashboard />
      </div>
    ),
  },
]);
