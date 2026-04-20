import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      activeReservationId: null,
      
      setActiveReservationId: (id) => set({ activeReservationId: id }),
      addItem: (menuItem, quantity = 1, specialInstructions = '') => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) => item.id === menuItem.id && item.specialInstructions === specialInstructions
        );

        if (existingItemIndex > -1) {
          const newItems = [...items];
          newItems[existingItemIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          set({
            items: [
              ...items,
              {
                ...menuItem,
                quantity,
                specialInstructions,
              },
            ],
          });
        }
      },

      removeItem: (itemId, specialInstructions) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === itemId && item.specialInstructions === specialInstructions)
          ),
        }));
      },

      updateQuantity: (itemId, specialInstructions, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId, specialInstructions);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId && item.specialInstructions === specialInstructions
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'easydine-cart-storage',
    }
  )
);

export default useCartStore;
