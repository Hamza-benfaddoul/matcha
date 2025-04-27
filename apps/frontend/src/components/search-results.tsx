"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { FilterState } from "@/components/search-filters";
import { axiosPrivate } from "@/api/axios";
import useAuth from "@/hooks/useAuth";

interface User {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  username: string;
  gender: string;
  sexual_preferences: string;
  profile_picture?: string | null;
  biography?: string | null;
  fame_rating: number;
  location_latitude: number;
  location_longitude: number;
  age: number;
  distance: number;
  tags?: string[];
}

interface SearchResultsProps {
  query: string;
  filters?: FilterState;
}

export default function SearchResults({ query, filters }: SearchResultsProps) {
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { auth } = useAuth();
  const user = auth?.user;

  useEffect(() => {
    const fetchResults = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        console.log("filters", filters);
        const response = await axiosPrivate.post(`/search/${user.id}`, {
          query,
          ageRange: filters?.ageRange || [0, 50],
          fameRange: filters?.fameRange || [0, 100],
          distance: filters?.distance || -1,
          tags: filters?.tags || [],
          sort: { field: "fame_rating", direction: "desc" },
        });
        console.log("Search results:", response.data);

        // Ensure all required fields have fallback values
        const processedResults = response.data.users.map((user: User) => ({
          ...user,
          firstName: user.firstname || "Unknown",
          lastName: user.lastname || "User",
          profile_picture: user.profile_picture || null,
          biography: user.biography || "",
          tags: user.tags || [],
          distance: user.distance || 0,
          age: user.age || 0,
        }));

        setResults(processedResults);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to load search results");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, filters, user?.id]);

  const hasActiveFilters = (filters?: FilterState) => {
    if (!filters) return false;
    return (
      filters.tags.length > 0 ||
      filters.ageRange[0] !== 18 ||
      filters.ageRange[1] !== 50 ||
      filters.distance !== 50
    );
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <p className="text-sm text-muted-foreground mt-2">Searching...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          {query.trim() === "" && !hasActiveFilters(filters)
            ? "Enter a search query or adjust filters"
            : "No results found"}
        </p>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
        {results.length} {results.length === 1 ? "result" : "results"} found
      </div>
      <div className="divide-y">
        {results.map((user) => {
          const firstNameInitial = user.firstName?.charAt(0) || "U";
          const lastNameInitial = user.lastName?.charAt(0) || "U";

          return (
            <a
              key={user.id}
              href={`/profile/${user.id}`}
              className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-10 w-10 border">
                <AvatarImage
                  src={
                    user.profile_picture.startsWith("/")
                      ? `/api${user.profile_picture}`
                      : user.profile_picture
                  }
                  alt={user.username}
                />
                <AvatarFallback>
                  {firstNameInitial}
                  {lastNameInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">
                    {user.firstName || "Unknown"} {user.lastName || "User"},{" "}
                    {user.age}
                  </p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {user.distance.toFixed(1)} km
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-1 overflow-hidden">
                  {user.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {user.tags && user.tags.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{user.tags.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
      {results.length > 0 && (
        <div className="p-3 border-t">
          <a
            href={`/search?q=${encodeURIComponent(query)}`}
            className="block w-full text-center text-sm text-primary hover:underline"
          >
            View all results
          </a>
        </div>
      )}
    </div>
  );
}
