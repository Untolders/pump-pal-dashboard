import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  ArrowLeft, 
  Users, 
  Fuel, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert,
  UserPlus,
  UserX,
  Edit,
  MoreHorizontal
} from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { AdminAPI } from "@/services/api";
import { PumpDetails, User, FuelType } from "@/types/schema";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import UserForm from "@/components/users/UserForm";

const AdminPumpDetails = () => {
  const { pumpId } = useParams<{ pumpId: string }>();
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const { data: pumpDetails, isLoading, error, refetch } = useApi<PumpDetails>(
    () => AdminAPI.getPumpDetails(pumpId!),
    { dependencies: [pumpId] }
  );

  const handleBlockUser = async (userId: string) => {
    try {
      await AdminAPI.blockUser(userId);
      toast({
        title: "User blocked",
        description: "User has been blocked successfully."
      });
      refetch();
      setIsBlockDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to block user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await AdminAPI.unblockUser(userId);
      toast({
        title: "User unblocked",
        description: "User has been unblocked successfully."
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unblock user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddUser = async (userData: Partial<User>) => {
    try {
      await AdminAPI.addUserToPump(pumpId!, userData);
      toast({
        title: "User added",
        description: "User has been added to this pump successfully."
      });
      refetch();
      setIsUserFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const userColumns = [
    {
      header: "Name",
      id: "name",
      cell: (item: User) => `${item.first_name} ${item.last_name}`,
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (item: User) => item.email || "N/A",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (item: User) => (
        <Badge variant="secondary">{item.role || "user"}</Badge>
      ),
    },
    {
      header: "Status",
      id: "status",
      cell: (item: User) => (
        <Badge variant={item.role === "blocked" ? "destructive" : "default"}>
          {item.role === "blocked" ? "Blocked" : "Active"}
        </Badge>
      ),
    },
    {
      header: "Joined",
      accessorKey: "created_at",
      cell: (item: User) => formatDate(item.created_at),
    },
  ];

  const fuelTypeColumns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      cell: (item: FuelType) => `${item.quantity}L`,
    },
    {
      header: "Price/L",
      accessorKey: "pricePerLiter",
      cell: (item: FuelType) => formatCurrency(item.pricePerLiter || 0),
    },
    {
      header: "Last Updated",
      accessorKey: "updated_at",
      cell: (item: FuelType) => formatDate(item.updated_at || item.created_at),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !pumpDetails) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-destructive">Error Loading Pump Details</h3>
              <p className="text-muted-foreground">Failed to load pump information. Please try again.</p>
              <Button onClick={() => refetch()} className="mt-4">Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/pumps">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pumps
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{pumpDetails.name}</h1>
            <p className="text-muted-foreground">Pump Details & Management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={pumpDetails.status === "active" ? "default" : "secondary"}>
            {pumpDetails.status}
          </Badge>
          {pumpDetails.isBlocked && (
            <Badge variant="destructive">Blocked</Badge>
          )}
        </div>
      </div>

      {/* Pump Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pumpDetails.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {pumpDetails.users?.length || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pumpDetails.monthlyStats?.sales || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pumpDetails.monthlyStats?.transactions || 0} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Types</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pumpDetails.fuelTypes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Available types</p>
          </CardContent>
        </Card>
      </div>

      {/* Pump Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Pump Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Contact Details</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Phone:</span> {pumpDetails.phone}</p>
              <p><span className="font-medium">Email:</span> {pumpDetails.email}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Address</h3>
            <div className="text-sm">
              {pumpDetails.address ? (
                <div>
                  <p>{pumpDetails.address.address_line_1}</p>
                  {pumpDetails.address.address_line_2 && <p>{pumpDetails.address.address_line_2}</p>}
                  <p>{pumpDetails.address.city}, {pumpDetails.address.state}</p>
                  <p>{pumpDetails.address.country}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No address on file</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users & Employees</CardTitle>
            <p className="text-sm text-muted-foreground">Manage users assigned to this pump</p>
          </div>
          <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <UserForm 
              onSuccess={handleAddUser}
              title="Add User to Pump"
            />
          </Dialog>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={userColumns}
            data={pumpDetails.users || []}
            onEdit={(user) => {
              // Handle edit user
              console.log("Edit user:", user);
            }}
            onDelete={(user) => {
              setSelectedUser(user);
              setIsBlockDialogOpen(true);
            }}
            searchPlaceholder="Search users..."
            editLabel="Edit"
            deleteLabel="Block"
          />
        </CardContent>
      </Card>

      {/* Fuel Types */}
      <Card>
        <CardHeader>
          <CardTitle>Fuel Types</CardTitle>
          <p className="text-sm text-muted-foreground">Available fuel types at this pump</p>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={fuelTypeColumns}
            data={pumpDetails.fuelTypes || []}
            searchPlaceholder="Search fuel types..."
            showActions={false}
          />
        </CardContent>
      </Card>

      {/* Block User Confirmation Dialog */}
      <AlertDialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <ShieldAlert className="h-5 w-5 text-destructive mr-2" />
              Block User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block {selectedUser?.first_name} {selectedUser?.last_name}? 
              They will no longer be able to access this pump.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUser && handleBlockUser(selectedUser.id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Block User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPumpDetails;