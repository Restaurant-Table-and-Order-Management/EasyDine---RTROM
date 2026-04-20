import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import useDataStore from '../../store/dataStore';
import toast from 'react-hot-toast';

const MENU_CATEGORIES = ['STARTERS', 'MAINS', 'DRINKS', 'DESSERTS'];

export default function MenuItemFormModal({ isOpen, onClose, editingItem }) {
  const { createMenuItem, updateMenuItem } = useDataStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'MAINS',
    available: true,
    special: false,
    isVegetarian: false,
    isPopular: false
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        description: editingItem.description || '',
        price: editingItem.price || '',
        imageUrl: editingItem.imageUrl || '',
        category: editingItem.category || 'MAINS',
        available: editingItem.available !== undefined ? editingItem.available : true,
        special: editingItem.special !== undefined ? editingItem.special : false,
        isVegetarian: editingItem.isVegetarian !== undefined ? editingItem.isVegetarian : false,
        isPopular: editingItem.isPopular !== undefined ? editingItem.isPopular : false
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: 'MAINS',
        available: true,
        special: false,
        isVegetarian: false,
        isPopular: false
      });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
    };

    let result;
    if (editingItem) {
      result = await updateMenuItem(editingItem.id, payload);
    } else {
      result = await createMenuItem(payload);
    }

    setLoading(false);

    if (result.success) {
      toast.success(editingItem ? 'Menu item updated successfully!' : 'Menu item created successfully!');
      onClose();
    } else {
      toast.error(result.message || 'An error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {editingItem ? 'Edit Menu Item' : 'Create Menu Item'}
            </h2>
            <p className="text-sm text-gray-500">Fill in the details below.</p>
          </div>
          <button 
            onClick={onClose}
            disabled={loading}
             className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-5">
            {/* Row 1: Name & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all"
                  placeholder="e.g. Classic Cheeseburger"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Row 2: Category & Category Label */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all"
                  >
                    {MENU_CATEGORIES.map(cat => (
                        <option value={cat} key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                     <ImageIcon className="w-4 h-4"/> Image URL
                   </label>
                   <input
                     type="url"
                     name="imageUrl"
                     value={formData.imageUrl}
                     onChange={handleChange}
                     className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all"
                     placeholder="https://example.com/image.jpg"
                   />
                </div>
            </div>

            {/* Row 3: Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all resize-none"
                placeholder="Delicious description of the item..."
              />
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-800 my-4"></div>

            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Is Available?</p>
                  <p className="text-xs text-gray-500">Toggle off to mark out of stock</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    name="special"
                    checked={formData.special}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Special/Seasonal</p>
                  <p className="text-xs text-gray-500">Highlight this item</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    name="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Is Vegetarian?</p>
                  <p className="text-xs text-gray-500">Green indicator for veg items</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Mark as Popular</p>
                  <p className="text-xs text-gray-500">Displays a special 🔥 badge</p>
                </div>
              </label>
            </div>
            
          </div>

          {/* Footer inside form to control submit */}
          <div className="mt-8 pt-5 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-surface-dark pb-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Item
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
