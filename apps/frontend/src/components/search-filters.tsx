"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  ageRange: [number, number];
  fameRange: [number, number];
  distance: number;
  tags: string[];
}

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onApply?: () => void;
}

export default function SearchFilters({
  filters,
  onFilterChange,
  onApply,
}: SearchFiltersProps) {
  const [activeTab, setActiveTab] = useState("basics");

  // Available tags (would come from API)
  const tagCategories = {
    Lifestyle: ["#vegan", "#fitness", "#fashion"],
    Activities: ["#sport", "#travel", "#gaming"],
    Interests: [
      "#music",
      "#movies",
      "#art",
      "#food",
      "#books",
      "#tech",
      "#photography",
      "#nature",
    ],
  };

  // Handle tag selection
  const toggleTag = (tag: string) => {
    if (filters.tags.includes(tag)) {
      onFilterChange({
        ...filters,
        tags: filters.tags.filter((t) => t !== tag),
      });
    } else {
      onFilterChange({
        ...filters,
        tags: [...filters.tags, tag],
      });
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filter Your Matches</h3>
        {getActiveFilterCount() > 0 && (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-500 border-rose-200"
          >
            {getActiveFilterCount()} active
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-muted/50">
          <TabsTrigger
            value="basics"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Basics
          </TabsTrigger>
          <TabsTrigger
            value="interests"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Interests
          </TabsTrigger>
          <TabsTrigger
            value="location"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Location
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          {/* Age Range */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Age Range</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium bg-muted/70 px-2.5 py-1 rounded-md">
                  {filters.ageRange[0]} - {filters.ageRange[1]}
                </span>
                {(filters.ageRange[0] !== 18 || filters.ageRange[1] !== 50) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() =>
                      onFilterChange({ ...filters, ageRange: [18, 50] })
                    }
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
            <div className="px-1">
              <Slider
                defaultValue={[18, 50]}
                min={18}
                max={100}
                step={1}
                value={filters.ageRange}
                onValueChange={(value) =>
                  onFilterChange({
                    ...filters,
                    ageRange: value as [number, number],
                  })
                }
                className="py-4"
                thumbClassName="h-4 w-4 border-2 border-white shadow-md"
                trackClassName={cn(
                  "h-2 rounded-full bg-gradient-to-r",
                  filters.ageRange[0] !== 18 || filters.ageRange[1] !== 50
                    ? "from-rose-300 to-rose-500"
                    : "from-slate-200 to-slate-300",
                )}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>18</span>
                <span>60</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Fame Rating */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Fame Rating</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium bg-muted/70 px-2.5 py-1 rounded-md">
                  {filters.fameRange[0]} - {filters.fameRange[1]}
                </span>
                {(filters.fameRange[0] !== 0 ||
                  filters.fameRange[1] !== 100) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() =>
                      onFilterChange({ ...filters, fameRange: [0, 100] })
                    }
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
            <div className="px-1">
              <Slider
                defaultValue={[0, 100]}
                min={0}
                max={100}
                step={1}
                value={filters.fameRange}
                onValueChange={(value) =>
                  onFilterChange({
                    ...filters,
                    fameRange: value as [number, number],
                  })
                }
                className="py-4"
                thumbClassName="h-4 w-4 border-2 border-white shadow-md"
                trackClassName={cn(
                  "h-2 rounded-full bg-gradient-to-r",
                  filters.fameRange[0] !== 0 || filters.fameRange[1] !== 100
                    ? "from-rose-300 to-rose-500"
                    : "from-slate-200 to-slate-300",
                )}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="interests" className="space-y-6">
          {/* Tags by Category */}
          {Object.entries(tagCategories).map(([category, tags]) => (
            <div key={category} className="space-y-3">
              <Label className="text-base font-medium">{category}</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 transition-all ${
                      filters.tags.includes(tag)
                        ? "bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 shadow-sm"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {filters.tags.includes(tag) ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Circle className="h-3.5 w-3.5" />
                    )}
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="location" className="space-y-6">
          {/* Distance */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Maximum Distance</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium bg-muted/70 px-2.5 py-1 rounded-md">
                  {filters.distance} km
                </span>
                {filters.distance !== 50 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() => onFilterChange({ ...filters, distance: 50 })}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
            <div className="px-1">
              <Slider
                defaultValue={[50]}
                min={1}
                max={100}
                step={1}
                value={[filters.distance]}
                onValueChange={(value) =>
                  onFilterChange({ ...filters, distance: value[0] })
                }
                className="py-4"
                thumbClassName="h-4 w-4 border-2 border-white shadow-md"
                trackClassName={cn(
                  "h-2 rounded-full bg-gradient-to-r",
                  filters.distance !== 50
                    ? "from-rose-300 to-rose-500"
                    : "from-slate-200 to-slate-300",
                )}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 km</span>
                <span>50 km</span>
                <span>100 km</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Distance is calculated from your current location. Make sure
              location services are enabled for more accurate results.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Selected Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Selected Filters</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
              onClick={() =>
                onFilterChange({
                  ageRange: [18, 50],
                  fameRange: [0, 100],
                  distance: 50,
                  tags: [],
                })
              }
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.ageRange[0] !== 18 || filters.ageRange[1] !== 50 ? (
              <Badge variant="outline" className="bg-muted/50">
                Age: {filters.ageRange[0]}-{filters.ageRange[1]}
              </Badge>
            ) : null}

            {filters.fameRange[0] !== 0 || filters.fameRange[1] !== 100 ? (
              <Badge variant="outline" className="bg-muted/50">
                Fame: {filters.fameRange[0]}-{filters.fameRange[1]}
              </Badge>
            ) : null}

            {filters.distance !== 50 ? (
              <Badge variant="outline" className="bg-muted/50">
                Distance: {filters.distance}km
              </Badge>
            ) : null}

            {filters.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-muted/50">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() =>
            onFilterChange({
              ageRange: [18, 50],
              fameRange: [0, 100],
              distance: 50,
              tags: [],
            })
          }
        >
          Reset
        </Button>
        <Button
          className="flex-1 bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 shadow-sm"
          onClick={onApply}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
