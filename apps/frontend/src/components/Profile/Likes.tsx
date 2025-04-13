import axios from "axios";
import { useEffect, useState } from "react";


interface LikesProps {
    id: string;
}

const Likes = ({ id }: LikesProps) => {
    const [users, setUsers] = useState<any[]>(() => []);

    const fetchLikes = async () => {
        try {
            const response = await axios.get(`/api/user/likes/${id}`);
            setUsers(response.data.likes);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchLikes();
        }
    }, [id]);

    return (
        <div>
            { users.length == 0 ? <p className="p-4">No likes yet</p> :
                users.map((user, index) => (
                <div key={index} className="flex items-center w-full p-2 border-b cursor-pointer hover:bg-gray-100" onClick={() => window.location.href = `/profile/${user.id}`}>
                    <img src={`http://localhost:8080/api${user.profile_picture}`} alt={`${user.firstname} ${user.lastname}`} className="w-12 h-12 rounded-full mr-4" />
                    <div className="flex flex-col">
                    <span className="font-bold">{user.firstname} {user.lastname}</span>
                    <span className="text-gray-600">Gender: {user?.gender}</span>
                    <span className="text-gray-600">Preferences: {user.sexual_preferences}</span>
                    </div>
                </div>
                ))
            }
        </div>
    )
}
export default Likes;
