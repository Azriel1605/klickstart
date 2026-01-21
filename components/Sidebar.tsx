import React from 'react';
import { User, UserRole } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, TrendingUp, Settings, Sprout } from 'lucide-react';

interface SidebarProps {
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const LinkItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
        isActive(to) 
          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
          : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="bg-emerald-100 p-2 rounded-lg">
            <Sprout className="text-emerald-600" size={24} />
        </div>
        <span className="text-xl font-bold text-gray-800">CropChain</span>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          
          {user.role === UserRole.BUYER && (
            <>
              <LinkItem to="/" icon={ShoppingBag} label="Marketplace" />
              <LinkItem to="/orders" icon={Package} label="My Orders" />
            </>
          )}

          {user.role === UserRole.AGENT && (
            <>
              <LinkItem to="/agent/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <LinkItem to="/agent/products" icon={Package} label="Inventory & Price" />
              <LinkItem to="/agent/orders" icon={ShoppingBag} label="Incoming Orders" />
              <LinkItem to="/agent/finance" icon={TrendingUp} label="Escrow & Finance" />
            </>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
         <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
            <p className="text-xs text-stone-500 mb-1">Escrow Balance</p>
            <p className="text-lg font-bold text-emerald-700">
              Rp {user.balance.toLocaleString('id-ID')}
            </p>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;