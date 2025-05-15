import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserCard from "@/components/user-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FilterState } from "@/components/search-filters";
import SearchFilters from "@/components/search-filters";

import { axiosPrivate } from "@/api/axios";
import useAuth from "@/hooks/useAuth";

// Types
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
  birth_date?: string; // Make optional if needed
  age: number;
  distance: number;
  tags: string[];
  shared_tags_count?: number;
}
interface SortOption {
  field: "age" | "fame_rating" | "distance";
  direction: "asc" | "desc";
}

interface AdvancedSearchProps {
  initialQuery?: string;
  initialFilters?: FilterState;
}

export default function AdvancedSearch({
  initialQuery = "",
  initialFilters,
}: AdvancedSearchProps) {
  // State for filters
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      ageRange: [0, 100],
      fameRange: [0, 100],
      distance: -1,
      tags: [],
    },
  );

  // State for search query
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // State for search results
  const [users, setUsers] = useState<User[]>([]);
  const { auth } = useAuth();
  const user = auth?.user;

  // State for sort option
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "fame_rating",
    direction: "desc",
  });

  // State for view type (grid or list)
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  // State for filter sheet
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Add this after the state declarations
  useEffect(() => {
    if (initialQuery || (initialFilters && hasActiveFilters(initialFilters))) {
      handleSearch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper function to check if any filters are active
  const hasActiveFilters = (filters: FilterState) => {
    return (
      filters.tags?.length > 0 ||
      filters.ageRange?.[0] !== 0 ||
      filters.ageRange?.[1] !== 100 ||
      filters.distance !== -1
    );
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 50) count++;
    if (filters.fameRange[0] !== 0 || filters.fameRange[1] !== 100) count++;
    if (filters.distance !== 50) count++;
    count += filters.tags.length;
    return count;
  };

  // Handle search submission
  const handleSearch = async () => {
    setIsLoading(true);

    try {
      const response = await axiosPrivate.post(`/search/${user?.id}`, {
        query: searchQuery,
        ageRange: filters.ageRange,
        fameRange: filters.fameRange,
        distance: filters.distance,
        tags: filters.tags,
        sort: sortOption,
      });

      setUsers(response.data.users);
      setIsLoading(false);
      setShowFilterSheet(false);
    } catch (error) {
      console.error("Error searching users:", error);
      setIsLoading(false);
      setShowFilterSheet(false);
    }
  };
  // Handle sort change
  const handleSortChange = (value: string) => {
    const [field, direction] = value.split("-") as [
      SortOption["field"],
      SortOption["direction"],
    ];
    setSortOption({ field, direction });

    // Re-sort current results
    if (users.length > 0) {
      const sortedUsers = [...users].sort((a, b) => {
        if (direction === "asc") {
          return a[field] - b[field];
        } else {
          return b[field] - a[field];
        }
      });

      setUsers(sortedUsers);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const search = async () => {
      try {
        const response = await axiosPrivate.post(`/search/${user?.id}`, {
          query: searchQuery,
          ageRange: filters.ageRange,
          fameRange: filters.fameRange,
          distance: filters.distance,
          tags: filters.tags,
          sort: sortOption,
        });
        setUsers(response.data.users);
        setIsLoading(false);
        setShowFilterSheet(false);
      } catch (error) {
        console.error("Error searching users:", error);
        setIsLoading(false);
        setShowFilterSheet(false);
      }
    };
    search();
  }, []);

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <div className="flex items-center rounded-full border bg-background overflow-hidden shadow-sm">
            <div className="flex-shrink-0 pl-3">
              <Search className="text-muted-foreground h-4 w-4" />
            </div>

            <Input
              placeholder="Search by location or name..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 mr-1"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className={`flex items-center gap-2 ${
                hasActiveFilters(filters)
                  ? "border-rose-500 text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-600"
                  : ""
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters(filters) && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-rose-500 text-white">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Advanced Filters</SheetTitle>
              <SheetDescription>
                Refine your search with specific criteria
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6">
              <SearchFilters
                filters={filters}
                onFilterChange={setFilters}
                onApply={handleSearch}
              />
            </div>
          </SheetContent>
        </Sheet>

        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 shadow-sm"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters(filters) && (
        <div className="flex flex-wrap gap-2 items-center p-3 bg-muted/30 rounded-lg border border-muted">
          <span className="text-sm font-medium">Active filters:</span>

          {filters.ageRange[0] !== 18 || filters.ageRange[1] !== 50 ? (
            <Badge className="flex items-center gap-1 bg-white shadow-sm border">
              Age: {filters.ageRange[0]}-{filters.ageRange[1]}
              <X
                className="h-3 w-3 cursor-pointer ml-1"
                onClick={() => setFilters({ ...filters, ageRange: [18, 50] })}
              />
            </Badge>
          ) : null}

          {filters.fameRange[0] !== 0 || filters.fameRange[1] !== 100 ? (
            <Badge className="flex items-center gap-1 bg-white shadow-sm border">
              Fame: {filters.fameRange[0]}-{filters.fameRange[1]}
              <X
                className="h-3 w-3 cursor-pointer ml-1"
                onClick={() => setFilters({ ...filters, fameRange: [0, 100] })}
              />
            </Badge>
          ) : null}

          {filters.distance !== 50 ? (
            <Badge className="flex items-center gap-1 bg-white shadow-sm border">
              Distance: {filters.distance}km
              <X
                className="h-3 w-3 cursor-pointer ml-1"
                onClick={() => setFilters({ ...filters, distance: 50 })}
              />
            </Badge>
          ) : null}

          {filters.tags.map((tag) => (
            <Badge
              key={tag}
              className="flex items-center gap-1 bg-white shadow-sm border"
            >
              {tag}
              <X
                className="h-3 w-3 cursor-pointer ml-1"
                onClick={() =>
                  setFilters({
                    ...filters,
                    tags: filters.tags.filter((t) => t !== tag),
                  })
                }
              />
            </Badge>
          ))}

          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-xs text-muted-foreground hover:text-foreground"
            onClick={() =>
              setFilters({
                ageRange: [0, 100],
                fameRange: [0, 100],
                distance: -1,
                tags: [],
              })
            }
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Results Section */}
      {users.length > 0 && (
        <div className="space-y-4">
          <div className="">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Results ({users.length})
              </h2>

              {/* Sort Options */}
              <Select
                value={`${sortOption.field}-${sortOption.direction}`}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="age-asc">Age (Youngest first)</SelectItem>
                  <SelectItem value="age-desc">Age (Oldest first)</SelectItem>
                  <SelectItem value="fame_rating-desc">
                    Fame (Highest first)
                  </SelectItem>
                  <SelectItem value="fame_rating-asc">
                    Fame (Lowest first)
                  </SelectItem>
                  <SelectItem value="distance-asc">
                    Distance (Nearest first)
                  </SelectItem>
                  <SelectItem value="distance-desc">
                    Distance (Furthest first)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Type Toggle */}
            <Tabs
              value={viewType}
              onValueChange={(v) => setViewType(v as "grid" | "list")}
            >
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>

              {/* Grid View */}
              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </TabsContent>

              {/* List View */}
              <TabsContent value="list" className="mt-0">
                <div className="space-y-4 ">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-4 p-4 bg-background rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={
                            user.profile_picture.startsWith("/")
                              ? `/api${user.profile_picture}`
                              : user.profile_picture
                          }
                          alt={user.username}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">
                          {user.firstname} {user.lastname}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{user.age} years</span>
                          <span>•</span>
                          <span>{user.distance} km away</span>
                          <span>•</span>
                          <span>Fame: {user.fame_rating}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Link to={`/profile/${user.id}`}>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 shadow-sm"
                        >
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Empty State */}
      {users.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
          <h3 className="text-lg font-medium">No matches found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your filters to find more matches
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              setFilters({
                ageRange: [0, 50],
                fameRange: [0, 100],
                distance: -1,
                tags: [],
              })
            }
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div
            className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-rose-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="text-muted-foreground mt-4">Searching for matches...</p>
        </div>
      )}
    </div>
  );
}
