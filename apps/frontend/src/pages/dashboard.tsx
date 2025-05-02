import MatchingProfiles from "@/components/browsing/matching-profiles";

import {
  Heart,
  MessageCircle,
  User,
  Users,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl ">
      {/* Rest of the dashboard content remains the same */}
      {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> */}
      <div>
        {/* Profile Completion Card */}
        {/* <Card> */}
        {/*   <CardHeader className="pb-2"> */}
        {/*     <CardTitle>Profile Completion</CardTitle> */}
        {/*     <CardDescription> */}
        {/*       Complete your profile to get better matches */}
        {/*     </CardDescription> */}
        {/*   </CardHeader> */}
        {/*   <CardContent> */}
        {/*     <div className="flex items-center justify-between"> */}
        {/*       <span className="text-sm font-medium">75% Complete</span> */}
        {/*       <span className="text-sm text-gray-500">3 items left</span> */}
        {/*     </div> */}
        {/*     <Progress value={75} className="mt-2" /> */}
        {/*     <div className="mt-4 space-y-2"> */}
        {/*       <div className="flex items-center justify-between"> */}
        {/*         <span className="text-sm">Add more photos</span> */}
        {/*         <Button variant="ghost" size="sm" className="h-8 gap-1"> */}
        {/*           <span className="text-xs">Add</span> */}
        {/*           <ChevronRight className="h-3 w-3" /> */}
        {/*         </Button> */}
        {/*       </div> */}
        {/*       <div className="flex items-center justify-between"> */}
        {/*         <span className="text-sm">Complete your bio</span> */}
        {/*         <Button variant="ghost" size="sm" className="h-8 gap-1"> */}
        {/*           <span className="text-xs">Edit</span> */}
        {/*           <ChevronRight className="h-3 w-3" /> */}
        {/*         </Button> */}
        {/*       </div> */}
        {/*       <div className="flex items-center justify-between"> */}
        {/*         <span className="text-sm">Add more interests</span> */}
        {/*         <Button variant="ghost" size="sm" className="h-8 gap-1"> */}
        {/*           <span className="text-xs">Add</span> */}
        {/*           <ChevronRight className="h-3 w-3" /> */}
        {/*         </Button> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   </CardContent> */}
        {/* </Card> */}

        {/* Activity Card */}
        {/* <Card> */}
        {/*   <CardHeader className="pb-2"> */}
        {/*     <CardTitle>Activity</CardTitle> */}
        {/*     <CardDescription>Your recent activity on Matcha</CardDescription> */}
        {/*   </CardHeader> */}
        {/*   <CardContent> */}
        {/*     <div className="space-y-4"> */}
        {/*       <div className="flex items-start gap-3"> */}
        {/*         <div className="rounded-full bg-rose-100 p-2"> */}
        {/*           <Heart className="h-4 w-4 text-rose-500" /> */}
        {/*         </div> */}
        {/*         <div className="space-y-1"> */}
        {/*           <p className="text-sm font-medium"> */}
        {/*             You received 5 new likes */}
        {/*           </p> */}
        {/*           <p className="text-xs text-gray-500">2 hours ago</p> */}
        {/*         </div> */}
        {/*       </div> */}
        {/*       <div className="flex items-start gap-3"> */}
        {/*         <div className="rounded-full bg-blue-100 p-2"> */}
        {/*           <MessageCircle className="h-4 w-4 text-blue-500" /> */}
        {/*         </div> */}
        {/*         <div className="space-y-1"> */}
        {/*           <p className="text-sm font-medium">New message from Emma</p> */}
        {/*           <p className="text-xs text-gray-500">5 hours ago</p> */}
        {/*         </div> */}
        {/*       </div> */}
        {/*       <div className="flex items-start gap-3"> */}
        {/*         <div className="rounded-full bg-green-100 p-2"> */}
        {/*           <Users className="h-4 w-4 text-green-500" /> */}
        {/*         </div> */}
        {/*         <div className="space-y-1"> */}
        {/*           <p className="text-sm font-medium">You have a new match!</p> */}
        {/*           <p className="text-xs text-gray-500">Yesterday</p> */}
        {/*         </div> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   </CardContent> */}
        {/*   <CardFooter> */}
        {/*     <Button variant="ghost" className="w-full"> */}
        {/*       View All Activity */}
        {/*     </Button> */}
        {/*   </CardFooter> */}
        {/* </Card> */}

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

      {/* Matches and Messages Tabs */}
      <Tabs defaultValue="matches" className="mt-6 p-6 bg-white">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="matches">Suggested Matches</TabsTrigger>
            <TabsTrigger value="messages">Recent Messages</TabsTrigger>
          </TabsList>
          {/* <Button variant="outline" size="sm" className="gap-2"> */}
          {/*   <Filter className="h-4 w-4" /> */}
          {/*   <span>Filter</span> */}
          {/* </Button> */}
        </div>

        {/* Matches Tab Content */}
        <TabsContent value="matches" className="mt-4">
          {/* Match Card 1 */}
          <MatchingProfiles />
        </TabsContent>

        {/* Messages Tab Content */}
        <TabsContent value="messages" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {/* Message 1 */}
                <div className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="Emma"
                    />
                    <AvatarFallback>EM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Emma</p>
                      <span className="text-xs text-gray-500">2h ago</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      Hey! I saw we both like hiking. Have you been to any good
                      trails lately?
                    </p>
                  </div>
                </div>

                {/* Message 2 */}
                <div className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="Michael"
                    />
                    <AvatarFallback>MI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Michael</p>
                      <span className="text-xs text-gray-500">Yesterday</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      I'd love to grab coffee sometime this week if you're free!
                    </p>
                  </div>
                </div>

                {/* Message 3 */}
                <div className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="Sophia"
                    />
                    <AvatarFallback>SO</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Sophia</p>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      Thanks for the message! I'm definitely interested in
                      checking out that art exhibition.
                    </p>
                  </div>
                </div>

                {/* Message 4 */}
                <div className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="David"
                    />
                    <AvatarFallback>DA</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">David</p>
                      <span className="text-xs text-gray-500">3 days ago</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      I noticed we both love indie music. Have you heard the new
                      album by...
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button variant="outline" className="w-full">
                View All Messages
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Upcoming Events */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Upcoming Events</h2>
          <Button variant="link" className="text-rose-500">
            View All
          </Button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Event Card 1 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-rose-500">Featured</Badge>
                <span className="text-sm text-gray-500">Jun 15</span>
              </div>
              <CardTitle className="mt-2">Speed Dating Night</CardTitle>
              <CardDescription>
                Meet multiple matches in one evening
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>Downtown Coffee House, 7:00 PM</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>+</AvatarFallback>
                </Avatar>
                <span className="text-sm">24 people attending</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-rose-500 hover:bg-rose-600">
                RSVP
              </Button>
            </CardFooter>
          </Card>

          {/* Event Card 2 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline">New</Badge>
                <span className="text-sm text-gray-500">Jun 22</span>
              </div>
              <CardTitle className="mt-2">Hiking Meetup</CardTitle>
              <CardDescription>Connect with nature lovers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>Riverside Trail, 9:00 AM</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>+</AvatarFallback>
                </Avatar>
                <span className="text-sm">12 people attending</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-rose-500 hover:bg-rose-600">
                RSVP
              </Button>
            </CardFooter>
          </Card>

          {/* Event Card 3 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline">Popular</Badge>
                <span className="text-sm text-gray-500">Jun 30</span>
              </div>
              <CardTitle className="mt-2">Wine Tasting Social</CardTitle>
              <CardDescription>For sophisticated singles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>Vineyard Lounge, 6:30 PM</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>+</AvatarFallback>
                </Avatar>
                <span className="text-sm">18 people attending</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-rose-500 hover:bg-rose-600">
                RSVP
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
