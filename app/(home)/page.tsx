"use client";

import ProtectedRoute from "../auth/protectedRoute";
import LandingPage from "./_components/landing-page";

export default function Home() {
  return (
    <ProtectedRoute>
      <LandingPage />
    </ProtectedRoute>
  );
}
