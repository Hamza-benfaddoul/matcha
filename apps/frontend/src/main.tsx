import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Profile from './pages/Profile.tsx';
import React from 'react';
import Home from './pages/Home.tsx';
import UserProfileForm from './pages/CompleteProfile.tsx';



const router = createBrowserRouter([
  {
    path: '/',
    element:  
              <Home />

  },
  {
    path: '/profile/',
    element:  
              <Profile />
  },
  {
    path: '/complete-profile',
    element:
      <UserProfileForm />
  }
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <RouterProvider router={router} />

      <App />
  </React.StrictMode>
)