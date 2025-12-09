import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute";

// ADMIN PAGES
import DashboardHome from "./pages/admin/DashboardHome";
import Doctors from "./pages/admin/Doctors";
import DoctorDetails from "./pages/admin/DoctorDetails";
import Compare from "./pages/admin/compare";
import Reports from "./pages/admin/Reports";
import Analytics from "./pages/admin/Analytics";

// STORE PAGES
import StoreLayout from "./layouts/StoreLayout";
import StoreDashboard from "./pages/store/StoreDashboard";
import StoreVerify from "./pages/store/StoreVerify";

function App() {
  return (
    <>
      <Toaster position="top-center" />

      <BrowserRouter>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Login />} />

          {/* ADMIN ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="admin">
                <DashboardHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctors"
            element={
              <ProtectedRoute role="admin">
                <Doctors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/:id"
            element={
              <ProtectedRoute role="admin">
                <DoctorDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/compare"
            element={
              <ProtectedRoute role="admin">
                <Compare />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute role="admin">
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* ⭐ ANALYTICS ROUTE (NEW) */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute role="admin">
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* STORE ROUTES */}
          <Route
            path="/store"
            element={
              <ProtectedRoute role="store">
                <StoreLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StoreDashboard />} />
            <Route path="verify" element={<StoreVerify />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
