import DashboardLayout from "@/app/(all-deshboard)/_components/DashboardLayout";
import ProtectedRoute from "@/app/_components/ProtectedRoute";

export default function SellerDashboardLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <div className="Seller-dashboard">
        <DashboardLayout>{children}</DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
