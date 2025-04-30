
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { EmployeeLog } from "@/types/schema";
import { useAuth } from "../contexts/AuthContext";
import { EmployeeLogAPI } from "@/services/api";
import { useApi } from "@/hooks/use-api";

const EmployeeLogs = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<EmployeeLog | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const { 
    data: employeeLogs = [], 
    isLoading, 
    error, 
    refetch 
  } = useApi<EmployeeLog[]>(
    async () => {
      const response = await EmployeeLogAPI.getByPumpId(user?.pumpId || "");
      return response.data || [];
    },
    { 
      dependencies: [user?.pumpId],
      defaultData: [] 
    }
  );

  const openDeleteDialog = (log: EmployeeLog) => {
    setSelectedLog(log);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteLog = async () => {
    if (!selectedLog) return;
    
    try {
      await EmployeeLogAPI.delete(selectedLog.id);
      toast({
        title: "Log deleted",
        description: "Employee log has been deleted successfully."
      });
      refetch();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee log.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in px-4 sm:px-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center">
          <div className="space-y-1.5 mb-4 sm:mb-0">
            <CardTitle>Employee Logs</CardTitle>
            <CardDescription>
              Track employee check-in and check-out times
            </CardDescription>
          </div>
          <Button className="ml-0 sm:ml-auto bg-pumpPrimary hover:bg-pumpSecondary w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Log Entry
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-pumpPrimary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> Failed to load employee logs.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable
                columns={[
                  {
                    header: "Employee",
                    id: "employee",
                    cell: (row) =>
                      row.user
                        ? `${row.user.first_name} ${row.user.last_name}`
                        : "Unknown",
                  },
                  {
                    header: "Shift",
                    id: "shift",
                    cell: (row) => row.shift?.friendly_name || "N/A",
                  },
                  {
                    header: "Nozzle",
                    id: "nozzle",
                    cell: (row) => row.nozzle?.friendly_name || "N/A",
                  },
                  {
                    header: "On Time",
                    accessorKey: "is_on_time",
                    cell: (row) => (row.is_on_time ? "Yes" : "No"),
                  },
                  {
                    header: "In Uniform",
                    accessorKey: "is_in_uniform",
                    cell: (row) => (row.is_in_uniform ? "Yes" : "No"),
                  },
                  {
                    header: "Remark",
                    accessorKey: "additional_remark",
                    cell: (row) => row.additional_remark || "-",
                  },
                  {
                    header: "Created At",
                    accessorKey: "created_at",
                    cell: (row) =>
                      row.created_at
                        ? new Date(row.created_at).toLocaleString()
                        : "Unknown",
                  },
                ]}
                data={employeeLogs}
                onDelete={(row) => openDeleteDialog(row)}
                searchPlaceholder="Search logs..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee Log</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee log? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLog} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeeLogs;
