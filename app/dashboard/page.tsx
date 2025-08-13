import type { Metadata } from "next"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export const metadata: Metadata = {
  title: "Dashboard - MetaVerse Discovery",
  description: "Manage your virtual spaces and profile",
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  )
}
