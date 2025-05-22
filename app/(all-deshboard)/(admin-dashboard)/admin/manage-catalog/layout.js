import DashboardLayout from "@/app/(all-deshboard)/_components/DashboardLayout";
import AdminInitializer from "@/app/_components/AdminInitializer";
import ProtectedRoute from "@/app/_components/AdminProtectedRoute";

export default function AdminDashboardLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["admin", "super admin"]}>
      <AdminInitializer>
        <div className="Admin-dashboard">
          <DashboardLayout>{children}</DashboardLayout>
        </div>
      </AdminInitializer>
    </ProtectedRoute>
  );
}
