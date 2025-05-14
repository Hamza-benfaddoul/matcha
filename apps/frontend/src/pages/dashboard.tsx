import MatchingProfiles from "@/components/browsing/matching-profiles";
import { Link } from "react-router-dom";

import { Heart, MessageCircle, User, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DatesCardList from "@/components/Dates-card";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl ">
      {/* Rest of the dashboard content remains the same */}
      {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> */}
      <div>
        {/* Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Your Stats</CardTitle>
            <CardDescription>How you're doing on Matcha</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Fame Rating</span>
                </div>
                <p className="text-2xl font-bold">7.8</p>
                <p className="text-xs text-gray-500">Top 20% of users</p>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span className="text-sm font-medium">Likes</span>
                </div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-gray-500">+5 this week</p>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">Profile Views</span>
                </div>
                <p className="text-2xl font-bold">142</p>
                <p className="text-xs text-gray-500">+28 this week</p>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Messages</span>
                </div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-xs text-gray-500">3 unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Matches  */}
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle> Matching Profiles</CardTitle>
          <CardDescription>
            People you share common interests with
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MatchingProfiles />
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle> Scheduled dates</CardTitle>
              <CardDescription>How you're doing on Matcha</CardDescription>
            </div>
            <Link to="/dates">
              <Button variant="link" className="text-rose-500">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Event Card 1 */}
            <DatesCardList />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
