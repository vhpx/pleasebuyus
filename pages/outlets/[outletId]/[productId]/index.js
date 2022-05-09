import { HeartIcon } from '@heroicons/react/outline';
import OutlinedButton from '../../../../components/buttons/OutlinedButton';
import Divider from '../../../../components/common/Divider';
import Title from '../../../../components/common/Title';
import { StoreLayout } from '../../../../components/layout/layout';

DetailedProductPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function DetailedProductPage() {
    return (
        <div>
            <div className="p-4 md:p-8 lg:p-16 ">
                <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                    <div className="flex p-8">
                        <div className="w-1/3">
                            <img
                                className="w-48 h-64 m-auto"
                                src="https://www.tradeinn.com/f/13822/138228220/asus-rog-strix-g513ih-hn006-15.6-r7-4800h-16gb-512gb-ssd-gtx-1650-4gb-gaming-laptop.jpg"
                            />
                        </div>
                        <div className="w-2/3 ">
                            <div className="text-4xl font-semibold">
                                Asus Rog Strix G513IH-HN006 15.6
                            </div>
                            <></>
                            <div className="mt-1 text-base flex space-x-10">
                                <div>5 stars</div>
                                <div>30 sold</div>
                            </div>
                            <Divider />
                            <div className="text-2xl font-semibold">
                                $1,999.00
                            </div>
                            <div>200 left</div>
                            <div>Outlet: </div>
                            <div className="mt-9 flex 0">
                                <HeartIcon className="w-9 mr-12 hover:cursor-pointer" />
                                <div className="grid grid-cols-2 gap-x-12">
                                    <OutlinedButton label="Add to cart" />
                                    <OutlinedButton label="Buy now" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                    <Title label="Description" />
                    <Divider />
                    <div>
                        Focused firepower streamlines and elevates the core
                        Windows 10 Pro gaming experience in the ROG Strix
                        G15/17. With up to a powerful AMD Ryzen™ 9 5900HX CPU
                        and GeForce RTX™ 3070 GPU, everything from gaming to
                        multitasking is fast and fluid. Go full-throttle on
                        esports speed with a competition-grade display up to
                        300Hz/3ms, or immerse in rich detail on a WQHD 165Hz/3ms
                        panel. Adaptive-Sync makes gameplay ultrasmooth, while
                        advanced thermal upgrades help you stay cool under
                        pressure. No matter what your game is, you can achieve
                        your perfect play.<br></br> - No OS <br></br>- AMD Ryzen
                        7 4800H (8MB Cache, 2.9GHz)<br></br> - 39.6 cm (15.6´´)
                        Full HD 1920 x 1080 IPS, NVIDIA GeForce GTX 1650 (4GB
                        GDDR6)<br></br> - 16GB (3200MHz) DDR4-SDRAM (2 x 16) &
                        512GB SSD
                    </div>
                </div>
            </div>
        </div>
    );
}
