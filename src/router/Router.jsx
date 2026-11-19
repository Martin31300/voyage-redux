import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminRoute from "../components/AdminRoute.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import ProfileLayout from "../layouts/ProfileLayout.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";
import DestinationDetailPage from "../pages/DestinationDetailPage.jsx";
import DestinationsPage from "../pages/DestinationsPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import RegionPage from "../pages/RegionPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import SearchPage from "../pages/SearchPage.jsx";
import AdminCommentsPage from "../pages/admin/AdminCommentsPage.jsx";
import AdminContactsPage from "../pages/admin/AdminContactsPage.jsx";
import AdminDestinationsPage from "../pages/admin/AdminDestinationsPage.jsx";
import AdminUsersPage from "../pages/admin/AdminUsersPage.jsx";
import ProfileCommentsPage from "../pages/profile/ProfileCommentsPage.jsx";
import ProfileFavoritesPage from "../pages/profile/ProfileFavoritesPage.jsx";
import ProfileInfoPage from "../pages/profile/ProfileInfoPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "destinations", element: <DestinationsPage /> },
      { path: "destinations/:slug", element: <DestinationDetailPage /> },
      { path: "region/:slug", element: <RegionPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "about", element: <AboutPage /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfileLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <ProfileInfoPage /> },
          { path: "favorites", element: <ProfileFavoritesPage /> },
          { path: "comments", element: <ProfileCommentsPage /> },
        ],
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),
        children: [
          { index: true, element: <Navigate to="contacts" replace /> },
          { path: "contacts", element: <AdminContactsPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "destinations", element: <AdminDestinationsPage /> },
          { path: "comments", element: <AdminCommentsPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
