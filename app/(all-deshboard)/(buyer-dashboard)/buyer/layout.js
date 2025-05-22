import DashboardLayout from "@/app/(all-deshboard)/_components/DashboardLayout";
import ProtectedRoute from "@/app/_components/ProtectedRoute";

export default function BuyerDashboardLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["buyer"]}>
      <div className="Buyer-dashboard">
        <DashboardLayout>{children}</DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
