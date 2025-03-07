
import { useNavigate, useLocation } from 'react-router-dom';
import { Film, Home, LogOut, Plus, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black flex justify-around items-center">
      <button
        onClick={() => navigate('/add')}
        className={`flex flex-col items-center justify-center w-1/5 h-full transition-colors ${
          isActive('/add') ? 'text-coral' : 'text-white hover:text-lime-green'
        }`}
      >
        <Plus className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => navigate('/search')}
        className={`flex flex-col items-center justify-center w-1/5 h-full transition-colors ${
          isActive('/search') ? 'text-coral' : 'text-white hover:text-lime-green'
        }`}
      >
        <Search className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => navigate('/')}
        className={`flex flex-col items-center justify-center w-1/5 h-full transition-colors ${
          isActive('/') ? 'text-coral' : 'text-white hover:text-lime-green'
        }`}
      >
        <Home className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => navigate('/library')}
        className={`flex flex-col items-center justify-center w-1/5 h-full transition-colors ${
          isActive('/library') ? 'text-coral' : 'text-white hover:text-lime-green'
        }`}
      >
        <Film className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => {
          logout();
          navigate('/login');
        }}
        className="flex flex-col items-center justify-center w-1/5 h-full text-white hover:text-lime-green transition-colors"
      >
        <LogOut className="w-6 h-6" />
      </button>
    </div>
  );
};

export default BottomNavigation;
