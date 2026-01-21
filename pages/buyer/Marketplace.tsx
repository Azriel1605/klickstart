import React, { useEffect, useState } from 'react';
import { CropChainService } from '../../services/mockDatabase';
import { Product, ProductCategory } from '../../types';
import { Search, MapPin, Filter, ShoppingCart, Loader2 } from 'lucide-react';

const BuyerMarketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Processing order state
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await CropChainService.getProducts({
        search: searchTerm,
        category: selectedCategory || undefined
    });
    setProducts(data);
    setLoading(false);
  };

  const handleBuy = async (product: Product) => {
    setProcessingId(product.id);
    await CropChainService.createOrder('u2', product.id, 10); // Buy 10 units mock
    alert(`Order placed for ${product.name}. Funds held in Escrow.`);
    setProcessingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products or location..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <select 
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                <option value="">All Categories</option>
                {Object.values(ProductCategory).map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600">
                <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-600" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative h-48 bg-gray-200">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-semibold text-emerald-700 shadow-sm">
                  {product.category}
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">{product.name}</h3>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin size={14} className="mr-1" />
                  {product.location}
                </div>

                <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Current Price</p>
                    <p className="text-xl font-bold text-emerald-600">
                      Rp {product.price.toLocaleString('id-ID')}
                      <span className="text-sm text-gray-400 font-normal"> / {product.unit}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => handleBuy(product)}
                    disabled={!!processingId}
                    className="bg-gray-900 hover:bg-emerald-600 text-white p-3 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {processingId === product.id ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
                  </button>
                </div>
              </div>
              <div className="bg-emerald-50 px-5 py-2 text-xs text-emerald-700 font-medium flex justify-between items-center">
                 <span>Agent: {product.agentName}</span>
                 <span>Stock: {product.stock} {product.unit}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerMarketplace;