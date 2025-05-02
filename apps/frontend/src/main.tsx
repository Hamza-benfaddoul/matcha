import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
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
import Home from "./pages/Home";
import DashboardPage from "./pages/dashboard.tsx";
import SearchPage from "./pages/search/page.tsx";
import NewVerificationPage from "./auth/new-verification/page.tsx";
import BlockLists from "./pages/BlockLists.tsx";
import Chat from "./pages/Chat.tsx";

// Or use plain objects
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<Home />} />,
  },
  {
    path: "/search",
    element: <ProtectedRoute element={<SearchPage />} />,
  },

  {
    path: "/protected",
    element: <ProtectedRoute element={<LandingPage />} />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute element={<DashboardPage />} />,
  },
  {
    path: "/new-verification",
    element: <ProtectedRoute element={<NewVerificationPage />} />,
  },
  {
    path: "/login",
    element: <ProtectedRoute element={<LoginPage />} />,
  },
  {
    path: "/complete-profile",
    element: <ProtectedRoute element={<CompleteProfile />} />,
  },
  {
    path: "/blocks",
    element: <ProtectedRoute element={<BlockLists />} />,
  },
  {
    path: "/chat",
    element: <ProtectedRoute element={<Chat />} />,
  },
  {
    path: "/register",
    element: <ProtectedRoute element={<RegisterPage />} />,
  },
  {
    path: "/profile/:id",
    element: <ProtectedRoute element={<Profile />} />,
  },
  {
    path: "/reset",
    element: <ProtectedRoute element={<ResetPage />} />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  //  <StrictMode>
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
  // </StrictMode>,
);
