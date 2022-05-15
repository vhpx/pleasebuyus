import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/currency-format';
import LoadingIndicator from '../common/LoadingIndicator';
import { getRelativeTime } from '../../utils/date-format';
import { useModals } from '@mantine/modals';
import { supabase } from '../../utils/supabase-client';
import AdminEditProductForm from '../forms/AdminEditProductForm';

export default function ProductsTable({ products, loading, setter }) {
    const modals = useModals();
    const closeModal = () => modals.closeModal();

    const editProduct = async (product) => {
        try {
            if (!product) throw new Error("Product doesn't exist");

            // get non-null values
            const newProduct = {
                ...Object.fromEntries(
                    Object.entries(product).filter(
                        ([key, value]) => value !== null
                    )
                ),
            };

            const { data, error } = await supabase
                .from('products')
                .update(newProduct)
                .eq('id', product.id)
                .single();

            if (error) throw error;

            setter((prevState) => {
                const newState = [...prevState];
                const index = newState.findIndex(
                    (product) => product.id === newProduct.id
                );

                newState[index] = data;
                return newState;
            });
            toast.success('Product updated successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId)
                .single();

            if (error) throw error;

            setter((prevState) =>
                prevState.filter((product) => product.id !== productId)
            );
            toast.success('Product deleted successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const showEditProductModal = (product) =>
        modals.openModal({
            title: <div className="font-bold">Edit product</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <AdminEditProductForm
                        product={product}
                        closeModal={closeModal}
                        onCreate={(product) => editProduct(product)}
                        onDelete={() => deleteProduct(product?.id)}
                    />
                </div>
            ),
            onClose: () => {},
        });

    return loading ? (
        <div className="text-center">
            <LoadingIndicator svgClassName="w-8 h-8" />
        </div>
    ) : (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-zinc-200 dark:border-zinc-700 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                            <thead className="bg-white dark:bg-zinc-800/50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        Outlet ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        Description
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        Price
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        Creation Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="relative px-6 py-3"
                                    >
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-800/50 divide-y divide-zinc-200 dark:divide-zinc-700">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {product?.id || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {product?.outlet_id || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {product?.name || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {product?.description || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {product?.price != null
                                                    ? formatCurrency(
                                                          product?.price
                                                      )
                                                    : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {product?.created_at
                                                    ? getRelativeTime(
                                                          product?.created_at
                                                      )
                                                    : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                className="w-fit rounded-lg bg-purple-300/20 dark:bg-purple-300/20 dark:hover:bg-purple-400/40 hover:bg-purple-300/30 text-purple-600 dark:text-purple-300 dark:hover:text-purple-200 px-4 py-1 font-semibold transition duration-300 text-center"
                                                onClick={() =>
                                                    showEditProductModal(
                                                        product
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
