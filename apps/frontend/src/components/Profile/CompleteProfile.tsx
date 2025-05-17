import ProfileForm from "@/components/Profile/ProfileFrom";

import { NavUser } from "@/components/nav-user";
export default function CompleteProfile() {
  return (
    <div className="flex flex-col gap-4 w-full h-full p-4">
      <div className="flex  gap-2 w-full h-full p-4 bg-muted/50 rounded-lg">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            Please complete your profile to access all features of the app.
          </p>
          <p className="text-sm text-muted-foreground">
            You can always change your profile later.
          </p>
        </div>
        <div>
          <NavUser />
        </div>
      </div>
      <ProfileForm endpoint="/api/profile/complete" />
    </div>
  );
}

