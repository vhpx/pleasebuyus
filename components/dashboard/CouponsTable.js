import { formatCurrency } from '../../utils/currency-format';
import LoadingIndicator from '../common/LoadingIndicator';
import EditCouponForm from '../forms/EditCouponForm';
import { toast } from 'react-toastify';
import { useModals } from '@mantine/modals';
import { supabase } from '../../utils/supabase-client';
import { getRelativeTime } from '../../utils/date-format';

export default function CouponsTable({ coupons, loading, setter }) {
    const modals = useModals();
    const closeModal = () => modals.closeModal();

    const editCoupon = async (coupon) => {
        try {
            if (!coupon) throw new Error("Coupon doesn't exist");

            // get non-null values
            const newCoupon = {
                ...Object.fromEntries(
                    Object.entries(coupon).filter(
                        ([key, value]) => value !== null
                    )
                ),
            };

            const { data, error } = await supabase
                .from('coupons')
                .update(newCoupon)
                .eq('id', coupon.id)
                .single();

            if (error) throw error;

            setter((prevState) => {
                const newState = [...prevState];
                const index = newState.findIndex(
                    (coupon) => coupon.id === newCoupon.id
                );

                newState[index] = data;
                return newState;
            });
            toast.success('Coupon updated successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const deleteCoupon = async (couponId) => {
        try {
            const { error } = await supabase
                .from('coupons')
                .delete()
                .eq('id', couponId)
                .single();

            if (error) throw error;

            setter((prevState) =>
                prevState.filter((coupon) => coupon.id !== couponId)
            );
            toast.success('Coupon deleted successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const showEditCouponModal = (coupon) =>
        modals.openModal({
            title: <div className="font-bold">Edit coupon</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <EditCouponForm
                        coupon={coupon}
                        closeModal={closeModal}
                        onCreate={(coupon) => editCoupon(coupon)}
                        onDelete={() => deleteCoupon(coupon?.id)}
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
                                        Code
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
                                        Discount value
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
                                {coupons.map((coupon) => (
                                    <tr key={coupon.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {coupon?.id || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {coupon?.code || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {coupon?.name || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {coupon?.value
                                                    ? coupon?.use_ratio
                                                        ? `${coupon?.value}%`
                                                        : formatCurrency(
                                                              coupon?.value
                                                          )
                                                    : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {coupon?.created_at
                                                    ? getRelativeTime(
                                                          coupon?.created_at
                                                      )
                                                    : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                className="w-fit rounded-lg bg-purple-300/20 dark:bg-purple-300/20 dark:hover:bg-purple-400/40 hover:bg-purple-300/30 text-purple-600 dark:text-purple-300 dark:hover:text-purple-200 px-4 py-1 font-semibold transition duration-300 text-center"
                                                onClick={() =>
                                                    showEditCouponModal(coupon)
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
