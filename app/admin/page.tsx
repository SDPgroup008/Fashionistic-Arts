"use client"

import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <AdminDashboard onLogout={() => (window.location.href = "/")} />
    </main>
  )
}
