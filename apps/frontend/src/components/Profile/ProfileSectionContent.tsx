import Infos from "@/components/Profile/Infos";
import Likes from "@/components/Profile/Likes";
import Views from "@/components/Profile/Views";
import ProfilePicture from "@/components/Profile/ProfilePicture";
import { useState } from "react";

interface ProfileSectionContentProps {
    user: any;
    isMyProfile: boolean;
}


const renderContent = (activeTab: string, id: string, user: any) => {
    switch (activeTab) {
        case 'photos':
            return (
                <ProfilePicture idUser={id} IsProfilePicture={user.profile_picture}  />
            );
        case 'likes':
            return (
                <Likes id={id} />
            );
        case 'views':
            return (
                <Views id={id} />
            );
        case 'infos':
            return (
                <Infos id={id} user={user} />

            )
        // Add more cases if needed
        default:
            return (
                <div>
                    <p>Select a tab to view content.</p>
                </div>
            );
    }
};

const ProfileSectionContent = ({ user, isMyProfile }: ProfileSectionContentProps) => {
    const [activeTab, setActiveTab] = useState('photos'); // Default is 'photos'
    const handleTabClick = (tab: any) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="w-full flex items-center pt-4 border-b">
                <div
                    onClick={() => handleTabClick('photos')}
                    className={`w-60 text-center py-5 text-[17px] font-semibold border-b-2 ${activeTab === 'photos' ? 'border-b-black' : 'border-transparent'}`}>
                    Photos
                </div>
                {isMyProfile &&
                    <>
                        <div
                            onClick={() => handleTabClick('likes')}
                            className={`w-60 text-center py-5 text-[17px] font-semibold border-b-2 ${activeTab === 'likes' ? 'border-b-black' : 'border-transparent'}`}>
                            Likes
                        </div>
                        <div
                            onClick={() => handleTabClick('views')}
                            className={`w-60 text-center py-5 text-[17px] font-semibold border-b-2 ${activeTab === 'views' ? 'border-b-black' : 'border-transparent'}`}>
                            Views
                        </div>
                    </>
                }
                <div
                    onClick={() => handleTabClick('infos')}
                    className={`w-60 text-center py-5 text-[17px] font-semibold border-b-2 ${activeTab === 'infos' ? 'border-b-black' : 'border-transparent'}`}>
                    infos
                </div>
            </div>
            {renderContent(activeTab, user.id || '', user)}
        </>

    )
}
export default ProfileSectionContent;