// components/ProtectedRoute.jsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading) {
      // Case 1: Route requires authentication but user is not logged in
      if (requireAuth && !user) {
        router.push("/login");
      }

      // Case 2: Route is for guests only (login/signup) but user IS logged in
      if (!requireAuth && user) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router, requireAuth]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // For protected routes: if user exists, render children
  if (requireAuth && user) {
    return <>{children}</>;
  }

  // For guest routes: if user doesn't exist, render children
  if (!requireAuth && !user) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
};

export default ProtectedRoute;
