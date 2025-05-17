import { Heart, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  gender: string;
  sexual_preferences: string;
  profile_picture: string | null;
  biography: string;
  fame_rating: number;
  location_latitude: number;
  location_longitude: number;
  age: number;
  distance: number;
  tags: string[];
}

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="relative h-60 overflow-hidden">
        <img
          src={
            user.profile_picture.startsWith("/")
              ? `/api${user.profile_picture}`
              : user.profile_picture
          }
          alt={user.username}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>{user.fame_rating}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-rose-400"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">
              {user.firstname} {user.lastname}
            </h3>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>•</span>
              <span>{user.age} years</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{user.distance} km away</span>
            </div>
          </div>
        </div>

        <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {user.biography}
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {user.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {user.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{user.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/profile/${user.id}`} className="w-full">
          <Button className="w-full bg-rose-500 hover:bg-rose-600">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
