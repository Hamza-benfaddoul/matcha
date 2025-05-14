import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { format } from "date-fns";
import { MapPin } from "lucide-react";
import { getMyDates } from "@/services/dateService";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DatesCardList = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await getMyDates();
        setDates(response.data);
      } catch (error) {
        console.error("Failed to load dates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );

  console.log("dates", dates);

  const tabColors = {
    awaiting: "bg-purple-100 text-purple-800",
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
  };

  const handleAddToCalendar = (proposal) => {
    const startDate = new Date(proposal.proposed_date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours

    const calendarEvent = {
      title: proposal.title,
      description: proposal.description,
      location: proposal.location,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    };

    // Create Google Calendar link
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarEvent.title)}&dates=${format(startDate, "yyyyMMdd'T'HHmmss")}/${format(endDate, "yyyyMMdd'T'HHmmss")}&details=${encodeURIComponent(calendarEvent.description)}&location=${encodeURIComponent(calendarEvent.location)}`;

    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <>
      {dates.map((date) => (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge className={`${tabColors[date.status]} shadow-sm`}>
                {date.status}
              </Badge>
              <span className="text-sm text-gray-500">
                {format(date.proposed_date, "MMM dd")}
              </span>
            </div>
            <CardTitle className="mt-2 truncate max-w-full">
              {date.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 truncate">
              {date.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span className="truncate">
                {date.location},{format(date.proposed_date, " p")}
              </span>
            </div>
            {date.status == "pending" ? (
              <div className="mt-4 flex items-center gap-2">
                <Link to={`/profile/${date.recipient_id}`}>
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={
                        date.recipient_profile_picture.startsWith("/")
                          ? `/api${date.recipient_profile_picture}`
                          : date.recipient_profile_picture
                      }
                      alt="@shadcn"
                    />
                    <AvatarFallback>+</AvatarFallback>
                  </Avatar>
                </Link>
                <span className="text-sm">
                  {date.recipient_first_name} {date.recipient_last_name}
                </span>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2">
                <Link to={`/profile/${date.proposer_id}`}>
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={
                        date.proposer_profile_picture.startsWith("/")
                          ? `/api${date.proposer_profile_picture}`
                          : date.proposer_profile_picture
                      }
                      alt="@shadcn"
                    />
                    <AvatarFallback>+</AvatarFallback>
                  </Avatar>
                </Link>
                <span className="text-sm">
                  {date.proposer_first_name} {date.proposer_last_name}
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-rose-500 hover:bg-rose-600"
              onClick={() => handleAddToCalendar(date)}
            >
              Add to Calendar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default DatesCardList;
