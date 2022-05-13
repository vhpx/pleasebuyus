import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from './useUser';

const CartContext = createContext();

export const CartProvider = (props) => {
    const [initialized, setInitialized] = useState(false);

    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [discount, setDiscount] = useState({
        value: 0,
        type: 'percentage',
    });

    const [checkingOut, setCheckingOut] = useState(false);

    const { user } = useUser();

    const initialize = () => {
        if (initialized) return;
        setInitialized(true);
    };

    useEffect(() => {
        if (!initialized) return;
    }, [user, initialized]);

    const getSubtotal = (isSelected) => {
        const selected = isSelected ? selectedProducts : products;

        return selected.reduce((acc, product) => {
            return acc + product.price * product.quantity;
        }, 0);
    };

    const getDiscountValue = () => {
        if (discount.type === 'percentage')
            return getSubtotal() * (discount.value / 100);

        return discount.value;
    };

    const getTotal = () => {
        const subtotal = getSubtotal(false);
        const discountValue = getDiscountValue();

        return subtotal - discountValue > 0 ? subtotal - discountValue : 0;
    };

    const getTotalForSelectedProducts = () => {
        const subtotal = getSubtotal(true);
        const discountValue = getDiscountValue();

        return subtotal - discountValue > 0 ? subtotal - discountValue : 0;
    };

    const getTotalProducts = () => {
        return products.reduce((total, product) => total + product.quantity, 0);
    };

    const addProduct = (product, quantity = 1) => {
        if (quantity <= 0) return;
        if (checkingOut) {
            toast.error('You cannot add products while checking out');
            return;
        }

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
        if (checkingOut) {
            toast.error('Cannot remove product while checking out');
            return;
        }

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
        if (checkingOut) {
            toast.error('Cannot remove product while checking out');
            return;
        }

        setProducts((prevProducts) =>
            prevProducts.filter((i) => i.id !== productId)
        );
    };

    const clearCart = () => {
        if (checkingOut) {
            toast.error('Cannot clear cart while checking out');
            return;
        }

        setProducts([]);
        setSelectedProducts([]);

        toast.info('Cart cleared', {
            position: toast.POSITION.BOTTOM_LEFT,
        });
    };

    const selectProductWithId = (productId, outletId) => {
        if (checkingOut) {
            toast.error('Cannot select product while checking out');
            return;
        }

        setSelectedProducts((prevProducts) => [
            ...prevProducts,
            products.find(
                (i) => i.id === productId && i.outlet_id === outletId
            ),
        ]);
    };

    const deselectProductWithId = (productId, outletId) => {
        if (checkingOut) {
            toast.error('Cannot deselect product while checking out');
            return;
        }

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

    const checkOut = async (selectedCard, selectedAddress, selectedCoupon) => {
        if (checkingOut) {
            toast.error('You cannot check out while checking out');
            return;
        }

        try {
            setCheckingOut(true);

            if (!selectedProducts.length) {
                toast.error('No products selected');
                return;
            }

            if (!user) {
                toast.error('You must be logged in to check out');
                return;
            }

            if (!selectedCard) {
                toast.error('You must select a card');
                return;
            }

            if (!selectedAddress) {
                toast.error('You must select an address');
                return;
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setCheckingOut(false);
        }
    };

    const values = {
        initialize,
        checkingOut,
        setDiscount,

        products,
        selectedProducts,

        addProduct,
        removeProduct,
        removeAllProducts,
        clearCart,

        getSubtotal,
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
