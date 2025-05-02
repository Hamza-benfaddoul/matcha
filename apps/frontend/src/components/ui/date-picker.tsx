import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 10,
}: {
  value?: Date | string;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  fromYear?: number;
  toYear?: number;
}) {
  const [view, setView] = useState<"days" | "years">("days");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [yearPage, setYearPage] = useState(0); // Tracks current "page" of years

  // Parse the input value
  const selectedDate = value
    ? typeof value === "string"
      ? parseISO(value)
      : value
    : undefined;

  // Format the display value
  const displayValue = selectedDate
    ? format(selectedDate, "MMMM do, yyyy")
    : placeholder;

  // Generate years for the current page (12 years per page)
  const yearsPerPage = 12;
  const totalYears = toYear - fromYear + 1;
  const totalPages = Math.ceil(totalYears / yearsPerPage);

  // Calculate the middle page initially
  const middlePage = Math.floor(totalPages / 2);
  const [currentPage, setCurrentPage] = useState(middlePage);

  const getYearsForPage = (page: number) => {
    const startYear = fromYear + page * yearsPerPage;
    const endYear = Math.min(startYear + yearsPerPage - 1, toYear);
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i,
    );
  };

  const currentYears = getYearsForPage(currentPage);
  const rangeStart = currentYears[0];
  const rangeEnd = currentYears[currentYears.length - 1];

  const handleYearNavigation = (direction: "prev" | "next") => {
    setCurrentPage((prev) => {
      if (direction === "prev" && prev > 0) return prev - 1;
      if (direction === "next" && prev < totalPages - 1) return prev + 1;
      return prev;
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {view === "days" ? (
          <div className="flex flex-col gap-4 p-3">
            <div className="flex items-center justify-between px-4">
              <button
                onClick={() => {
                  setCurrentPage(
                    Math.floor(
                      (selectedMonth.getFullYear() - fromYear) / yearsPerPage,
                    ),
                  );
                  setView("years");
                }}
                className="text-sm font-medium hover:bg-accent rounded px-2 py-1"
              >
                {format(selectedMonth, "MMMM yyyy")}
              </button>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    const newMonth = new Date(selectedMonth);
                    newMonth.setMonth(newMonth.getMonth() - 1);
                    setSelectedMonth(newMonth);
                  }}
                  className="p-1 rounded hover:bg-accent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const newMonth = new Date(selectedMonth);
                    newMonth.setMonth(newMonth.getMonth() + 1);
                    setSelectedMonth(newMonth);
                  }}
                  className="p-1 rounded hover:bg-accent"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={onChange}
              month={selectedMonth}
              onMonthChange={setSelectedMonth}
              showOutsideDays
              className="border-0"
              classNames={{
                months: "flex flex-col",
                month: "space-y-4",
                caption: "hidden",
                nav: "hidden",
                table: "w-full",
                head_row: "flex",
                head_cell:
                  "text-muted-foreground rounded-md w-9 font-normal text-sm",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded",
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
              }}
            />
          </div>
        ) : (
          <div className="p-4 w-64">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => handleYearNavigation("prev")}
                disabled={currentPage === 0}
                className="p-1 rounded hover:bg-accent disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-sm font-medium">
                {rangeStart} - {rangeEnd}
              </span>

              <button
                onClick={() => handleYearNavigation("next")}
                disabled={currentPage === totalPages - 1}
                className="p-1 rounded hover:bg-accent disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {currentYears.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    const newMonth = new Date(selectedMonth);
                    newMonth.setFullYear(year);
                    setSelectedMonth(newMonth);
                    setView("days");
                  }}
                  className={cn(
                    "p-2 rounded text-sm hover:bg-accent text-center",
                    selectedMonth.getFullYear() === year &&
                      "bg-primary text-primary-foreground",
                  )}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
