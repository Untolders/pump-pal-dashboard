import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { 
  Users, 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  Droplets,
  Activity,
  Eye
} from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { AdminAPI } from "@/services/api";
import { AdminDashboardStats, ActivityLog } from "@/types/schema";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useApi<AdminDashboardStats>(
    () => AdminAPI.getDashboardStats(),
    { defaultData: {
      totalPumps: 0,
      activePumps: 0,
      blockedPumps: 0,
      totalUsers: 0,
      activeUsers: 0,
      totalSalesToday: 0,
      totalVolumeToday: 0,
      recentActivities: []
    } }
  );

  const activityColumns = [
    {
      header: "Action",
      accessorKey: "action",
      cell: (item: ActivityLog) => (
        <Badge 
          variant={
            item.action === 'login' || item.action === 'signup' ? 'default' :
            item.action === 'create' ? 'secondary' :
            item.action === 'update' ? 'outline' :
            item.action === 'delete' || item.action === 'block' ? 'destructive' :
            'secondary'
          }
        >
          {item.action.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: "User",
      id: "user",
      cell: (item: ActivityLog) => `${item.user.first_name} ${item.user.last_name}`,
    },
    {
      header: "Entity",
      accessorKey: "entity_type",
      cell: (item: ActivityLog) => item.entity_type || "N/A",
    },
    {
      header: "Pump",
      id: "pump",
      cell: (item: ActivityLog) => item.pump?.name || "N/A",
    },
    {
      header: "Time",
      accessorKey: "created_at",
      cell: (item: ActivityLog) => formatDate(item.created_at),
    },
    {
      header: "IP Address",
      accessorKey: "ip_address",
      cell: (item: ActivityLog) => item.ip_address || "N/A",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Control Panel</h1>
          <p className="text-muted-foreground">Manage your entire pump network</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/pumps">
            <Button>
              <Building2 className="h-4 w-4 mr-2" />
              Manage Pumps
            </Button>
          </Link>
          <Link to="/admin/logs">
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              View Logs
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pumps</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPumps || 0}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                <ShieldCheck className="h-3 w-3 mr-1" />
                {stats?.activePumps || 0} Active
              </Badge>
              <Badge variant="destructive" className="text-xs">
                <ShieldAlert className="h-3 w-3 mr-1" />
                {stats?.blockedPumps || 0} Blocked
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeUsers || 0} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalSalesToday || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalVolumeToday || 0}L sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Today</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVolumeToday || 0}</div>
            <p className="text-xs text-muted-foreground">Liters sold</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activities</CardTitle>
            <p className="text-sm text-muted-foreground">Latest system activities across all pumps</p>
          </div>
          <Link to="/admin/logs">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={activityColumns}
            data={stats?.recentActivities || []}
            searchPlaceholder="Search activities..."
            showActions={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;