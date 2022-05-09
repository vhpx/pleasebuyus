import { useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../utils/supabase-client';
import FormInput from '../form/FormInput';

export default function EditProductForm({
    user,
    outletId,
    product: currentProduct,
    closeModal,
    setter,
}) {
    const [productName, setProductName] = useState(currentProduct?.name || '');
    const [productDescription, setProductDescription] = useState(
        currentProduct?.description || ''
    );
    const [productPrice, setProductPrice] = useState(
        currentProduct?.price || ''
    );
    const [productAvatarUrl, setProductAvatarUrl] = useState(
        currentProduct?.avatar_url || ''
    );

    const handleSubmit = async () => {
        try {
            if (!productName) throw new Error('Product name is empty');
            if (!productPrice) throw new Error('Product price is empty');

            if (!user) throw new Error('User is not logged in');

            const { data: ownerData, error: ownerError } = await supabase
                .from('outlets')
                .select('owner_id')
                .eq('id', outletId)
                .single();

            if (ownerError) throw new Error('Outlet not found');
            if (ownerData.owner_id !== user.id)
                throw new Error('You are not the owner of this outlet');

            if (currentProduct?.id == null) {
                const { data, error } = await supabase
                    .from('products')
                    .insert({
                        name: productName,
                        description: productDescription,
                        price: parseInt(productPrice),
                        avatar_url: productAvatarUrl,
                        outlet_id: outletId,
                    })
                    .single();

                if (error) throw error;

                const newProduct = {
                    id: data?.id,
                    name: productName,
                    description: productDescription,
                    price: parseInt(productPrice),
                    avatar_url: productAvatarUrl,
                    outlet_id: outletId,
                };

                setter((prev) => [...prev, newProduct]);

                toast.success('Product added successfully');
                closeModal();
                return;
            }

            const { data, error } = await supabase
                .from('products')
                .update({
                    name: productName,
                    description: productDescription,
                    price: parseInt(productPrice),
                    avatar_url: productAvatarUrl,
                })
                .eq('outlet_id', outletId)
                .eq('id', currentProduct?.id)
                .single();

            if (error) throw error;

            const newProduct = {
                id: currentProduct?.id || data?.id,
                name: productName,
                description: productDescription,
                price: parseInt(productPrice),
                avatar_url: productAvatarUrl,
                outlet_id: outletId,
            };

            setter((prev) =>
                prev?.map((product) =>
                    product.id === currentProduct.id ? newProduct : product
                )
            );

            toast.success('Product updated successfully');
            closeModal();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            if (!user) throw new Error('User is not logged in');
            if (!currentProduct) throw new Error('Product is not selected');

            const { data, error } = await supabase
                .from('products')
                .delete()
                .eq('id', currentProduct?.id)
                .eq('outlet_id', outletId)
                .single();

            if (error) throw error;

            setter((prev) =>
                prev?.filter((product) => product.id !== currentProduct.id)
            );

            toast.success('Product deleted successfully');
            closeModal();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            <FormInput
                label="Name"
                id="product-name"
                placeholder="Enter product name"
                value={productName}
                setter={setProductName}
            />
            <FormInput
                label="Description"
                id="product-description"
                placeholder="Enter product description"
                value={productDescription}
                setter={setProductDescription}
            />
            <FormInput
                label="Price"
                id="product-price"
                placeholder="Enter product price"
                value={productPrice}
                setter={setProductPrice}
            />

            <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2 mt-8">
                <button
                    className="flex items-center justify-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() => {
                        closeModal();
                    }}
                >
                    Cancel
                </button>

                {currentProduct?.id != null && (
                    <button
                        className="flex items-center justify-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                )}

                <button
                    className="flex items-center justify-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={handleSubmit}
                >
                    {currentProduct?.id == null ? 'Add Product' : 'Update'}
                </button>
            </div>
        </>
    );
}
