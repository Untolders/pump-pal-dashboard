
import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: ReactNode;
  userRole: "admin" | "superadmin";
}

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/": { 
    title: "Dashboard", 
    subtitle: "Welcome back to PumpPal" 
  },
  "/addresses": { 
    title: "Addresses", 
    subtitle: "Manage station locations" 
  },
  "/employee-logs": { 
    title: "Employee Logs", 
    subtitle: "Track attendance and performance" 
  },
  "/employees": { 
    title: "Employees", 
    subtitle: "Manage your team members" 
  },
  "/fuel-types": { 
    title: "Fuel Types", 
    subtitle: "Configure available fuel options" 
  },
  "/pumps": { 
    title: "Pumps", 
    subtitle: "Monitor and manage station pumps" 
  },
  "/payments": { 
    title: "Payments", 
    subtitle: "Track transactions and revenue" 
  },
  "/vehicles": { 
    title: "Vehicles", 
    subtitle: "Manage registered vehicles" 
  },
  "/settings": { 
    title: "Settings", 
    subtitle: "Configure system preferences" 
  },
  "/profile": { 
    title: "My Profile", 
    subtitle: "Manage your account details" 
  },
  "/login": { 
    title: "Login", 
    subtitle: "Welcome to PumpPal" 
  },
};

const Layout: React.FC<LayoutProps> = ({ children, userRole }) => {
  const location = useLocation();
  const { title, subtitle } = pageTitles[location.pathname] || { 
    title: "Page Not Found", 
    subtitle: "The requested page doesn't exist" 
  };

  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-pumpBg">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        <main className={cn("flex-1 overflow-y-auto p-6 animate-fade-in")}>
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Layout;
