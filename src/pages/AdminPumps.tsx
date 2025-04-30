
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pump } from "@/types/schema";
import { useApi } from "@/hooks/use-api";
import { PumpAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import PumpForm from "@/components/pumps/PumpForm";

const AdminPumps = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPump, setSelectedPump] = useState<Pump | null>(null);
  const { toast } = useToast();
  
  const { data: pumps, isLoading, error, refetch } = useApi<Pump[]>(
    () => PumpAPI.getAll(),
    { defaultData: [] }
  );

  const handleAddPump = async (pumpData: Partial<Pump>) => {
    try {
      await PumpAPI.create(pumpData);
      toast({
        title: "Pump added",
        description: `${pumpData.name} has been added successfully.`
      });
      refetch();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding pump:", error);
    }
  };

  const handleEditPump = async (pumpData: Partial<Pump>) => {
    if (!selectedPump) return;
    
    try {
      await PumpAPI.update(selectedPump.id, pumpData);
      toast({
        title: "Pump updated",
        description: `${pumpData.name} has been updated successfully.`
      });
      refetch();
      setIsFormOpen(false);
      setSelectedPump(null);
    } catch (error) {
      console.error("Error updating pump:", error);
    }
  };

  const handleDeletePump = async () => {
    if (!selectedPump) return;
    
    try {
      await PumpAPI.delete(selectedPump.id);
      toast({
        title: "Pump deleted",
        description: `${selectedPump.name} has been deleted.`
      });
      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedPump(null);
    } catch (error) {
      console.error("Error deleting pump:", error);
    }
  };

  const openDeleteDialog = (pump: Pump) => {
    setSelectedPump(pump);
    setIsDeleteDialogOpen(true);
  };

  const openEditForm = (pump: Pump) => {
    setSelectedPump(pump);
    setIsFormOpen(true);
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (item: any) => item.email || "N/A",
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (item: any) => item.phone || "N/A",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => {
        const status = item.status || "active";
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
            ${status === 'active' ? 'bg-green-100 text-green-800' : 
              status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: "Address",
      id: "address",
      cell: (item: any) => {
        if (item.address) {
          return `${item.address.address_line_1}, ${item.address.city}, ${item.address.state}`;
        }
        return "N/A";
      },
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
            <CardTitle>Pumps</CardTitle>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                className="ml-auto bg-pumpPrimary hover:bg-pumpSecondary"
                onClick={() => setSelectedPump(null)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Pump
              </Button>
            </DialogTrigger>
            <PumpForm 
              onSuccess={selectedPump ? handleEditPump : handleAddPump} 
              initialData={selectedPump || undefined}
              title={selectedPump ? "Edit Pump" : "Add New Pump"}
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
              <span className="block sm:inline"> Failed to load pumps. Please try again later.</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={pumps || []}
              onEdit={(pump) => openEditForm(pump)}
              onDelete={(pump) => openDeleteDialog(pump)}
              searchPlaceholder="Search pumps..."
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
              Delete Pump
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPump?.name}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePump}
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

export default AdminPumps;
