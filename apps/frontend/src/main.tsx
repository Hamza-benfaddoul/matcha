import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./auth/login/page.tsx";
import RegisterPage from "./auth/register/page.tsx";
import ResetPage from "./auth/reset/page.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import ProtectedRoute from "./components/protected-route.tsx";
import LandingPage from "./home/home.tsx";
import Profile from "./pages/Profile.tsx";
import CompleteProfile from "./components/Profile/CompleteProfile.tsx";
import NotFoundPage from "./pages/404.tsx";

// Or use plain objects
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/protected",
    element: <ProtectedRoute element={<LandingPage />} />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/complete-profile",
    element: <CompleteProfile />,
    // element: <ProtectedRoute element={<CompleteProfile />} />,
  },
  {
    path: "/register",
    element: (
      <div className="h-screen w-full  flex justify-center items-center ">
        <RegisterPage />
      </div>
    ),
  },
  {
    path: "/profile/:id",
    element: <ProtectedRoute element={<Profile />} />,
  },
  {
    path: "/reset",
    element: (
      <div className="h-screen w-full  flex justify-center items-center ">
        <ResetPage />
      </div>
    ),
  },
  {
    path: "/404",
    element: <NotFoundPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
