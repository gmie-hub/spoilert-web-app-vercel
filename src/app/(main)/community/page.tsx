import ProtectedRoute from "@spt/components/ProtectedRoute";
import CommunityPage from "@spt/screens/main/community";

export default function CommunityRoutePage() {
  return (
    <ProtectedRoute>
      <CommunityPage />
    </ProtectedRoute>
  );
}
