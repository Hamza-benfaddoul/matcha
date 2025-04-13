import { useEffect, useState } from "react";
import axios from "axios";
// @ts-ignore
import ReactModal from "react-modal";


interface ProfilePictureProps {
    id: string;
}

const ProfilePicture = ({id} : ProfilePictureProps) => {
    const [images, setImages] = useState<any[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const fetchImages = async (userId: string) => {
        try {
            const response = await axios.get(`/api/images/${userId}`);
            setImages(response.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchImages(id);
        }
    }, [id]);

    return (
        <div className={`flex w-full  gap-4 p-4 flex-wrap max-sm:flex-col max-sm:items-center max-sm:justify-center`}>
            {images.map((image, index) => (
            <div key={index} onClick={() => setSelectedImage(`http://localhost:8080/api${image.image_url}`)}>
                <img className="w-52 h-52 cursor-pointer" src={`http://localhost:8080/api${image.image_url}`} alt="photo" />
            </div>
            ))}
            {selectedImage && (
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
            )}
        </div>
    );
};

export default ProfilePicture;
