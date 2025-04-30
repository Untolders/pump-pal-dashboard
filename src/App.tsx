
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import {GoogleOAuthProvider} from '@react-oauth/google';
import GoogleLogin from "./pages/GoogleLogin";
import { useAuth , AuthProvider } from "./contexts/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import FuelTypes from "./pages/FuelTypes";
import EmployeeLogs from "./pages/EmployeeLogs";
import NotFound from "./pages/NotFound";
import NewVehicle from "./pages/NewVehicle";
import NewFuelType from "./pages/NewFuelType";
import NewNozzle from "./pages/NewNozzle";
import NewPaymentType from "./pages/NewPaymentType";
import NewEmployee from "./pages/NewEmployee";
import NewAddress from "./pages/NewAddress";
import Payments from "./pages/Payments";
import Sales from "./pages/Sales";
import PumpLogs from "./pages/PumpLogs";
import Shifts from "./pages/Shifts";
import Users from "./pages/Users";
import AdminPumps from "./pages/AdminPumps";
import IncomingFuel from "./pages/IncomingFuel";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected route wrapper
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-pumpPrimary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const GoogleAuthWrapper = () => {
  return (
    <GoogleOAuthProvider clientId="332431354817-1nb2r1v41kccvarmabma7b7fe7nghn3l.apps.googleusercontent.com">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pumpBg to-white p-4">
        <div className="w-full max-w-md">
          <GoogleLogin />
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

// App routes with authentication
const AppRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user-info') || '{}');
  const isSuperAdmin = user?.role === "superadmin";
  
  return (
    <Routes>
      <Route path="/login" element={<GoogleAuthWrapper />} />
      
      {/* Protected routes for all users */}
      {[
        { path: "/", element: <Dashboard /> },
        { path: "/employee-logs", element: <EmployeeLogs /> },
        { path: "/payments", element: <Payments /> },
        { path: "/sales", element: <Sales /> },
        { path: "/fuel-type", element: <FuelTypes /> },
        { path: "/incoming-fuel", element: <IncomingFuel /> },
        { path: "/pump-logs", element: <PumpLogs /> },
        { path: "/shifts", element: <Shifts /> },
        { path: "/fuel-types/new", element: <NewFuelType /> },
        { path: "/nozzles/new", element: <NewNozzle /> },
        { path: "/payment-types/new", element: <NewPaymentType /> },
        { path: "/employees/new", element: <NewEmployee /> },
        { path: "/vehicles/new", element: <NewVehicle /> },
        { path: "/addresses/new", element: <NewAddress /> },
      ].map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <Layout userRole={user?.role || "admin"}>
                {element}
              </Layout>
            </ProtectedRoute>
          }
        />
      ))}
      
      {/* Super Admin only routes */}
      {[
        { path: "/admin/users", element: <Users /> },
        { path: "/admin/pumps", element: <AdminPumps /> },
      ].map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute requiredRole="superadmin">
              <Layout userRole="superadmin">
                {element}
              </Layout>
            </ProtectedRoute>
          }
        />
      ))}
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" closeButton={true} expand={true} />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
