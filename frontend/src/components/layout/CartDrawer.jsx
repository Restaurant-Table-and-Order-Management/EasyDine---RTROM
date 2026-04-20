import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Send, MessageSquare } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import Button from '../ui/Button';
import Card from '../ui/Card';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, activeReservationId } = useCartStore();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    setIsPlacingOrder(true);
    const loadingToast = toast.loading('Placing your order...');

    try {
      const orderData = {
        items: items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
        })),
        reservationId: activeReservationId
      };

      await api.post('/orders', orderData);
      
      toast.success('Order placed successfully! Sending to kitchen...', { id: loadingToast });
      clearCart();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order', { id: loadingToast });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md animate-slide-in-right">
          <div className="h-full flex flex-col bg-white dark:bg-surface-dark shadow-2xl">
            {/* Header */}
            <div className="px-6 py-6 bg-gradient-to-r from-brand-orange to-brand-gold shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Your Order</h2>
                    <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                      {items.length} {items.length === 1 ? 'Item' : 'Items'} Selected
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your cart is empty</h3>
                  <p className="text-sm text-gray-500 max-w-[200px] mt-2">
                    Looks like you haven't added anything to your order yet.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={onClose}>
                    Browse Menu
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <Card key={`${item.id}-${idx}`} padding="p-4" className="border border-gray-100 dark:border-gray-800">
                      <div className="flex gap-4">
                        <img 
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'} 
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                          alt={item.name}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-gray-900 dark:text-white truncate pr-2">
                              {item.name}
                            </h4>
                            <button 
                              onClick={() => removeItem(item.id, item.specialInstructions)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm font-bold text-brand-orange mb-2">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          
                          {item.specialInstructions && (
                            <div className="flex items-start gap-1.5 mb-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                              <MessageSquare className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                              <p className="text-xs text-gray-500 italic truncate">
                                "{item.specialInstructions}"
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-1 border border-gray-100 dark:border-gray-700">
                              <button 
                                onClick={() => updateQuantity(item.id, item.specialInstructions, item.quantity - 1)}
                                className="p-1 hover:text-brand-orange transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-gray-900 dark:text-white">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.specialInstructions, item.quantity + 1)}
                                className="p-1 hover:text-brand-orange transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">
                              ${item.price.toFixed(2)} / each
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-gray-50 dark:bg-surface-dark-deep border-t border-gray-100 dark:border-gray-800 shrink-0">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Service Fee</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Payable Amount</span>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Includes all taxes</p>
                    </div>
                    <span className="text-3xl font-black text-brand-orange animate-pulse-slow">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  fullWidth 
                  size="lg"
                  disabled={isPlacingOrder}
                  onClick={handlePlaceOrder}
                  className="h-14 bg-gradient-to-r from-brand-orange to-brand-gold shadow-lg shadow-brand-orange/20"
                >
                  {isPlacingOrder ? (
                    'Processing...'
                  ) : (
                    <>
                      Place Order <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
                  Secure checkout powered by EasyDine
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
