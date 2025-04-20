import ProfileForm from "@/components/Profile/ProfileFrom";

export default function CompleteProfile() {
    return (
      // <div>hello</div>
      <ProfileForm endpoint="/api/profile/complete"/>
    )
}