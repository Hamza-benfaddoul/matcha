import { useEffect, useState } from "react";
import ProfileForm from "./ProfileFrom";
import { User } from "@/types/User";
import useAuth from "@/hooks/useAuth";
import axios from "axios";

interface UpdateProfileModalProps {
closeModal: () => void;
}

const UpdateProfileModal = ({ closeModal }: UpdateProfileModalProps) => {
  const [initialData, setInitialData] = useState<User | undefined>(undefined);
  const { auth } = useAuth();
  const user = auth.user;
  const userId = user?.id;

  const [images, setImages] = useState<File[]>([]);

    const fetchImages = async () => {
        try {
            const response = await axios.get(`/api/images/${userId}`);
            setImages(response.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        if (userId) {
            // fetchImages();
          }
        }, [userId]);
        
    useEffect(() => {
      // if (user && images.length > 0) {
        // setInitialData({ ...user });
      // }
      setInitialData({ ...user });
    }, [initialData?.id]);

  return (
          <>
            <div className="relative">
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-1 top-1 px-3 py-2 rounded"
                >
                X
              </button>
            
            <ProfileForm initialData={initialData} closeModal={closeModal} endpoint="/api/profile/update" />
            </div>
          </>
  );
};

export default UpdateProfileModal;
