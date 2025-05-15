import MatchingProfiles from "@/components/browsing/matching-profiles";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DatesCardList from "@/components/Dates-card";
import StatCards from "@/components/Stat-cards";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl ">
      {/* Stats Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your Stats</CardTitle>
          <CardDescription>How you're doing on Matcha</CardDescription>
        </CardHeader>
        <CardContent>
          <StatCards />
        </CardContent>
      </Card>

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
