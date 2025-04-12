import ProfileForm from "@/components/ProfileFrom";

export default function CompleteProfile() {
    return (
      <ProfileForm endpoint="/api/profile/complete"/>
    )
}