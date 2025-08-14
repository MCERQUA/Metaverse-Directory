import type { Metadata } from "next"
import { UserDashboard } from "@/components/dashboard/user-dashboard-new"
import { ProtectedRoute } from "@/components/auth/protected-route"

export const metadata: Metadata = {
  title: "Dashboard - MyRoom.Chat",
  description: "Manage your profile and virtual spaces",
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  )
}
