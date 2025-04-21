import React, { useState, useEffect } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, User, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { axiosPrivate } from "@/api/axios";
import useAuth from "@/hooks/useAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface Profile {
  id: number;
  username: string | null;
  gender: string;
  fame_rating: number;
  profile_picture: string;
  location_latitude: string;
  location_longitude: string;
  shared_tags_count: string;
  distance: string;
}

interface Filters {
  gender: string;
  minFame: string;
  maxFame: string;
  minDistance: string;
  maxDistance: string;
  sharedTagsMin: string;
  hasProfilePicture: boolean;
}

const MatchingProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { auth } = useAuth();
  const user = auth?.user;
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    gender: "",
    minFame: "",
    maxFame: "",
    minDistance: "",
    maxDistance: "",
    sharedTagsMin: "",
    hasProfilePicture: false,
  });

  const handleFilterChange = (key: keyof Filters, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      gender: "",
      minFame: "",
      maxFame: "",
      minDistance: "",
      maxDistance: "",
      sharedTagsMin: "",
      hasProfilePicture: false,
    });
  };

  const applyFilters = () => {
    setFilterLoading(true);

    const selected = profiles.filter((profile) => {
      const fame = profile.fame_rating;
      const distance = parseFloat(profile.distance);
      const tagsCount = parseInt(profile.shared_tags_count);

      if (filters.gender && profile.gender !== filters.gender) return false;
      if (filters.minFame && fame < parseInt(filters.minFame)) return false;
      if (filters.maxFame && fame > parseInt(filters.maxFame)) return false;
      if (filters.minDistance && distance < parseFloat(filters.minDistance))
        return false;
      if (filters.maxDistance && distance > parseFloat(filters.maxDistance))
        return false;
      if (filters.sharedTagsMin && tagsCount < parseInt(filters.sharedTagsMin))
        return false;
      if (filters.hasProfilePicture && !profile.profile_picture) return false;

      return true;
    });

    setSelectedProfiles(selected);
    setFilterLoading(false);
  };

  const fetchProfiles = async (page: number) => {
    try {
      setLoading(true);
      const limit = 2;
      const offset = page * limit;
      const response = await axiosPrivate(
        `/matching-profiles/${user?.id}?limit=${limit}&offset=${offset}`,
      );
      const fetchedProfiles = response.data.profiles as Profile[];

      setProfiles((prev) => [...prev, ...fetchedProfiles]);
      setHasMore(fetchedProfiles.length >= limit);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchProfiles(page);
  }, [user, page]);

  useEffect(() => {
    // Apply filters whenever profiles or filters change
    if (profiles.length > 0) {
      applyFilters();
    }
  }, [profiles, filters]);

  if (loading && profiles.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 space-y-4 p-4">
            <ScrollArea className="h-80">
              <div>
                <Label>Gender</Label>
                <Select
                  onValueChange={(value) => handleFilterChange("gender", value)}
                  value={filters.gender || undefined}
                >
                  <SelectTrigger className="w-full">
                    {filters.gender || "Select gender"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Min Fame</Label>
                <Input
                  type="number"
                  value={filters.minFame}
                  onChange={(e) =>
                    handleFilterChange("minFame", e.target.value)
                  }
                  placeholder="Enter min fame"
                />
              </div>
              <div>
                <Label>Max Fame</Label>
                <Input
                  type="number"
                  value={filters.maxFame}
                  onChange={(e) =>
                    handleFilterChange("maxFame", e.target.value)
                  }
                  placeholder="Enter max fame"
                />
              </div>

              <div>
                <Label>Min Distance (km)</Label>
                <Input
                  type="number"
                  value={filters.minDistance}
                  onChange={(e) =>
                    handleFilterChange("minDistance", e.target.value)
                  }
                  placeholder="Enter min distance"
                />
              </div>
              <div>
                <Label>Max Distance (km)</Label>
                <Input
                  type="number"
                  value={filters.maxDistance}
                  onChange={(e) =>
                    handleFilterChange("maxDistance", e.target.value)
                  }
                  placeholder="Enter max distance"
                />
              </div>

              <div>
                <Label>Min Shared Tags</Label>
                <Input
                  type="number"
                  value={filters.sharedTagsMin}
                  onChange={(e) =>
                    handleFilterChange("sharedTagsMin", e.target.value)
                  }
                  placeholder="Enter min shared tags"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Has Profile Picture</Label>
                <Switch
                  checked={filters.hasProfilePicture}
                  onCheckedChange={(checked) =>
                    handleFilterChange("hasProfilePicture", checked)
                  }
                />
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={applyFilters}
                  className="w-full"
                  size="sm"
                  variant="outline"
                  disabled={filterLoading}
                >
                  {filterLoading ? "Applying..." : "Apply Filters"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={resetFilters}
                  className="w-full"
                  size="sm"
                >
                  Reset Filters
                </Button>
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filterLoading ? (
          <div>Applying filters...</div>
        ) : selectedProfiles.length === 0 ? (
          <div className="col-span-full text-center py-8">
            No profiles match your current filters.
          </div>
        ) : (
          selectedProfiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden">
              <div className="relative aspect-[3/4]">
                <Link to={`/profile/${profile.id}`}>
                  <img
                    src={
                      profile.profile_picture.startsWith("/")
                        ? `/api${profile.profile_picture}`
                        : profile.profile_picture
                    }
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{profile.username}</h3>
                      <div className="flex items-center gap-1 text-xs">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {parseFloat(profile.distance).toFixed(1)} km away
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-rose-500">
                      {profile.shared_tags_count} Shared Tags
                    </Badge>
                  </div>
                </div>
              </div>
              <CardFooter className="flex justify-between p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <User className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {hasMore && !filterLoading && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={loading}
          >
            {loading ? "Loading more..." : "View More Matches"}
          </Button>
        </div>
      )}
    </>
  );
};

export default MatchingProfiles;
