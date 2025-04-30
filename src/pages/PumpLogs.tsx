
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PumpLogForm from "@/components/pump-logs/PumpLogForm";
import PumpLogTable from "@/components/pump-logs/PumpLogTable";
import { PumpLog } from "@/types/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { PumpLogAPI } from "@/services/api";
import { useApi } from "@/hooks/use-api";
  
const PumpLogs = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { 
    data: pumpLogs = [], 
    isLoading, 
    error, 
    refetch 
  } = useApi<PumpLog[]>(
    () => PumpLogAPI.getByPumpId(user?.pumpId || ""),
    {
      dependencies: [user?.pumpId],
      defaultData: []
    }
  );

  const handlePumpLogAdded = async (newPumpLog: Partial<PumpLog>) => {
    try {
      await PumpLogAPI.create(newPumpLog);
      toast({
        title: "Pump log added",
        description: "The new pump log has been added successfully.",
      });
      refetch();
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error adding pump log:", err);
      toast({
        title: "Error",
        description: "Failed to add the new pump log. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Pump Logs</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pumpPrimary hover:bg-pumpSecondary w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add New Pump Log
            </Button>
          </DialogTrigger>
          <PumpLogForm onSuccess={handlePumpLogAdded} />
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-pumpPrimary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> Failed to load pump logs</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <PumpLogTable pumpLogs={pumpLogs} />
        </div>
      )}
    </div>
  );
};

export default PumpLogs;
