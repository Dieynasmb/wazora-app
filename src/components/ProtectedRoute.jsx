import React from "react";
import { Navigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";

export default function ProtectedRoute({ children, requireOnboarded = false }) {
  const { isAuthenticated, currentWorkspace } = useWorkspace();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireOnboarded && !currentWorkspace.onboarded) return <Navigate to="/onboarding" replace />;

  return children;
}