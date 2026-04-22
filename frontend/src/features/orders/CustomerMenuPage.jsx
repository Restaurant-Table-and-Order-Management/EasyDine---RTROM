import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Plus, 
  Star, 
  Clock, 
  ChefHat, 
  ChevronRight,
  MessageSquare,
  Info,
  Flame,
  Leaf,
  XCircle
} from 'lucide-react';
import useDataStore from '../../store/dataStore';
import useCartStore from '../../store/cartStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['ALL', 'STARTERS', 'MAINS', 'DRINKS', 'DESSERTS'];

export default function CustomerMenuPage() {
  const { menuItems, menuLoading, fetchMenuItems } = useDataStore();
  const { addItem } = useCartStore();
  
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [instructions, setInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDietary = !vegOnly || item.vegetarian || item.isVegetarian;
    return matchesCategory && matchesSearch && matchesDietary;
  });

  const handleAddToCart = (item) => {
    if (!item.available) {
        toast.error('This item is currently out of stock');
        return;
    }
    addItem(item, quantity, instructions);
    toast.success(`Added ${quantity}x ${item.name} to cart`);
    setSelectedItem(null);
    setInstructions('');
    setQuantity(1);
  };

  const openItemDetails = (item) => {
    setSelectedItem(item);
    setInstructions('');
    setQuantity(1);
  };

  if (menuLoading && menuItems.length === 0) {
    return <LoadingSpinner size="lg" text="Preparing our menu for you..." />;
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in relative">
      {/* Hero section */}
      <div className="relative h-[250px] rounded-3xl overflow-hidden mb-12 shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=400&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Menu Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-12 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/20 border border-brand-orange/30 backdrop-blur-sm text-brand-orange text-xs font-bold uppercase tracking-widest mb-4 w-fit">
            <ChefHat className="w-3.5 h-3.5" /> Freshly Prepared
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 italic">Exquisite Dining</h1>
          <p className="text-gray-300 max-w-md text-lg">
            Discover our curated selection of fine dishes, prepared with passion and the finest ingredients.
          </p>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="sticky top-0 z-10 bg-surface-light/80 dark:bg-surface-dark-deep/80 backdrop-blur-xl py-4 mb-8 -mx-4 px-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap
                  ${activeCategory === cat 
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20 scale-105' 
                    : 'bg-white dark:bg-surface-dark text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-gray-800'
                  }`}
              >
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <label className="flex items-center gap-2 cursor-pointer group">
               <div className="relative">
                 <input 
                   type="checkbox" 
                   className="sr-only peer" 
                   checked={vegOnly}
                   onChange={() => setVegOnly(!vegOnly)}
                 />
                 <div className="w-11 h-6 bg-gray-200 dark:bg-gray-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
               </div>
               <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Leaf className={`w-4 h-4 ${vegOnly ? 'text-green-500 fill-green-500' : 'text-gray-400'}`} />
                  Veg Only
               </span>
            </label>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No items found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <Card 
              key={item.id} 
              padding="p-0" 
              hover
              onClick={() => openItemDetails(item)}
              className="group overflow-hidden flex flex-col h-full border border-gray-50 dark:border-gray-800/50"
            >
              <div className={`relative h-48 overflow-hidden ${!item.available ? 'grayscale opacity-75' : ''}`}>
                <img 
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={item.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {(item.popular || item.isPopular) && (
                    <div className="px-2 py-1 bg-brand-gold text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 shadow-lg border border-white/20">
                      <Flame className="w-3 h-3 fill-white" /> Popular
                    </div>
                  )}
                  {item.special && (
                    <div className="px-2 py-1 bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3 fill-white" /> Special
                    </div>
                  )}
                </div>

                {!item.available && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <div className="bg-white/90 dark:bg-gray-900/90 px-4 py-2 rounded-xl border border-white/20 shadow-xl flex items-center gap-2">
                         <XCircle className="w-4 h-4 text-red-500" />
                         <span className="text-xs font-black uppercase tracking-tighter text-gray-900 dark:text-white">Sold Out</span>
                      </div>
                   </div>
                )}
                
                {item.available && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md flex items-center justify-center text-gray-900 dark:text-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <Plus className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-orange transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-lg font-black text-gray-900 dark:text-white">
                    ₹{parseFloat(item.price).toFixed(2)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                  {item.description || "Freshly sourced ingredients masterfully prepared by our chefs."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800 mt-auto">
                   <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className={`w-3 h-3 rounded-sm border ${item.vegetarian ? 'border-green-500 flex items-center justify-center' : 'border-red-500 flex items-center justify-center'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.vegetarian ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 15-20 min</span>
                  </div>
                  <button className="text-brand-orange font-bold text-xs flex items-center gap-1 group/btn">
                    Order Now <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Item Customization Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
          <div className="relative w-full max-w-xl bg-white dark:bg-surface-dark rounded-[32px] overflow-hidden animate-scale-in">
             <div className="relative h-64">
                <img src={selectedItem.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&h=600&fit=crop'} className="w-full h-full object-cover" alt="" />
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                >
                  <Search className="w-5 h-5 rotate-45" /> 
                </button>
             </div>
             
             <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{selectedItem.name}</h2>
                      <p className="text-brand-orange font-black text-xl">₹{selectedItem.price.toFixed(2)}</p>
                   </div>
                   <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-2xl p-1.5 border border-gray-100 dark:border-gray-700">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-gray-900 hover:shadow-sm transition-all flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5 rotate-45" /> 
                      </button>
                      <span className="w-12 text-center text-lg font-black text-gray-900 dark:text-white">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-gray-900 hover:shadow-sm transition-all flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5" /> 
                      </button>
                   </div>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                   {selectedItem.description || "Enjoy our signature dish prepared with the freshest seasonal ingredients and our secret house blend of spices."}
                </p>

                <div className="space-y-4 mb-8">
                   <label className="block">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                         <MessageSquare className="w-3.5 h-3.5" /> Special Instructions
                      </span>
                      <textarea 
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="E.g. No onions, extra spicy, etc."
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all resize-none"
                        rows="3"
                      />
                   </label>
                </div>

                <Button 
                  fullWidth 
                  size="lg" 
                  disabled={!selectedItem.available}
                  onClick={() => handleAddToCart(selectedItem)}
                  className={`h-16 rounded-2xl shadow-xl text-lg ${
                    selectedItem.available 
                      ? 'bg-gradient-to-r from-brand-orange to-brand-gold shadow-brand-orange/20' 
                      : 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed shadow-none'
                  }`}
                >
                   {selectedItem.available 
                    ? `Add to Cart — ₹${(selectedItem.price * quantity).toFixed(2)}` 
                    : 'Currently Unavailable'}
                </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
