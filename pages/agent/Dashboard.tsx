import React from 'react';
import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-4 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
    </div>
);

const AgentDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Agent Dashboard</h1>
            <p className="text-gray-500">Overview of your inventory and sales performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value="Rp 45.2M" icon={DollarSign} color="bg-emerald-600" />
            <StatCard title="Active Listings" value="12" icon={Package} color="bg-blue-500" />
            <StatCard title="Orders Pending" value="5" icon={Users} color="bg-orange-500" />
            <StatCard title="Avg. Price Change" value="+2.4%" icon={TrendingUp} color="bg-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col items-center justify-center text-gray-400">
                <TrendingUp size={48} className="mb-4 opacity-20" />
                <p>Sales Chart Visualization Placeholder (Recharts)</p>
                <p className="text-xs">Connecting to PostgreSQL Analytics...</p>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">
                                ORD
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-800">New Order from Restaurant A</h4>
                                <p className="text-xs text-gray-500">20kg Cabai Rawit Merah</p>
                            </div>
                            <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-1 rounded">Paid (Escrow)</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AgentDashboard;