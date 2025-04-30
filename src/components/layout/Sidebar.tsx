
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LogoutButton from "../logout/logout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";


import { 
  ChevronLeft, 
  ChevronRight,
  Home,
  FileText,
  CreditCard,
  ChartBar,
  Gauge,
  Clock,
  Settings,
  Fuel,
  Droplets,
  UserPlus,
  Car,
  MapPin,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  userRole: "admin" | "superadmin";
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles: Array<"admin" | "superadmin">;
  subItems?: Array<{
    label: string;
    icon: React.ElementType;
    href: string;
  }>;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth(); 

  const navItems: NavItem[] = [
    { 
      label: "Home", 
      icon: Home, 
      href: "/", 
      roles: ["admin", "superadmin"] 
    },
    { 
      label: "Sales", 
      icon: ChartBar, 
      href: "/sales", 
      roles: ["admin", "superadmin"] 
    },
    { 
      label: "Employee Log", 
      icon: FileText, 
      href: "/employee-logs", 
      roles: ["admin", "superadmin"] 
    },
    { 
      label: "Payment", 
      icon: CreditCard, 
      href: "/payments", 
      roles: ["admin", "superadmin"] 
    },
   
    { 
      label: "Pump Log", 
      icon: Gauge, 
      href: "/pump-logs", 
      roles: ["admin", "superadmin"] 
    },
    { 
      label: "Incoming Fuel",   //incoming fuel
      icon: Droplets, 
      href: "/incoming-fuel", 
      roles: ["admin", "superadmin"] 
    },
    { 
      label: "Shift", 
      icon: Clock, 
      href: "/shifts", 
      roles: ["admin", "superadmin"] 
    },
   {
  label: "Fuel Type",
  icon: Fuel,
  href: "/fuel-type",
  roles: ["admin", "superadmin"]
},
    { 
      label: "Master", 
      icon: Settings, 
      href: "#", 
      roles: ["admin", "superadmin"],
      subItems: [
        { label: "Add Fuel Type", icon: Fuel, href: "/fuel-types/new" },
        { label: "Add New Nozzle", icon: Droplets, href: "/nozzles/new" },
        { label: "Add Payment Type", icon: CreditCard, href: "/payment-types/new" },
        { label: "Add Employee", icon: UserPlus, href: "/employees/new" },
        { label: "Add Vehicle", icon: Car, href: "/vehicles/new" },
        { label: "Add Address", icon: MapPin, href: "/addresses/new" }
      ]
    }
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  const handleRestrictedAccess = (item: NavItem) => {
    if (!item.roles.includes(userRole)) {
      toast({
        title: "Access Restricted",
        description: "You don't have permission to access this area",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "h-screen bg-white shadow-md transition-all duration-300 relative flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Droplets className="h-6 w-6 text-pumpPrimary" />
            <span className="font-bold text-xl text-pumpPrimary">PumpPal</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-col flex-grow p-3 space-y-2 overflow-y-auto">
        <TooltipProvider>
          {filteredNavItems.map((item) => (
            <React.Fragment key={item.href}>
              {item.subItems ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        collapsed && "justify-center",
                        location.pathname.startsWith(item.href.split('#')[0]) && 
                        "bg-pumpLight text-pumpPrimary font-medium"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
                      {!collapsed && <span>{item.label}</span>}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuGroup>
                      {item.subItems.map((subItem) => (
                        <DropdownMenuItem key={subItem.href} asChild>
                          <Link 
                            to={subItem.href}
                            className="flex items-center"
                          >
                            <subItem.icon className="h-4 w-4 mr-2" />
                            <span>{subItem.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Tooltip key={item.href} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center p-2 rounded-lg transition-all hover:bg-pumpBg",
                        location.pathname === item.href
                          ? "bg-pumpLight text-pumpPrimary font-medium"
                          : "text-pumpNeutral",
                        collapsed && "justify-center"
                      )}
                      onClick={() => handleRestrictedAccess(item)}
                    >
                      <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              )}
            </React.Fragment>
          ))}
        </TooltipProvider>
      </div>

      <div className="p-4 border-t flex flex-col gap-2">
  <TooltipProvider>
    {isAuthenticated && user ? (
      <>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Link
              to="/profile"
              className={cn(
                "flex items-center p-2 rounded-lg text-pumpNeutral hover:bg-pumpBg",
                collapsed && "justify-center"
              )}
            >
              <User className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.first_name} {user.last_name}</span>
                  <span className="text-xs">{user.email}</span>
                </div>
              )}
            </Link>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">
              <p>{user.name}</p>
              <p className="text-xs">{user.email}</p>
            </TooltipContent>
          )}
        </Tooltip>

        <Tooltip delayDuration={300}>
          <LogoutButton />
        </Tooltip>
      </>
    ) : (
      <Link
        to="/login"
        className={cn(
          "w-full p-2 rounded-lg text-green-600 text-sm hover:bg-green-50 flex items-center",
          collapsed && "justify-center"
        )}
      >
        ⇪ {!collapsed && <span className="ml-2">Login</span>}
      </Link>
    )}
  </TooltipProvider>
</div>

    </div>
  );
};

export default Sidebar;
