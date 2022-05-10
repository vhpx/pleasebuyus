import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from './useUser';

const CartContext = createContext();

export const CartProvider = (props) => {
    const [items, setItems] = useState([]);
    const [initialized, setInitialized] = useState(false);

    const { user } = useUser();

    const initialize = () => {
        if (initialized) return;
        setInitialized(true);
    };

    useEffect(() => {
        if (!initialized) return;
    }, [user, initialized]);

    const getTotal = () => {
        return items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const addItem = (item, quantity = 1) => {
        if (quantity <= 0) return;

        const newItems = [...items];
        const itemIndex = newItems.findIndex((i) => i.id === item.id);

        if (itemIndex === -1) newItems.push({ ...item, quantity });
        else newItems[itemIndex].quantity += quantity;

        toast.info(`Added ${quantity} ${item.name} to cart`);
        setItems(newItems);
    };

    const removeItem = (itemId) => {
        const newItems = [...items];
        const itemIndex = newItems.findIndex((i) => i.id === itemId);

        if (itemIndex === -1) return;

        if (newItems[itemIndex].quantity === 1) {
            newItems.splice(itemIndex, 1);
        } else {
            newItems[itemIndex].quantity--;
        }

        setItems(newItems);
    };

    const removeAllItems = (itemId) => {
        setItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
    };

    const clearCart = () => {
        setItems([]);
        toast.info('Cart cleared', {
            position: toast.POSITION.BOTTOM_LEFT,
        });
    };

    const values = {
        initialize,

        items,

        addItem,
        removeItem,
        removeAllItems,
        clearCart,

        getTotal,
        getTotalItems,
    };

    return <CartContext.Provider value={values} {...props} />;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error(`useCart must be used within a CartProvider.`);
    }
    return context;
};
