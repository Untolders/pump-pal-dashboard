import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { 
  Activity,
  Search,
  Filter,
  Download,
  RefreshCw,
  User,
  Building2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { AdminAPI } from "@/services/api";
import { ActivityLog } from "@/types/schema";
import { formatDate } from "@/lib/utils";
import { DateRange } from "react-day-picker";

const AdminLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data: logs, isLoading, error, refetch } = useApi<ActivityLog[]>(
    () => AdminAPI.getActivityLogs({
      search: searchTerm,
      action: actionFilter !== "all" ? actionFilter : undefined,
      entity_type: entityFilter !== "all" ? entityFilter : undefined,
      dateFrom: dateRange?.from?.toISOString(),
      dateTo: dateRange?.to?.toISOString(),
    }),
    { 
      defaultData: [],
      dependencies: [searchTerm, actionFilter, entityFilter, dateRange]
    }
  );

  const handleExportLogs = () => {
    // Implement export functionality
    console.log("Exporting logs...");
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
      case 'signup':
        return <User className="h-4 w-4" />;
      case 'create':
        return <CheckCircle className="h-4 w-4" />;
      case 'update':
        return <RefreshCw className="h-4 w-4" />;
      case 'delete':
      case 'block':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login':
      case 'signup':
        return 'default';
      case 'create':
        return 'secondary';
      case 'update':
        return 'outline';
      case 'delete':
      case 'block':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const columns = [
    {
      header: "Action",
      accessorKey: "action",
      cell: (item: ActivityLog) => (
        <div className="flex items-center gap-2">
          {getActionIcon(item.action)}
          <Badge variant={getActionColor(item.action) as any}>
            {item.action.toUpperCase()}
          </Badge>
        </div>
      ),
    },
    {
      header: "User",
      id: "user",
      cell: (item: ActivityLog) => (
        <div>
          <div className="font-medium">{item.user.first_name} {item.user.last_name}</div>
          <div className="text-sm text-muted-foreground">{item.user.email}</div>
        </div>
      ),
    },
    {
      header: "Entity",
      id: "entity",
      cell: (item: ActivityLog) => (
        <div>
          <div className="font-medium">{item.entity_type || "N/A"}</div>
          {item.entity_id && (
            <div className="text-sm text-muted-foreground">ID: {item.entity_id}</div>
          )}
        </div>
      ),
    },
    {
      header: "Pump",
      id: "pump",
      cell: (item: ActivityLog) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span>{item.pump?.name || "N/A"}</span>
        </div>
      ),
    },
    {
      header: "Details",
      accessorKey: "details",
      cell: (item: ActivityLog) => item.details || "N/A",
    },
    {
      header: "IP Address",
      accessorKey: "ip_address",
      cell: (item: ActivityLog) => item.ip_address || "N/A",
    },
    {
      header: "Device",
      accessorKey: "device_info",
      cell: (item: ActivityLog) => item.device_info || "N/A",
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: (item: ActivityLog) => item.location || "N/A",
    },
    {
      header: "Time",
      accessorKey: "created_at",
      cell: (item: ActivityLog) => formatDate(item.created_at),
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground">Monitor all system activities and user actions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="signup">Signup</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="block">Block</SelectItem>
                  <SelectItem value="unblock">Unblock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Entity Type</label>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="pump">Pump</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="shift">Shift</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="fuel_type">Fuel Type</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Logs
            {logs && (
              <Badge variant="secondary">{logs.length} entries</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-1">Failed to load logs. Please try again later.</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={logs || []}
              searchPlaceholder="Search logs..."
              showActions={false}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogs;