import { useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../utils/supabase-client';
import FormInput from '../form/FormInput';

export default function EditOutletCategoryForm({
    user,
    outletId,
    category: currentCategory,
    closeModal,
    setter,
}) {
    const [categoryName, setCategoryName] = useState(
        currentCategory?.name || ''
    );

    const handleSubmit = async () => {
        try {
            if (!categoryName) throw new Error('Category name is empty');
            if (!user) throw new Error('User is not logged in');

            const { data: ownerData, error: ownerError } = await supabase
                .from('outlets')
                .select('owner_id')
                .eq('id', outletId)
                .single();

            if (ownerError) throw new Error('Outlet not found');
            if (ownerData.owner_id !== user.id)
                throw new Error('You are not the owner of this outlet');

            if (currentCategory?.id == null) {
                const { data, error } = await supabase
                    .from('outlet_categories')
                    .insert({
                        name: categoryName,
                        outlet_id: outletId,
                    })
                    .single();

                if (error) throw error;

                const newCategory = {
                    id: data?.id,
                    name: categoryName,
                    outlet_id: outletId,
                };

                setter((prev) => [...prev, newCategory]);

                toast.success('Category added successfully');
                closeModal();
                return;
            }

            const { data, error } = await supabase
                .from('outlet_categories')
                .update({
                    name: categoryName,
                })
                .eq('outlet_id', outletId)
                .eq('id', currentCategory?.id)
                .single();

            if (error) throw error;

            const newCategory = {
                id: currentCategory?.id || data?.id,
                name: categoryName,
                outlet_id: outletId,
            };

            setter((prev) =>
                prev?.map((category) =>
                    category.id === currentCategory.id ? newCategory : category
                )
            );

            toast.success('Category updated successfully');
            closeModal();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            if (!user) throw new Error('User is not logged in');
            if (!currentCategory) throw new Error('Category is not selected');

            const { data, error } = await supabase
                .from('outlet_categories')
                .delete()
                .eq('id', currentCategory?.id)
                .eq('outlet_id', outletId)
                .single();

            if (error) throw error;

            setter((prev) =>
                prev?.filter((category) => category.id !== currentCategory.id)
            );

            toast.success('Category deleted successfully');
            closeModal();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            <FormInput
                label="Name"
                id="category-name"
                placeholder="Enter category name"
                value={categoryName}
                setter={setCategoryName}
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

                {currentCategory?.id != null && (
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
                    {currentCategory?.id == null ? 'Add Category' : 'Update'}
                </button>
            </div>
        </>
    );
}
