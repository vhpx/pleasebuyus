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
import { RequireAuth } from '../../../hooks/useUser';
import EditItemForm from '../../../components/forms/EditItemForm';
import Avatar from '../../../components/common/Avatar';
import FormLabel from '../../../components/form/FormLabel';
import { v4 as uuidv4 } from 'uuid';

OutletSettingsPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export async function getServerSideProps({ query, req }) {
    const { outletId } = query;

    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) return { redirect: { destination: '/login', permanent: false } };

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

export default function OutletSettingsPage({ outlet }) {
    RequireAuth();

    const router = useRouter();
    const { outletId } = router.query;

    const [savingOutlet, setSavingOutlet] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [loadingItems, setLoadingItems] = useState(true);
    const [items, setItems] = useState([]);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setItems([]);
            setCategories([]);

            setLoadingItems(false);
            setLoadingCategories(false);
        }, 1000);

        timeout;
    }, []);

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

    const openUserCardCreationModal = (item) =>
        modals.openModal({
            title: (
                <div className="font-bold">
                    {item ? 'Edit item' : 'Add new item'}
                </div>
            ),
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <EditItemForm
                        user={user}
                        userData={userData}
                        closeModal={closeModal}
                        onCreate={(bank) => openNewCard(bank)}
                        setter={setCards}
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
            outlet.avatar_url = avatarUrl;
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <Title label="Outlet Information"></Title>
                <Divider />

                <div className="lg:w-1/3 mb-8 grid grid-cols-1 gap-x-8">
                    <div className="flex flex-col md:flex-row col-span-full mb-8 items-center justify-start space-y-4 md:space-x-8 md:space-y-0">
                        <div className="flex-0">
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
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex">
                    <Title label="Items"></Title>
                    <button
                        className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                        onClick={() => {}}
                    >
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                    {loadingItems ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : items && items.length > 0 ? (
                        items.map((outlet) => (
                            <BetterLink
                                key={outlet.id}
                                href={`/outlets/${outlet.id}`}
                                className="relative"
                            >
                                <ImageCard
                                    name={outlet.name || 'Unnamed outlet'}
                                    desc={outlet.address || 'Unknown address'}
                                    imageUrl={outlet.imageUrl}
                                />

                                <BetterLink
                                    href={`/outlets/${outlet.id}/settings`}
                                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 transition duration-300"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </BetterLink>
                            </BetterLink>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                No items added yet
                            </p>

                            <button
                                className="flex items-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                onClick={() => {}}
                            >
                                <PlusIcon className="w-4 h-4" />
                                <div>Add item</div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex">
                    <Title label="Categories"></Title>
                    <button className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2">
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                    {loadingCategories ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : categories && categories.length > 0 ? (
                        categories.map((outlet) => (
                            <BetterLink
                                key={outlet.id}
                                href={`/outlets/${outlet.id}`}
                                className="relative"
                            >
                                <ImageCard
                                    name={outlet.name || 'Unnamed outlet'}
                                    desc={outlet.address || 'Unknown address'}
                                    imageUrl={outlet.imageUrl}
                                />

                                <BetterLink
                                    href={`/outlets/${outlet.id}/settings`}
                                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 transition duration-300"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </BetterLink>
                            </BetterLink>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                No categories added yet
                            </p>

                            <button className="flex items-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300">
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
