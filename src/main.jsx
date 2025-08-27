import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import InviteFormPage from './pages/InviteFormPage.jsx'
import WaitingPage from './pages/WaitingPage.jsx'
import ClientDemands from './pages/ClientDemands.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MemberWall from './pages/MemberWall.jsx'
import ClientPostForm from './pages/ClientPostForm.jsx'
import NewInvitePage from './pages/NewInvitePage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ClientPostsPage from './pages/ClientPostsPage.jsx'
import AdminMembersList from './pages/AdminMembersList.jsx'
import ClientDashboard from './pages/ClientDashboard.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> }, //tout le monde
  { path: '/:token', element: <InviteFormPage /> }, //tout le monde
  { path: '/waiting/:token', element: <WaitingPage /> }, //tout le monde
  { path: '/dashboard', element: <ProtectedRoute allow="CLIENT"><ClientDashboard /></ProtectedRoute> }, //client
  { path: '/demands', element: <ProtectedRoute allow="CLIENT"><ClientDemands /></ProtectedRoute> }, //client
  { path: '/login', element: <LoginPage /> }, //tout le monde
  { path: "/new-invite", element: <ProtectedRoute allow="CLIENT"><NewInvitePage /></ProtectedRoute> }, //client
  { path: '/wall', element: <ProtectedRoute allow="MEMBER"><MemberWall /></ProtectedRoute> }, //member
  { path: '/post', element: <ProtectedRoute allow="CLIENT"><ClientPostForm /></ProtectedRoute> }, //client
  { path: '/my-posts', element: <ProtectedRoute allow="CLIENT"><ClientPostsPage /></ProtectedRoute> }, //client
  { path: '/admin/members', element: <ProtectedRoute allow="CLIENT"><AdminMembersList /></ProtectedRoute> }, //client
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

// // src/main.jsx
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

// // …
// { path: "/dashboard", element: <ProtectedRoute allow="CLIENT"><ClientDashboard /></ProtectedRoute> },
// { path: "/post", element: <ProtectedRoute allow="CLIENT"><ClientPostForm /></ProtectedRoute> },
// { path: "/new-invite", element: <ProtectedRoute allow="CLIENT"><NewInvitePage /></ProtectedRoute> },
// { path: "/wall", element: <ProtectedRoute allow="MEMBER"><MemberWall /></ProtectedRoute> },
// { path: '/my-posts', element: <ProtectedRoute allow="CLIENT"><ClientPostsPage /></ProtectedRoute> },
