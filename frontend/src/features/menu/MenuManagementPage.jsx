import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw, LayoutGrid, List, Filter, Search, Edit2, Trash2, Tag, Layers, CheckCircle2, Star } from 'lucide-react';
import useDataStore from '../../store/dataStore';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';
import MenuItemFormModal from './MenuItemFormModal';

const MENU_CATEGORIES = ['STARTERS', 'MAINS', 'DRINKS', 'DESSERTS'];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

export default function MenuManagementPage() {
  const { menuItems, menuLoading, fetchMenuItems, updateMenuItem, deleteMenuItem } = useDataStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // View states
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  // Filter states
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleToggleAvailable = async (item) => {
    const newStatus = !item.available;
    const loadingToast = toast.loading(`${newStatus ? 'Marking available' : 'Marking out of stock'}...`);
    const result = await updateMenuItem(item.id, { ...item, available: newStatus });
    if (result.success) {
      toast.success(`Item marked as ${newStatus ? 'Available' : 'Out of Stock'}`, { id: loadingToast });
    } else {
      toast.error(result.message, { id: loadingToast });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      const loadingToast = toast.loading('Deleting item...');
      const result = await deleteMenuItem(id);
      if (result.success) {
        toast.success(`Item deleted.`, { id: loadingToast });
      } else {
        toast.error(result.message, { id: loadingToast });
      }
    }
  };

  const clearFilters = () => {
      setSearchFilter('');
      setCategoryFilter('ALL');
  };

  // Derived data
  const filteredItems = menuItems.filter(item => {
      if(searchFilter && !item.name?.toLowerCase().includes(searchFilter.toLowerCase())) return false;
      if(categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
      return true;
  });

  const availableCount = menuItems.filter(t => t.available).length;
  const outOfStockCount = menuItems.length - availableCount;
  const specialCount = menuItems.filter(t => t.special).length;

  if (menuLoading) {
    return <LoadingSpinner size="lg" text="Loading menu items..." />;
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto animate-fade-in">
        
      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Menu Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your restaurant's dishes, prices, and availability
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden p-1">
                 <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                     <LayoutGrid className="w-4 h-4" />
                 </button>
                 <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                     <List className="w-4 h-4" />
                 </button>
             </div>
             
            <Button variant="secondary" onClick={() => fetchMenuItems()} size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Button onClick={() => { setEditingItem(null); setCreateModalOpen(true); }} size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Menu Item
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <Card className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
                {/* Search */}
                <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Search Item</label>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Burger, Pasta..." 
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                        />
                    </div>
                </div>

                 {/* Filters */}
                 <div className="w-full md:w-48">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1"><Layers className="w-3 h-3"/> Category</label>
                    <select 
                       value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                       className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none"
                    >
                        <option value="ALL">All Categories</option>
                        {MENU_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                 </div>
                 
                 <Button variant="ghost" onClick={clearFilters} size="sm" className="mb-0.5 text-gray-500">
                     Reset
                 </Button>
            </div>
        </Card>

        {/* View Content */}
        {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-surface-dark rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <LayoutGrid className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-900 dark:text-white font-medium mb-2">No menu items found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">Try adjusting your filters or create a new menu item to get started.</p>
              <Button onClick={() => { setEditingItem(null); setCreateModalOpen(true); }}>Add New Item</Button>
            </div>
        ) : viewMode === 'grid' ? (
            /* Items Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => (
                  <Card key={item.id} padding="p-0" className={`overflow-hidden group transition-all duration-300 border ${item.available ? 'border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1' : 'border-red-100 dark:border-red-900/50 opacity-80'}`}>
                    {/* Image header */}
                    <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img src={item.imageUrl || FALLBACK_IMAGE} alt={item.name} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!item.available ? 'grayscale' : ''}`} loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                         <span className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                             {item.category}
                         </span>
                         {item.special && (
                           <span className="px-2.5 py-1 rounded-md bg-brand-orange/90 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                               <Star className="w-3 h-3" /> Special
                           </span>
                         )}
                      </div>
                      
                      {/* Bottom Info */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <div>
                              <p className="text-xl font-bold text-white leading-tight mb-1">{item.name}</p>
                              <p className="text-lg font-black text-brand-orange">${parseFloat(item.price).toFixed(2)}</p>
                          </div>
                      </div>
                    </div>
    
                    <div className="p-4 bg-white dark:bg-surface-dark">
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
                        {item.description || "No description provided."}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                          <button
                            onClick={() => handleToggleAvailable(item)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${item.available ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}
                          >
                            <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            {item.available ? 'Available' : 'Out of Stock'}
                          </button>

                          <div className="flex gap-1">
                             <button onClick={() => { setEditingItem(item); setCreateModalOpen(true); }} className="p-2 text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                             <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
        ) : (
            /* List View */
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Item</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Category</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Price</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-4 font-medium text-right uppercase tracking-wider text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-900 dark:text-gray-100">
                            {filteredItems.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                          <img src={item.imageUrl || FALLBACK_IMAGE} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                          <div>
                                              <p className="font-bold">{item.name}</p>
                                              {item.special && <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wide">Special</span>}
                                          </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-gray-500 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md font-medium">{item.category}</span></td>
                                    <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-200">${item.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                      {item.available ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Available
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Out of Stock
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => { setEditingItem(item); setCreateModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-brand-orange transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>

      {/* Right Sidebar - Widgets */}
      <div className="w-full xl:w-80 flex-shrink-0 space-y-6">
          <Card className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800">
               <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-brand-orange" /> Menu Overview
              </h3>
              
              <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                     <span className="text-sm text-gray-500">Total Items</span>
                     <span className="font-bold text-gray-900 dark:text-white">{menuItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                     <span className="text-sm text-gray-500">Available</span>
                     <span className="font-bold text-green-600">{availableCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                     <span className="text-sm text-gray-500">Out of Stock</span>
                     <span className="font-bold text-red-500">{outOfStockCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                     <span className="text-sm text-gray-500 flex items-center gap-1"><Star className="w-3.5 h-3.5 text-brand-orange"/> Specials</span>
                     <span className="font-bold text-brand-orange">{specialCount}</span>
                  </div>
              </div>
          </Card>
      </div>

      <MenuItemFormModal
        isOpen={createModalOpen}
        onClose={() => { setCreateModalOpen(false); setEditingItem(null); }}
        editingItem={editingItem}
      />
    </div>
  );
}
