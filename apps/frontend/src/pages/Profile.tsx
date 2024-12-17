import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProfileSectionContent from "@/components/ProfileSectionContent";

function Profile() {
  const { auth } = useAuth();
  const [user, setUser] = useState<any>(auth.user);
  const [isMyProfile, setIsMyProfile] = useState(true);
  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleUpdateModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };

  const fetchCountViews = async () => {
    try {
      const response = await axios.get(`/api/user/views/countViews/${id}`);
      setViewsCount(response.data.viewsCount);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }
  const fetchCountLikes = async () => {
    try {
      const response = await axios.get(`/api/user/likes/countLike/${id}`);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  }

  useEffect(() => {
    if (id != user.id) {
      axios.get(`/api/users/${id}`)
        .then(response => {
          setUser(response.data);
          setIsMyProfile(false);
        })
        .catch(error => {
          console.error("Error fetching user:", error);
          navigate('/404');
        });
    }
    else
      setIsMyProfile(true);
    fetchCountViews();
    fetchCountLikes();
  }, [id, user.id]);

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col md:w-[calc(100%-150px)] w-full">
        {/* this div under me is for the background color have fun :) */}
        <div className="w-full min-h-[250px] bg-gradient-to-r from-[#F02C56] to-[#FF6243]" />
        <div className="w-full flex md:flex-row flex-col justify-between px-4 relative py-8">
          <img src={`/api${user.profile_picture}`} alt="profile" className="md:absolute mx-auto mb-8 md:-top-14 md:left-4 w-[200px] h-[200px] rounded-3xl" />
          {/* this div under me is for the container who container both infos, rates, viewss and likes, edit profile.*/}
          <div className="flex w-full md:flex-row max-sm:flex-col md:justify-between justify-around items-center">
            <div className="md:ml-60 max-sm:items-center max-sm:flex-col max-sm:flex">
              <div className="text-[24px] font-semibold">{user.firstname} {user?.lastname}</div>
              <div className="text-[17px] text-gray-500">{user?.email}</div>
              <div className="my-3">
                {!isMyProfile &&
                  <button className="bg-[#F02C56] text-white px-4 py-2 rounded-md mr-2">Like</button>
                }
                {isMyProfile &&
                  <>
                    {isUpdateModalOpen && <UpdateProfileModal user={user} closeModal={handleUpdateModal} />}
                    <button onClick={() => handleUpdateModal()} className="bg-[#ff6b4e] text-white px-4 py-2 rounded-md"> Edit Profile</button>
                  </>
                }
              </div>
            </div>
            <div className="flex flex-col items-end max-sm:items-center max-sm:mt-8">
              {/* fame rating should be in a separate component that take the user as a prop */}
              <div className="flex mb-6 text-[#F02C56]">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <div className="flex">
                <div className="flex mr-10 flex-col justify-center items-center">
                  <span className="text-[24px] font-semibold">Views</span>
                  <span className="text-gray-500">{viewsCount}</span>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <span className="text-[24px] font-semibold">Likes</span>
                  <span className="text-gray-500">{likesCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ProfileSectionContent user={user} isMyProfile={isMyProfile} />
      </div>
    </div>
  )
}

export default Profile