import ProfileForm from "@/components/Profile/ProfileFrom";

export default function CompleteProfile() {
    return (
      <ProfileForm endpoint="/api/profile/complete"/>
    )
}