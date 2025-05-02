import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
// @ts-ignore
import ReactModal from "react-modal";
import { X } from "lucide-react";



interface ProfilePictureProps {
    idUser: string;
    IsProfilePicture: boolean;
}

const ProfilePicture = ({idUser, IsProfilePicture} : ProfilePictureProps) => {
    const [images, setImages] = useState<any[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { id } = useParams();
    const { auth } = useAuth();

    const fetchImages = async (userId: string) => {
        try {
            const response = await axios.get(`/api/images/${userId}`);
            console.log("Fetched images:", response.data);
            setImages(response.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    interface AddImageEvent extends React.ChangeEvent<HTMLInputElement> {}

    const AddImage = async (e: AddImageEvent): Promise<void> => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.append("image", e.target.files[0]);
            formData.append("isProfileImage", "false"); // Add this if you want to specify it's not a profile image
            try {
                const response = await axios.post<{ idUser: string; image_url: string }>(`/api/images/add-image/${idUser}`, formData, {
                    headers: {
                        withCredentials: true,
                        "Content-Type": "multipart/form-data",
                    },
                });
                // setImages((prevImages) => [...prevImages, response.data]);
                fetchImages(idUser);
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    }

    const deleteImage = async (imageId: string) => {
        try {
            await axios.delete(`/api/images/${idUser}/${imageId}`);
            setImages(images.filter((image) => image.id !== imageId));
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    useEffect(() => {
        if (idUser) {
            fetchImages(idUser);
        }
    }, [idUser, IsProfilePicture]);

    return (
        <div className={`flex w-full  gap-4 p-4 flex-wrap max-sm:flex-col max-sm:items-center max-sm:justify-center`}>
            {images.map((image, index) => (
            <div className="relative" key={index} onClick={() => setSelectedImage(`http://localhost:8080/api${image.image_url}`)}>
                {
                    (!image.is_profile_picture && auth.user.id == id) && (
                        <X className="absolute bg-red-400 z-50 top-2 right-2 w-6 h-6 text-white cursor-pointer" onClick={() => deleteImage(image.id)} />
                    )
                }
                {/* <img className="w-52 h-52 cursor-pointer" src={`/api${image.image_url}`} alt="photo" /> */}
                <img className="w-52 h-52 cursor-pointer" src={
                    image.image_url.startsWith("/")
                        ? `/api${image.image_url}`
                        : image.image_url
                    } alt="profile-photo" />
            </div>
            ))}
            {
                ( id == auth.user.id && images.length < 5) && (
                    <div className="w-52 h-52 bg-gray-200 flex items-center justify-center cursor-pointer">
                        <label htmlFor="upload" className="text-gray-500 text-4xl">+</label>
                        <input 
                            type="file" 
                            id="upload" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={AddImage}
                        />
                    </div>
                )
            }
            {/* {selectedImage && (
            <ReactModal
                isOpen={!!selectedImage}
                onRequestClose={() => setSelectedImage(null)}
                contentLabel="Image Modal"
                className="modal absolute p-16 top-1/2 left-1/2 transform w-full h-full bg-black bg-opacity-75 -translate-x-1/2 -translate-y-1/2 "
                overlayClassName="overlay bg-black bg-opacity-75"
            >
                <button onClick={() => setSelectedImage(null)} className="absolute top-6 text-2xl right-8 text-white">X</button>
                <img src={selectedImage} alt="Selected" className="w-[100%] h-[100%] object-contain" />
            </ReactModal>
            )} */}
        </div>
    );
};

export default ProfilePicture;
