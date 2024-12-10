import { Outlet } from "react-router-dom"
import useAuth from "@/hooks/useAuth"

export default function Home() {
  const { auth } = useAuth();
  return (
    <div className="border-2 bg-gray-50 h-screen flex flex-col justify-center ">
      <h1 className="text-3xl  text-center text-red-400 font-bold underline">
        Protected rout
      </h1>
      <div className="text-center">
        User Data
        <br />
        {JSON.stringify(auth.user)}
      </div>
      <div className="text-center">

        AccessToken
        <br />
        {JSON.stringify(auth.accessToken)}

      </div>
    </div >
  )
}
