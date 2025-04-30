
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { User } from "@/types/schema";
import { useApi } from "@/hooks/use-api";
import { UserAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { formatDate, getFullName } from "@/lib/utils";
import UserForm from "@/components/users/UserForm";

const Users = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  const { data: users, isLoading, error, refetch } = useApi<User[]>(
    () => UserAPI.getAll(),
    { defaultData: [] }
  );

  const handleAddUser = async (userData: Partial<User>) => {
    try {
      await UserAPI.create(userData);
      toast({
        title: "User added",
        description: `${userData.first_name} ${userData.last_name} has been added successfully.`
      });
      refetch();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = async (userData: Partial<User>) => {
    if (!selectedUser) return;
    
    try {
      await UserAPI.update(selectedUser.id, userData);
      toast({
        title: "User updated",
        description: `${userData.first_name} ${userData.last_name} has been updated successfully.`
      });
      refetch();
      setIsFormOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await UserAPI.delete(selectedUser.id);
      toast({
        title: "User deleted",
        description: `${selectedUser.first_name} ${selectedUser.last_name} has been deleted.`
      });
      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const openEditForm = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (item: any) => getFullName(item),
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (item: any) => item.email || "N/A",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (item: any) => item.role || "User",
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: (item: any) => formatDate(item.created_at),
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="space-y-1.5">
            <CardTitle>Users</CardTitle>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                className="ml-auto bg-pumpPrimary hover:bg-pumpSecondary"
                onClick={() => setSelectedUser(null)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </DialogTrigger>
            <UserForm 
              onSuccess={selectedUser ? handleEditUser : handleAddUser} 
              initialData={selectedUser || undefined}
              title={selectedUser ? "Edit User" : "Add New User"}
            />
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-pumpPrimary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> Failed to load users. Please try again later.</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={users || []}
              onEdit={(user) => openEditForm(user)}
              onDelete={(user) => openDeleteDialog(user)}
              searchPlaceholder="Search users..."
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-pumpRed mr-2" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.first_name} {selectedUser?.last_name}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-pumpRed hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
