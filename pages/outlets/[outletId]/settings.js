import { PencilIcon, PlusIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import OutlinedButton from '../../../components/buttons/OutlinedButton';
import ImageCard from '../../../components/cards/ImageCard';
import { toast } from 'react-toastify';
import Divider from '../../../components/common/Divider';
import LoadingIndicator from '../../../components/common/LoadingIndicator';
import Title from '../../../components/common/Title';
import FormInput from '../../../components/form/FormInput';
import { StoreLayout } from '../../../components/layout/layout';
import BetterLink from '../../../components/link/BetterLink';
import { supabase } from '../../../utils/supabase-client';
import { RequireAuth, useUser } from '../../../hooks/useUser';
import EditProductForm from '../../../components/forms/EditProductForm';
import Avatar from '../../../components/common/Avatar';
import FormLabel from '../../../components/form/FormLabel';
import { v4 as uuidv4 } from 'uuid';
import { useModals } from '@mantine/modals';
import { formatCurrency } from '../../../utils/currency-format';
import EditOutletCategoryForm from '../../../components/forms/EditOutletCategoryForm';

OutletSettingsPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export async function getServerSideProps({ query, req }) {
    const { outletId } = query;

    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user)
        return { redirect: { destination: '/logout', permanent: false } };

    try {
        const { data: outletData, error } = await supabase
            .from('outlets')
            .select('*')
            .eq('id', outletId)
            .single();

        if (error || !outletData) throw error;
        if (outletData.owner_id !== user.id)
            return {
                redirect: {
                    destination: `/outlets/${outletId}`,
                    permanent: false,
                },
            };

        return { props: { outlet: outletData } };
    } catch (error) {
        console.error(error);
    }
}

