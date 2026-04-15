"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="bg-gray-100 dark:bg-gray-900">
       <div className="md:flex gap-6">
         <DashboardSidebar />
         <main className="flex-1 space-y-6 m-4">{children}</main>
       </div>
     </div>
    </ProtectedRoute>
  );
}
