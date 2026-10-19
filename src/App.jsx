import React from "react";
import { Routes, Route } from "react-router-dom";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";

import AppLayout from "./pages/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Clients from "./pages/app/Clients";
import Stock from "./pages/app/Stock";
import Pipeline from "./pages/app/Pipeline";
import Conversations from "./pages/app/Conversations";
import Factures from "./pages/app/Factures";
import Equipe from "./pages/app/Equipe";
import Stats from "./pages/app/Stats";

export default function App() {
  return (
    <WorkspaceProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={
          <ProtectedRoute><Onboarding /></ProtectedRoute>
        } />
        <Route path="/app" element={
          <ProtectedRoute requireOnboarded><AppLayout /></ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="stock" element={<Stock />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="factures" element={<Factures />} />
          <Route path="equipe" element={<Equipe />} />
          <Route path="stats" element={<Stats />} />
        </Route>
      </Routes>
    </WorkspaceProvider>
  );
}