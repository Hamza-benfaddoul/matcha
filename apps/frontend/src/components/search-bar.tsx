"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  MessageSquare,
  User,
  Menu,
  X,
  Heart,
  Filter,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import SearchFilters, { type FilterState } from "@/components/search-filters";
import SearchResults from "@/components/search-results";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [0, 100],
    fameRange: [0, 100],
    distance: -1,
    tags: [],
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Handle applying filters
  const handleApplyFilters = () => {
    setShowFilterPopover(false);
    // Here you would typically trigger a search with the new filters
  };

  // Focus search input when filter is applied
  useEffect(() => {
    if (!showFilterPopover && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showFilterPopover]);

  // Check if any filters are active
  const hasActiveFilters =
    filters.tags.length > 0 ||
    filters.ageRange[0] !== 0 ||
    filters.ageRange[1] !== 100 ||
    filters.distance !== -1;

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 50) count++;
    if (filters.fameRange[0] !== 0 || filters.fameRange[1] !== 100) count++;
    if (filters.distance !== 50) count++;
    count += filters.tags.length;
    return count;
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b  backdrop-blur ">
      <div className="container flex h-16 items-center">
        {/* Desktop Navigation */}
        <div className="flex-1 flex items-center justify-end md:justify-between">
          {/* Search Bar */}
          <div
            className={cn(
              "flex-1 transition-all duration-300 ease-in-out relative",
              isSearchOpen
                ? "md:mx-4 lg:mx-8 xl:mx-16"
                : "md:max-w-[200px] lg:max-w-[300px]",
            )}
          >
            <div className="relative">
              <div className="flex items-center">
                {/* Modern Search Input */}
                <div
                  className={cn(
                    "flex items-center w-full rounded-md border bg-background transition-all overflow-hidden",
                    isSearchOpen ? "shadow-md" : "",
                  )}
                >
                  <div className="flex-shrink-0 pl-3">
                    <Search
                      className={cn(
                        "text-muted-foreground h-4 w-4",
                        isSearchOpen && "text-primary",
                      )}
                    />
                  </div>

                  <Input
                    ref={searchInputRef}
                    placeholder="Type to search..."
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                  />

                  {/* Filter Indicator */}
                  {hasActiveFilters && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 mr-1 text-xs font-normal bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
                        >
                          <Filter className="h-3 w-3" />
                          {getActiveFilterCount()} filters
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        {filters.ageRange[0] !== 18 ||
                        filters.ageRange[1] !== 50 ? (
                          <DropdownMenuItem>
                            <span className="flex-1">
                              Age: {filters.ageRange[0]}-{filters.ageRange[1]}
                            </span>
                          </DropdownMenuItem>
                        ) : null}

                        {filters.fameRange[0] !== 0 ||
                        filters.fameRange[1] !== 100 ? (
                          <DropdownMenuItem>
                            <span className="flex-1">
                              Fame: {filters.fameRange[0]}-
                              {filters.fameRange[1]}
                            </span>
                          </DropdownMenuItem>
                        ) : null}

                        {filters.distance !== 50 ? (
                          <DropdownMenuItem>
                            <span className="flex-1">
                              Distance: {filters.distance}km
                            </span>
                          </DropdownMenuItem>
                        ) : null}

                        {filters.tags.map((tag) => (
                          <DropdownMenuItem key={tag}>
                            <span className="flex-1">{tag}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

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

                {/* Advanced Search Popover */}
                <Popover
                  open={showFilterPopover}
                  onOpenChange={setShowFilterPopover}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "ml-2 h-10 w-10 rounded-full",
                        hasActiveFilters &&
                          "bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600",
                      )}
                    >
                      <Filter className="h-4 w-4" />
                      {hasActiveFilters && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-rose-500">
                          {getActiveFilterCount()}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <SearchFilters
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onApply={handleApplyFilters}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
                  <SearchResults query={searchQuery} filters={filters} />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-rose-500" />
                <span className="font-bold text-xl">Matcher</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4 py-4">
              <div className="px-2">
                <div className="relative">
                  {/* Mobile Search */}
                  <div className="flex items-center rounded-full border bg-background overflow-hidden">
                    <div className="flex-shrink-0 pl-3">
                      <Search className="text-muted-foreground h-4 w-4" />
                    </div>

                    <Input
                      placeholder="Search..."
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Filter Indicator for Mobile */}
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 mr-1 text-xs font-normal bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
                      >
                        <Filter className="h-3 w-3" />
                        {getActiveFilterCount()}
                      </Button>
                    )}

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

                  {/* Mobile Search Results */}
                  {searchQuery.length > 0 && (
                    <div className="mt-2 bg-background border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                      <SearchResults query={searchQuery} filters={filters} />
                    </div>
                  )}
                </div>
              </div>

              <div className="px-2 pt-4">
                <SearchFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onApply={() => {}} // No need to close anything on mobile
                />
              </div>
            </div>

            <div className="mt-auto px-2 py-4">
              <div className="flex items-center space-x-3 rounded-md px-3 py-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="/placeholder.svg?height=36&width=36"
                    alt="User"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">View Profile</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
