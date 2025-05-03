import { FaStar } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import LocationPicker from "@/components/map/LocationPicker";
import ProfileSectionContent from "@/components/Profile/ProfileSectionContent";
import { UserX, Unlock } from 'lucide-react';
import useSocket from "@/hooks/useSocket"
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
  // const [microSconds, setMicroSeconds] = useState(0);
  const [isMyProfile, setIsMyProfile] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const { socket, isConnected } = useSocket('/chat')
  const [isOnline, setIsOnline] = useState(false);
  

   // Open and close modal handlers
   const openModal = () => setIsOpen(true);
   const closeModal = () => setIsOpen(false);

   const calculateFameRating = (views: number, likes: number) => {
    return (likes * 5) + (views * 1); // you can tune 5 and 1 later
  }
  

  const handleUpdateModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };

  // Handle socket events
  // useEffect(() => {
  //   if (!socket || isMyProfile) return;
  
  //   const handleUserOnline = (userId) => {
  //     if (userId === id) {
  //       setIsOnline(true);
  //     }
  //   };
  
  //   const handleUserOffline = (userId) => {
  //     if (userId === id) {
  //       setIsOnline(false);
  //     }
  //   };
  
  //   // Check initial online status when component mounts
  //   socket.emit("get_online_status", null, (response) => {
  //     if (response.onlineUsers.includes(id)) {
  //       setIsOnline(true);
  //     }
  //   });
  
  //   socket.on("user_online", handleUserOnline);
  //   socket.on("user_offline", handleUserOffline);
  
  //   return () => {
  //     socket.off("user_online", handleUserOnline);
  //     socket.off("user_offline", handleUserOffline);
  //   };
  // }, [socket, id, isMyProfile]);
  
  // Format last login time
  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return "Never logged in";
    
    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now - lastLoginDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - lastLoginDate) / (1000 * 60));
      return `Last login: ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `Last login: ${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Last login: ${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  const fetchUser = async () => {
    console.log("user id fetched successfuly :)")
    axios.get(`/api/users/${id}`)
      .then(response => {
        console.log("user in fetch with id: ", response.data);
        setUser(response.data);
        // setMicroSeconds(new Date().getTime() * 1000);
      })
      .catch(error => {
        console.error("Error fetching user:", error);
        navigate('/404');
      });
  }

  // block user logic case.
  const handleUnblock =  () => {
    
    setIsConfirming(true);
  };

  const confirmUnblock = async () => {
    await axios.post(`/api/user/block/remove`, {
      blocked_id: id,
      blocker_id: auth.user.id,
  })
    setIsBlocked(false);
    setIsConfirming(false);
    fetchUser();
  };
  
  const cancelUnblock = () => {
    setIsConfirming(false);
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

  const isBlockedFunc = async () => {
    const reponse = await axios.get(`/api/user/block/isBlocked/`, { params: {blocker_id: auth.user.id ,blocked_id: id } });
    if (reponse.data.isBlocked) {
      console.log("user is blocked");
      setIsBlocked(true);
    }
    else {
      console.log("user is not blocked");
      setIsBlocked(false);
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
    fetchUser();
    if (id != auth.user.id) {
      setIsMyProfile(false);
      isBlockedFunc();
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
    <div className="flex h-full w-full justify-center">
      <div className={`flex flex-col md:w-[calc(100%-150px)] w-full ${isBlocked ? "h-full justify-center items-center" : ""}`}>
        {
          isBlocked ? (
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-4 rounded-full">
            <UserX size={64} className="text-red-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Blocked User</h2>
        
        <p className="text-gray-600 mb-8">
          You've blocked this user. You can't view their profile or interact with their content.
        </p>
        
        {!isConfirming ? (
          <button
            onClick={handleUnblock}
            className="flex items-center justify-center w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            <Unlock size={20} className="mr-2" />
            Unblock User
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700 font-medium">Are you sure you want to unblock this user?</p>
            <div className="flex space-x-3">
          <button
            onClick={cancelUnblock}
            className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={confirmUnblock}
            className="flex-1 py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Unblock
          </button>
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-6">
          You can manage all blocked users in your <a href="/blocks" className="text-blue-500 hover:underline">block list</a>.
        </p>
          </div>
          ) : (
        <>
        {/* this div under me is for the background color have fun :) */}
        <div className="w-full min-h-[250px] bg-gradient-to-r from-[#F02C56] to-[#FF6243]" />
        <div className="w-full flex md:flex-row flex-col justify-between px-4 relative py-8">
        <div className="group">
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
          <div className="flex items-center text-[17px] text-gray-500">
           {!isMyProfile && (
              <>
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                {isOnline ? 'Online' : `Offline - ${formatLastLogin(user.last_login)}`}
              </>
            )}
           </div>
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
                  onBlockeUser={fetchUser}
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
          </>
      )
        }
      </div>
    </div>
  )
}

export default Profile