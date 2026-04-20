import React from 'react';
import { RotateCcw } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function ReorderButton({ order, variant = 'outline', size = 'sm', className = '' }) {
  const { addItem } = useCartStore();

  const handleReorder = () => {
    if (!order || !order.items) return;

    order.items.forEach(item => {
      // Reconstruct simple menu item object for the cart
      const menuItem = {
        id: item.menuItemId,
        name: item.menuItemName,
        price: item.price,
        // We might not have the image URL in the order response, 
        // but the cart will try to display it if it can.
      };
      
      addItem(menuItem, item.quantity, item.specialInstructions || '');
    });

    toast.success('Items added to cart! Review and place your order.');
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleReorder}
      className={className}
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      Re-order
    </Button>
  );
}
