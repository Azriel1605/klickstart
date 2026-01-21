import React, { useEffect, useState } from 'react';
import { CropChainService } from '../../services/mockDatabase';
import { Product, PriceLog } from '../../types';
import { Edit2, History, Save, X, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../../App';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AgentProductManager: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const [updateReason, setUpdateReason] = useState('');
  const [priceHistory, setPriceHistory] = useState<PriceLog[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) loadProducts();
  }, [user]);

  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    const data = await CropChainService.getAgentProducts(user.id);
    setProducts(data);
    setLoading(false);
  };

  const openEditModal = async (product: Product) => {
    setEditingProduct(product);
    setNewPrice(product.price.toString());
    setUpdateReason('');
    setHistoryLoading(true);
    
    // Fetch audit trail
    const history = await CropChainService.getPriceHistory(product.id);
    setPriceHistory(history);
    setHistoryLoading(false);
  };

  const handleUpdatePrice = async () => {
    if (!editingProduct || !user) return;
    
    setSaving(true);
    try {
        await CropChainService.updateProductPrice(
            editingProduct.id, 
            user.id, 
            parseInt(newPrice), 
            updateReason || 'Routine adjustment'
        );
        
        // Refresh local data
        await loadProducts();
        setEditingProduct(null); // Close modal
    } catch (error) {
        alert("Failed to update price");
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Inventory & Pricing</h1>
                <p className="text-gray-500">Manage your stock and set market prices manually.</p>
            </div>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                + Add Product
            </button>
       </div>

       {loading ? (
           <div className="text-center py-10"><Loader2 className="animate-spin inline text-emerald-600"/></div>
       ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Current Price</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Last Updated</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={p.imageUrl} className="w-10 h-10 rounded object-cover bg-gray-200" alt=""/>
                                    <span className="font-medium text-gray-800">{p.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{p.stock} {p.unit}</td>
                            <td className="px-6 py-4">
                                <span className="font-bold text-emerald-600">Rp {p.price.toLocaleString('id-ID')}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(p.updatedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                <button 
                                    onClick={() => openEditModal(p)}
                                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 font-medium text-sm border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                                >
                                    <Edit2 size={14} /> Update Price
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
       )}

       {/* Edit Price Modal */}
       {editingProduct && (
           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-bold text-gray-800">Update Price: {editingProduct.name}</h2>
                        <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="p-6 grid gap-8">
                        {/* Input Section */}
                        <div className="bg-stone-50 p-5 rounded-xl border border-stone-200">
                            <div className="flex items-start gap-3 mb-4 text-amber-600 text-sm bg-amber-50 p-3 rounded-lg border border-amber-100">
                                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                <p><strong>Manual Pricing Authority:</strong> You are solely responsible for setting this price. No AI algorithms are used. Changes are logged for audit.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Price (Rp)</label>
                                    <input 
                                        type="number" 
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono font-bold text-lg text-emerald-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Change</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Market fluctuation, Harvest cost..."
                                        value={updateReason}
                                        onChange={(e) => setUpdateReason(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* History Section */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <History size={18} /> Price History Log
                            </h3>
                            {historyLoading ? (
                                <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">Loading history...</div>
                            ) : (
                                <>
                                    <div className="h-48 w-full mb-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={priceHistory.slice().reverse()}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                                                <XAxis dataKey="timestamp" hide />
                                                <YAxis domain={['auto', 'auto']} fontSize={12} />
                                                <Tooltip 
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                                />
                                                <Line type="stepAfter" dataKey="newPrice" stroke="#059669" strokeWidth={2} dot={{r: 4, fill: '#059669'}} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="space-y-3">
                                        {priceHistory.map(log => (
                                            <div key={log.id} className="text-sm flex justify-between border-b border-gray-50 pb-2">
                                                <div>
                                                    <span className="text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</span>
                                                    <p className="text-gray-600 italic">"{log.reason}"</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="line-through text-gray-400 text-xs">Rp {log.oldPrice.toLocaleString()}</div>
                                                    <div className="font-bold text-gray-800">Rp {log.newPrice.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {priceHistory.length === 0 && <p className="text-gray-400 text-sm">No price changes recorded yet.</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                        <button 
                            onClick={() => setEditingProduct(null)}
                            className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleUpdatePrice}
                            disabled={saving}
                            className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-70"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Confirm Update
                        </button>
                    </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default AgentProductManager;