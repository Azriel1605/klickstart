import React from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { Sprout, Store, User } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email: string) => {
    await login(email);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Left Side: Brand */}
        <div className="bg-emerald-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="z-10">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Sprout size={32} />
            </div>
            <h1 className="text-4xl font-bold mb-4">CropChain</h1>
            <p className="text-emerald-100 text-lg leading-relaxed">
              Platform Agritech terintegrasi dengan sistem harga manual dan pembayaran Escrow yang aman.
            </p>
          </div>
          
          <div className="z-10 mt-12">
            <p className="text-xs uppercase tracking-widest opacity-70">Production Grade Prototype</p>
          </div>

          {/* Decorative circles */}
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-emerald-500 rounded-full opacity-50"></div>
          <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-emerald-400 rounded-full opacity-30"></div>
        </div>

        {/* Right Side: Role Selection */}
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Select a role to simulate the experience.</p>

          <div className="space-y-4">
            <button
              onClick={() => handleLogin('buyer@cropchain.com')}
              className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                <User size={24} />
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-bold text-gray-800">Login as Buyer</h3>
                <p className="text-sm text-gray-500">UMKM, Restaurant, Consumer</p>
              </div>
            </button>

            <button
              onClick={() => handleLogin('agent@cropchain.com')}
              className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="bg-orange-100 p-3 rounded-lg text-orange-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                <Store size={24} />
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-bold text-gray-800">Login as Agent</h3>
                <p className="text-sm text-gray-500">Distributor, Collector, Seller</p>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              By accessing CropChain, you agree to our Terms of Manual Pricing Authority.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;