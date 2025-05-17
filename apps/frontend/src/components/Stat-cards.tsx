import { useEffect, useState } from "react";
import { axiosPrivate } from "@/api/axios";
import { Heart, Users, Eye, Star } from "lucide-react";

interface State {
  famerating: number;
  likes: number;
  views: number;
  friends: number;
}

const StatCards = () => {
  const [state, setState] = useState<State | []>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await axiosPrivate.get("/user/state");
        setState(response.data);
      } catch (error) {
        console.error("Failed to load dates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchState();
  }, []);
  console.log(state);

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="space-y-1 rounded-lg border p-3">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium">Fame Rating</span>
        </div>
        <p className="text-2xl font-bold">{state.famerating}</p>
        <p className="text-xs text-gray-500">
          {state.famerating > 10
            ? "Top 20% of users"
            : state.famerating > 0
              ? "Top 5% of users"
              : "No rating yet"}
        </p>
      </div>
      <div className="space-y-1 rounded-lg border p-3">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-500" />
          <span className="text-sm font-medium">Likes</span>
        </div>
        <p className="text-2xl font-bold">{state.likes}</p>
        <p className="text-xs text-gray-500">
          {" "}
          {state.likes > 2
            ? "+2 this week"
            : state.likes > 0
              ? "+1 this week"
              : "No new likes"}
        </p>
      </div>
      <div className="space-y-1 rounded-lg border p-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Profile Views</span>
        </div>
        <p className="text-2xl font-bold">{state.views}</p>
        <p className="text-xs text-gray-500">
          {state.views > 0 ? "+1 this week" : "No new views"}
        </p>
      </div>
      <div className="space-y-1 rounded-lg border p-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Friends</span>
        </div>
        <p className="text-2xl font-bold">{state.friends}</p>
        <p className="text-xs text-gray-500">
          {state.friends > 0 ? "+1 this week" : "No new friends"}
        </p>
      </div>
    </div>
  );
};

export default StatCards;
