
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ShiftForm from "@/components/shifts/ShiftForm";
import ShiftTable from "@/components/shifts/ShiftTable";
import { useToast } from "@/hooks/use-toast";
import { ShiftAPI } from "@/services/api";
import { Shift } from "@/types/schema";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "../contexts/AuthContext";

const Shifts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { 
    data: shifts = [], 
    isLoading, 
    error, 
    refetch 
  } = useApi<Shift[]>(
    () => ShiftAPI.getByPumpId(user?.pumpId || ""),
    { 
      dependencies: [user?.pumpId],
      defaultData: [] 
    }
  );

  const handleShiftAdded = async (newShift: Partial<Shift>) => {
    try {
      await ShiftAPI.create(newShift);
      toast({ 
        title: "Shift added", 
        description: "New shift has been added." 
      });
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the new shift.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Shifts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pumpPrimary hover:bg-pumpSecondary w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add New Shift
            </Button>
          </DialogTrigger>
          <ShiftForm onSuccess={handleShiftAdded} />
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-pumpPrimary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded border border-red-200">
          Failed to load shifts data. Please try again.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <ShiftTable shifts={shifts} />
        </div>
      )}
    </div>
  );
};

export default Shifts;
