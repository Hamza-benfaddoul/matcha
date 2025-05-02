import { Outlet } from "react-router-dom"

export default function App() {
  return (
    <>
      <h1 className="text-3xl text-center text-red-400 font-bold underline">
        Hello From Matcha!
      </h1>
      <Outlet />

    </>
  )
}
