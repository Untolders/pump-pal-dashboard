import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const EmployeeLogs = () => {
  const [employeeLogs, setEmployeeLogs] = useState<EmployeeLog[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<EmployeeLog | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const openDeleteDialog = (log: EmployeeLog) => {
    setSelectedLog(log);
    setIsDeleteDialogOpen(true);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if (!user?.pumpId) return;
        
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/v1/employee-logs?pump_id=${user.pumpId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const logs = Array.isArray(response.data)
          ? response.data.map((log) => JSON.parse(JSON.stringify(log)))
          : [];
        
        setEmployeeLogs(logs);
      } catch (error) {
        console.error("Error fetching employee logs:", error);
      }
    };

    fetchLogs();
  }, [user?.pumpId]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="space-y-1.5">
            <CardTitle>Employee Logs</CardTitle>
            <CardDescription>
              Track employee check-in and check-out times
            </CardDescription>
          </div>
          <Button className="ml-auto bg-pumpPrimary hover:bg-pumpSecondary">
            <Plus className="mr-2 h-4 w-4" />
            Add Log Entry
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
          columns={[
            {
              header: "Employee",
              accessorKey: "user.first_name",
              cell: (row) =>
                row.user
                  ? `${row.user.first_name} ${row.user.last_name}`
                  : "Unknown",
            },
            {
              header: "Shift",
              accessorKey: "shift.friendly_name",
              cell: (row) => row.shift?.friendly_name || "N/A",
            },
            {
              header: "Nozzle",
              accessorKey: "nozzle.friendly_name",
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
        </CardContent>
      </Card>

      {/* Optional: Add your AlertDialog for deletion */}
    </div>
  );
};

export default EmployeeLogs;
