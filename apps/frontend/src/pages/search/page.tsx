import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdvancedSearch from "@/components/advanced-search";
import type { FilterState } from "@/components/search-filters";

function parseSearchParams(search: string) {
  const params = new URLSearchParams(search);
  const query = params.get("q") || "";

  const filters: FilterState = {
    ageRange: [
      Number.parseInt(params.get("ageMin") || "0"),
      Number.parseInt(params.get("ageMax") || "100"),
    ],
    fameRange: [
      Number.parseInt(params.get("fameMin") || "0"),
      Number.parseInt(params.get("fameMax") || "100"),
    ],
    distance: Number.parseInt(params.get("distance") || "-1"),
    tags: params.get("tags")?.split(",").filter(Boolean) || [],
  };

  return { query, filters };
}

export default function SearchPage() {
  const location = useLocation();
  const [{ query, filters }, setState] = useState(() =>
    parseSearchParams(location.search),
  );

  useEffect(() => {
    setState(parseSearchParams(location.search));
  }, [location.search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-muted-foreground mb-8">
        {query ? `Showing results for "${query}"` : "Search for users"}
        {filters.tags.length > 0 &&
          ` with interests in ${filters.tags.join(", ")}`}
      </p>

      <AdvancedSearch initialQuery={query} initialFilters={filters} />
    </div>
  );
}
