import Avatar from '../../components/common/Avatar';
import Card from '../../components/common/Card';
import Divider from '../../components/common/Divider';
import Title from '../../components/common/Title';
import { StoreLayout } from '../../components/layout/layout';

MembershipPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function MembershipPage() {
    return (
        <div>
            <div className="p-4 md:p-8 lg:p-16 space-y-8">
                <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-3 space-x-12">
                        <div className="">
                            <div className="flex items-center mb-10">
                            <Avatar size={100} />
                                <div className="ml-3">
                                    <div className=" text-lg font-semibold">
                                        Nguyen Pham Anh Thu
                                    </div>
                                    <div>Silver</div>
                                </div>
                            </div>
                            <Divider />
                            <div>
                                <div className="text-2xl font-semibold">
                                    Silver
                                </div>
                                <div>Progress bar</div>
                                <div className="text-sm">
                                    Get 122 more points to unlock Gold
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <Title label="Tier Benefits" />
                            <Divider/>
                            <div className="w-3/4 grid grid-cols-5 mt-2 gap-2 text-center">
                                <Card className="p-2">Member</Card>
                                <Card className="p-2">Bronze</Card>
                                <Card className="p-2">Silver</Card>
                                <Card className="p-2">Gold</Card>
                                <Card className="p-2">Platinum</Card>
                            </div>
                            <div>Info</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
