import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from './useUser';

const CartContext = createContext();

export const CartProvider = (props) => {
    const [initialized, setInitialized] = useState(false);

    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const { user } = useUser();

    const initialize = () => {
        if (initialized) return;
        setInitialized(true);
    };

    useEffect(() => {
        if (!initialized) return;
    }, [user, initialized]);

    const getTotal = () => {
        return products.reduce(
            (total, product) => total + product.price * product.quantity,
            0
        );
    };

    const getTotalForSelectedProducts = () => {
        return selectedProducts.reduce(
            (total, product) => total + product.price * product.quantity,
            0
        );
    };

    const getTotalProducts = () => {
        return products.reduce((total, product) => total + product.quantity, 0);
    };

    const addProduct = (product, quantity = 1) => {
        if (quantity <= 0) return;

        const newProducts = [...products];
        const productIndex = newProducts.findIndex((i) => i.id === product.id);

        const maxQuantity = 10;

        if (productIndex === -1) {
            newProducts.push({
                ...product,
                quantity: Math.min(quantity, maxQuantity),
            });

            toast.info(`Added ${quantity} ${product.name} to cart`);
        } else {
            const oldQuantity = newProducts[productIndex].quantity;
            const newQuantity = Math.min(oldQuantity + quantity, maxQuantity);

            newProducts[productIndex].quantity = newQuantity;

            if (newQuantity !== oldQuantity)
                toast.info(`Added ${quantity} ${product.name} to cart`);
        }

        setProducts(newProducts);
    };

    const removeProduct = (productId) => {
        const newProducts = [...products];
        const productIndex = newProducts.findIndex((i) => i.id === productId);

        if (productIndex === -1) return;

        if (newProducts[productIndex].quantity === 1) {
            newProducts.splice(productIndex, 1);
        } else {
            newProducts[productIndex].quantity--;
        }

        setProducts(newProducts);
    };

    const removeAllProducts = (productId) => {
        setProducts((prevProducts) =>
            prevProducts.filter((i) => i.id !== productId)
        );
    };

    const clearCart = () => {
        setProducts([]);
        toast.info('Cart cleared', {
            position: toast.POSITION.BOTTOM_LEFT,
        });
    };

    const selectProductWithId = (productId, outletId) => {
        setSelectedProducts((prevProducts) => [
            ...prevProducts,
            products.find(
                (i) => i.id === productId && i.outlet_id === outletId
            ),
        ]);
    };

    const deselectProductWithId = (productId, outletId) => {
        setSelectedProducts((prevProducts) =>
            prevProducts.filter(
                (i) => i.id !== productId || i.outlet_id !== outletId
            )
        );
    };

    const getSelectedProductsByOutletId = (outletId) => {
        return selectedProducts.filter((i) => i.outlet_id === outletId && i.id);
    };

    const isOutletSelected = (outletId) => {
        return selectedProducts.some((i) => i.outlet_id === outletId && i.id);
    };

    const isProductSelected = (productId, outletId) => {
        return selectedProducts.some(
            (i) => i.id === productId && i.outlet_id === outletId
        );
    };

    const values = {
        initialize,

        products,
        selectedProducts,

        addProduct,
        removeProduct,
        removeAllProducts,
        clearCart,

        getTotal,
        getTotalForSelectedProducts,
        getTotalProducts,

        selectProductWithId,
        deselectProductWithId,

        isOutletSelected,
        isProductSelected,

        getSelectedProductsByOutletId,
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
