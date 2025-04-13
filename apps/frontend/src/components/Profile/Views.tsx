import axios from "axios";
import { useEffect, useState } from "react";

interface ViewsProps {
    id: string;
}

const Views = ({id}: ViewsProps) => {
    const [users, setUsers] = useState<any[]>(() => []);

    const fetchViewers = async () => {
        try {
            const response = await axios.get(`/api/user/views/${id}`);
            setUsers(response.data.views);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchViewers();
        }
    }, [id]);

    return (
        <div>
            {
                users.length == 0 ? <p className="p-4">No views yet</p> :
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
export default Views;