export default function OutletSettingsPage({ outlet: fetchedOutlet }) {
    RequireAuth();

    const router = useRouter();
    const { user } = useUser();
    const modals = useModals();

    const { outletId } = router.query;

    const [outlet, setOutlet] = useState(fetchedOutlet);

    const [savingOutlet, setSavingOutlet] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [loadingProducts, setLoadingProducts] = useState(true);
    const [products, setProducts] = useState([]);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categories, setCategories] = useState([]);

    const closeModal = () => modals.closeModal();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (!outletId) throw new Error('Outlet not found');

                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('outlet_id', outletId);

                if (error) throw error;
                setProducts(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingProducts(false);
            }
        };

        const fetchCategories = async () => {
            try {
                if (!outletId) throw new Error('Outlet not found');

                const { data, error } = await supabase
                    .from('outlet_categories')
                    .select('*')
                    .eq('outlet_id', outletId);

                if (error) throw error;
                setCategories(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingCategories(false);
            }
        };

        const fetchAll = async () => {
            await Promise.all([fetchProducts(), fetchCategories()]);
        };

        fetchAll();
    }, [outletId]);

    const handleSaveOutlet = async () => {
        setSavingOutlet(true);

        try {
            const { data: outletData, error } = await supabase
                .from('outlets')
                .update(outlet)
                .eq('id', outletId)
                .single();

            if (error) throw error;

            setOutlet(outletData);
            setSavingOutlet(false);

            toast.success('Outlet saved');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSavingOutlet(false);
        }
    };

    const openProductEditModal = (product) =>
        modals.openModal({
            title: (
                <div className="font-bold">
                    {product ? 'Edit product' : 'Add new product'}
                </div>
            ),
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <EditProductForm
                        user={user}
                        outletId={outletId}
                        categories={categories}
                        product={product}
                        closeModal={closeModal}
                        setter={setProducts}
                    />
                </div>
            ),
            onClose: () => {},
        });

    const openOutletCategoryEditModal = (category) =>
        modals.openModal({
            title: (
                <div className="font-bold">
                    {category ? 'Edit category' : 'Add new category'}
                </div>
            ),
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <EditOutletCategoryForm
                        user={user}
                        outletId={outletId}
                        category={category}
                        closeModal={closeModal}
                        setter={setCategories}
                    />
                </div>
            ),
            onClose: () => {},
        });

    const downloadImage = (path) => {
        try {
            const { publicURL, error } = supabase.storage
                .from('avatars')
                .getPublicUrl(path);

            if (error) {
                throw error;
            }

            return publicURL;
        } catch (error) {
            console.log('Error downloading image: ', error.message);
        }
    };

    const uploadAvatar = async (event) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const avatarUrl = downloadImage(filePath);

            const { error } = await supabase
                .from('outlets')
                .update({ avatar_url: avatarUrl }, { returning: 'minimal' })
                .eq('id', outlet?.id);

            if (error) throw error;
            setOutlet((prevState) => ({ ...prevState, avatar_url: avatarUrl }));
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex">
                    <Title label="Outlet Information" />
                    <BetterLink
                        href={`/outlets/${outletId}`}
                        className="px-4 py-1 font-semibold bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                    >
                        View outlet
                    </BetterLink>
                </div>
                <Divider />

                <div className="lg:w-1/3 mb-8 grid grid-cols-1 gap-8">
                    <div className="flex flex-col md:flex-row col-span-full mb-8 items-center justify-start space-y-4 md:space-x-8 md:space-y-0">
                        <div className="flex-none">
                            <Avatar
                                url={outlet.avatar_url}
                                size={140}
                                hideDefault={true}
                                alt={outlet.name}
                            />
                        </div>

                        <div className="flex flex-col w-full">
                            <FormLabel
                                className="mb-0"
                                id="avatar"
                                label={
                                    uploading
                                        ? 'Uploading...'
                                        : 'Upload an avatar for your outlet'
                                }
                            />

                            <input
                                className="block max-w-md cursor-pointer rounded-lg border border-zinc-300 bg-white transition duration-300 placeholder:text-black hover:border-zinc-400 hover:bg-zinc-200/50 focus:border-transparent focus:outline-none dark:border-zinc-700/50 dark:bg-zinc-900/70 dark:text-white dark:placeholder:text-white dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                                aria-describedby="user_avatar_help"
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={uploadAvatar}
                                disabled={uploading}
                            />
                            <div
                                className="mt-1 text-sm text-zinc-500 dark:text-zinc-300"
                                id="avatar-description"
                            >
                                Your outlet avatar is a way to identify your
                                outlet.
                            </div>
                        </div>
                    </div>
                    <Divider className="col-span-full" />

                    <FormInput
                        label="Name"
                        value={outlet?.name}
                        setter={(value) => {
                            setOutlet({
                                ...outlet,
                                name: value,
                            });
                        }}
                    />
                    <FormInput
                        label="Address"
                        value={outlet?.address}
                        setter={(value) => {
                            setOutlet({
                                ...outlet,
                                address: value,
                            });
                        }}
                    />

                    <div className="h-4 col-span-full" />

                    <OutlinedButton
                        loading={savingOutlet}
                        label="Save Outlet"
                        loadingLabel="Saving"
                        className="max-w-sm"
                        onClick={handleSaveOutlet}
                        buttonOnly={true}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex">
                    <Title label="Products" />
                    <button
                        className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                        onClick={() => openProductEditModal()}
                    >
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loadingProducts ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : products && products.length > 0 ? (
                        products.map((product) => (
                            <div className="relative" key={product.id}>
                                <BetterLink
                                    href={`/outlets/${outletId}/products/${product.id}`}
                                >
                                    <ImageCard
                                        name={product.name || 'Unnamed product'}
                                        desc={
                                            formatCurrency(product.price) ||
                                            product.description ||
                                            ''
                                        }
                                        imageUrl={product.avatar_url}
                                    />
                                </BetterLink>

                                <button
                                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 transition duration-300"
                                    onClick={() =>
                                        openProductEditModal(product)
                                    }
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                No products added yet
                            </p>

                            <button
                                className="flex items-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                onClick={() => openProductEditModal()}
                            >
                                <PlusIcon className="w-4 h-4" />
                                <div>Add product</div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex">
                    <Title label="Categories" />
                    <button
                        className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                        onClick={() => openOutletCategoryEditModal()}
                    >
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loadingCategories ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : categories && categories.length > 0 ? (
                        categories.map((category) => (
                            <div key={category.id} className="relative">
                                <ImageCard
                                    name={category.name || 'Unnamed category'}
                                />

                                <button
                                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 transition duration-300"
                                    onClick={() =>
                                        openOutletCategoryEditModal(category)
                                    }
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                No categories added yet
                            </p>

                            <button
                                className="flex items-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                onClick={() => openOutletCategoryEditModal()}
                            >
                                <PlusIcon className="w-4 h-4" />
                                <div>Add category</div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
