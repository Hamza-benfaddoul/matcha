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
                <div className="flex items-center w-full p-2 border-b cursor-pointer hover:bg-gray-100" onClick={() => window.location.href = `/profile/${user.id}`}>
                    <div key={index} className="flex items-center w-full">
                        <img src={`http://localhost:8080/api${user.profile_picture}`} alt={`${user.firstname} ${user.lastname}`} className="w-12 h-12 rounded-full mr-4" />
                        <div className="flex flex-col">
                        <span className="font-bold">{user.firstname} {user.lastname}</span>
                        <span className="text-gray-600">Gender: {user?.gender}</span>
                        <span className="text-gray-600">Preferences: {user.sexual_preferences}</span>
                        </div>
                    </div>
                    <div className="text-gray-500 text-sm flex items-center w-[200px] justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 4h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(user.liked_at).toLocaleString()}
                    </div>
                </div>
                ))
            }
        </div>
    )
}
export default Likes;
