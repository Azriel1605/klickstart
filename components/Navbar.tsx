import React from 'react';
import { User } from '../types';
import { Bell, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../App';

interface NavbarProps {
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const { logout } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-emerald-800 tracking-tight">
          CropChain <span className="text-xs text-gray-400 font-normal border border-gray-200 rounded px-1.5 py-0.5 ml-2">BETA v1.0</span>
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end mr-2">
          <span className="text-sm font-medium text-gray-900">{user.name}</span>
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {user.role}
          </span>
        </div>
        
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        <button 
          onClick={logout}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Navbar;