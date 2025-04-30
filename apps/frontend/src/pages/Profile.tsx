import { FaStar } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import LocationPicker from "@/components/map/LocationPicker";
import ProfileSectionContent from "@/components/Profile/ProfileSectionContent";
// @ts-ignore
import Modal from "react-modal";
import UpdateProfileModal from "@/components/Profile/UpdateProfile";
import { FameStars } from "@/components/Profile/FameStars";
import { UserActionsDropdown } from "@/components/Profile/UserActionDropDown";
// Bind modal to your app root element (important for accessibility)
Modal.setAppElement("#root");


function Profile() {
  const { auth } = useAuth();
  const [user, setUser] = useState<any>(auth.user);
  const [isMyProfile, setIsMyProfile] = useState(true);
  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);

   // Open and close modal handlers
   const openModal = () => setIsOpen(true);
   const closeModal = () => setIsOpen(false);

   const calculateFameRating = (views: number, likes: number) => {
    return (likes * 5) + (views * 1); // you can tune 5 and 1 later
  }
  

  const handleUpdateModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(`/api/images/update-image/profile/${user.id}`, formData, {
          headers: {
            withCredentials: true,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Profile image updated successfully:", response.data);
        // Optionally reset the input
        e.target.value = '';
        // Update the user's profile picture in the state
        setUser((prevUser) => ({
          ...prevUser,
          profile_picture: response.data.filePath,
        }));
      } catch (error) {
        console.error("Error updating profile image:", error);
      }
    }
  };

  const isLikedFunc = async () => {
    try {
      const response = await axios.get(`/api/user/likes/isLiked/`, { params: { likedId: id } });
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error("Error checking if user is liked:", error);
    }
  }

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

  const addLike = async () => {
    try {
      await axios.post(`/api/user/likes/`, { likedId: id, views: viewsCount, likes: likesCount });
      fetchCountLikes();
      isLikedFunc();
    } catch (error) {
      console.error("Error liking user:", error);
    }
  }

  const removeLikefunc = async () => {
    try {
      await axios.post(`/api/user/likes/remove/`,  { likedId: id });
      fetchCountLikes();
      isLikedFunc();
      console.log("unlike user with id: ", id);
    } catch (error) {
      console.error("Error unliking user:", error);
    }
  }

  const updateImageProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("image", user.profile_picture);
      formData.append("isProfileImage", "true");
      const response = await axios.post(`/api/images/add-image/${user.id}`, formData, {
        headers: {
          withCredentials: true,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response in update image profile: ", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

//isLiked
  useEffect(() => {
    axios.get(`/api/users/${id}`)
      .then(response => {
        console.log("user in fetch with id: ", response.data);
        setUser(response.data);
      })
      .catch(error => {
        console.error("Error fetching user:", error);
        navigate('/404');
      });


    if (id != auth.user.id) {
      setIsMyProfile(false);
    }
    else
      setIsMyProfile(true);
    if ( id != auth.user.id) {
      const viewResponse = axios.post(`/api/user/views/add-view`, { viewedId: id });
    }
    fetchCountViews();
    fetchCountLikes();
    isLikedFunc();
    closeModal();
  }, [id, user.id, auth.user]);


  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col md:w-[calc(100%-150px)] w-full">
        {/* this div under me is for the background color have fun :) */}
        <div className="w-full min-h-[250px] bg-gradient-to-r from-[#F02C56] to-[#FF6243]" />
        <div className="w-full flex md:flex-row flex-col justify-between px-4 relative py-8">
        <div className="group">
        {/* src={
                    image.image_url.startsWith("/")
                        ? `/api${image.image_url}`
                        : image.image_url
                    } 
                     {`/api${user.profile_picture}`}
                     */}
          <img src={user.profile_picture.startsWith("/")
                        ? `/api${user.profile_picture}`
                        : user.profile_picture
                    } alt="profile" className="md:absolute mx-auto mb-8 md:-top-14 md:left-4 w-[200px] h-[200px] rounded-3xl" />
          { id == auth.user.id &&
            <div 
              onClick={handleClick}
              className="md:absolute mx-auto mb-8 md:-top-14 md:left-4 w-[200px] h-[200px] bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl cursor-pointer"
              >
                <FaCamera className="text-white text-3xl" />
            </div>
          }
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
          {/* this div under me is for the container who container both infos, rates, viewss and likes, edit profile.*/}
          <div className="flex w-full md:flex-row max-sm:flex-col md:justify-between justify-around items-center">
            <div className="md:ml-60 max-sm:items-center max-sm:flex-col max-sm:flex">
              <div className="text-[24px] font-semibold">{user.firstname} {user?.lastname}</div>
              <div className="text-[17px] text-gray-500">{user?.email}</div>
              <div className="my-3">
                {!isMyProfile ? (
                  isLiked ? 
                  <button onClick={removeLikefunc} className="bg-[#F02C56] text-white px-4 py-2 rounded-md mr-2">Unlike</button> 
                  : 
                  <button onClick={addLike} className="bg-[#F02C56] text-white px-4 py-2 rounded-md mr-2">Like</button>
                ) : null}
                  {isMyProfile &&
                  <div>
                    <div className="flex gap-2">
                      <button onClick={openModal} className="bg-[#ff6b4e] text-white px-4 rounded-md"> Edit Profile</button>
                      <LocationPicker />
                    </div>
                    <Modal
                      isOpen={isOpen}
                      onRequestClose={closeModal}
                      contentLabel="Update Profile Modal"
                      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                      className="bg-white rounded-lg overflow-x-auto max-h-[600px] shadow-lg w-11/12 max-w-md"
                    >
                      <UpdateProfileModal closeModal={closeModal} />
                    </Modal>
                  </div>
                }
              </div>
            </div>
            <div className="flex flex-col items-end max-sm:items-center max-sm:mt-8">
              {/* fame rating should be in a separate component that take the user as a prop */}
              <div className="flex mb-6 gap-3 text-[#F02C56]">
                <FameStars fameRating={auth.user.fame_rating} />
                {
                  id != auth.user.id && (
                    // In your parent component where you use the dropdown
                    <>
                        <UserActionsDropdown 
                        reporterId={auth.user.id} 
                        reportedId={id}
                        onReportSubmit={async (data) => {
                            console.log("Report submitted:", data); 
                          }}
                        />
                      {/* <h1>123</h1> */}
                    </>
                  )
                }
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