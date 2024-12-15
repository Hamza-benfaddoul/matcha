// import { BsFillPencilFill } from "react-icons/bs"
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import ProfilePicture from "@/components/ProfilePicture";

// bg-[#F02C56]


const renderContent = (activeTab: string) => {
  switch (activeTab) {
    case 'photos':
      return (
        <ProfilePicture />
      );
    case 'liked':
      return (
        <div>
          <h2>Liked Content</h2>
          <p>Here is the content for Liked items.</p>
        </div>
      );
    // Add more cases if needed
    default:
      return (
        <div>
          <p>Select a tab to view content.</p>
        </div>
      );
  }
};

function Profile() {
  const {auth} = useAuth();
  const user = auth.user;
  const [activeTab, setActiveTab] = useState('photos'); // Default is 'photos'
  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  return (
      <div className="pt-[90px] flex justify-center">
        <div className="flex flex-col w-[calc(100%-150px)] ">
         <div className="w-full min-h-[200px] bg-gradient-to-b from-white to-[#F02C56]"/>
          <div className="w-full flex justify-between px-4 relative py-8">
            <img src={`/api${user.profile_picture}`} alt="profile" className="absolute -top-14 left-4 w-[200px] h-[200px] rounded-3xl" />
              {/* <div className="flex"> */}
                <div className="ml-60">
                  <div className="text-[24px] font-semibold">{user.firstname} {user?.lastname}</div>
                  <div className="text-[17px] text-gray-500">{user?.biography}</div>
                  <div className="my-3">
                    <button className="bg-[#F02C56] text-white px-4 py-2 rounded-md mr-2">Follow</button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md"> Edit Profile</button>
                  </div>
                {/* </div> */}
              </div>
            <div className="flex flex-col items-end">
              {/* fame rating and other statistic */}
              <div className="flex mb-6">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <div className="flex">
                <div className="flex mr-10 flex-col justify-center items-center">
                  <span className="text-[24px] font-semibold">Views</span>
                  <span className="text-gray-500">320</span>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <span className="text-[24px] font-semibold">Likes</span>
                  <span className="text-gray-500">320</span>
                </div>
              </div>
            </div>
          </div>

        <div className="w-full flex items-center pt-4 border-b">
          <div
            onClick={() => handleTabClick('photos')}
            className={`w-60 text-center py-5 text-[17px] font-semibold border-b-2 ${activeTab === 'photos' ? 'border-b-black' : 'border-transparent'}`}>
            Photos
          </div>
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
          <div
            onClick={() => handleTabClick('settings')}
            className={`w-60 text-center py-5 text-[17px] font-semibold border-b-2 ${activeTab === 'settings' ? 'border-b-black' : 'border-transparent'}`}>
            Settings
          </div>
        </div>

        {renderContent(activeTab)}
      </div>
      </div>
  )
}

export default Profile