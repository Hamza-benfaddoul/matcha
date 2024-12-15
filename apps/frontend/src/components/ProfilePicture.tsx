import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactModal from "react-modal";



// const ProfilePicture  = () => {
//     const { auth } = useAuth();
//     const [images, setImages] = useState<any[]>([]);

//     const fetchImages = async (userId: string) => {
//         try {
//             console.log("Fetching images for user ID:", userId);
//             const response = await axios.get(`/api/images/${userId}`);
//             console.log("Response data:", response.data);
//             setImages(response.data);
//         } catch (error) {
//             console.error("Error fetching images:", error);
//         }
//     };

//     useEffect(() => {
//         if (auth?.user.id) {
//             fetchImages(auth.user.id);
//         }
//     }, [auth]);

//     return (
//         <div className="flex w-full justify-between gap-4 p-4 flex-wrap">
//             {
//             images.map((image, index) => (
//                 <div key={index}>
//                     <img className="w-48 h-48" src={`http://localhost/api${image.image_url}`} alt="photo" />
//                 </div>
//             ))
//             }
//         </div>
//     )
// }
// export default ProfilePicture;

const ProfilePicture = () => {
    const { auth } = useAuth();
    const [images, setImages] = useState<any[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const fetchImages = async (userId: string) => {
        try {
            console.log("Fetching images for user ID:", userId);
            const response = await axios.get(`/api/images/${userId}`);
            console.log("Response data:", response.data);
            setImages(response.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        if (auth?.user.id) {
            fetchImages(auth.user.id);
        }
    }, [auth]);

    return (
        <div className="flex w-full justify-between gap-4 p-4 flex-wrap">
            {images.map((image, index) => (
            <div key={index} onClick={() => setSelectedImage(`http://localhost/api${image.image_url}`)}>
                <img className="w-48 h-48 cursor-pointer" src={`http://localhost/api${image.image_url}`} alt="photo" />
            </div>
            ))}
            {selectedImage && (
            <ReactModal
                isOpen={!!selectedImage}
                onRequestClose={() => setSelectedImage(null)}
                contentLabel="Image Modal"
                className="modal"
                overlayClassName="overlay"
            >
                <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 text-white">X</button>
                <img src={selectedImage} alt="Selected" className="w-full h-full object-contain" />
            </ReactModal>
            )}
        </div>
    );
};

export default ProfilePicture;