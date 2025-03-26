import React from 'react';
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import AdoptionList from './components/AdoptionList';
import FeedbackList from './components/FeedbackList';
import Profile from './components/Profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import VerifyOTP from './components/VerifyOTP';

const queryClient = new QueryClient();
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Header />,
      children: [
        {
          path: '/',
          element: <Dashboard />
        },
        {
          path: '/user',
          element: <UserList />
        },
        {
          path: '/adoption',
          element: <AdoptionList />
        },
        {
          path: '/feedback',
          element: <FeedbackList />
        },
        {
          path: '/profile',
          element: <Profile />
        },
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/verify-otp/:email',
      element: <VerifyOTP />
    },
    {
      path: '/reset-password/:email',
      element: <ResetPassword />
    },
  ])
  return (
    <div className="flex bg-gray-100 h-screen">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
