import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PumpLogForm from "@/components/pump-logs/PumpLogForm";
import PumpLogTable from "@/components/pump-logs/PumpLogTable";
import { PumpLog } from "@/types/schema";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
  

const PumpLogs = () => {
  
  const [pumpLogs, setPumpLogs] = useState<PumpLog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPumpLogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/pump-log/${user.pumpId}`
      );
      const logs = Array.isArray(response.data) ? response.data : [response.data];
      setPumpLogs(logs);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch pump logs", err);
      setError("Failed to fetch pump logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPumpLogs();
  }, [user.pumpId]);

  const handlePumpLogAdded = async (newPumpLog: Partial<PumpLog>) => {
    try {
      await axios.post("http://localhost:3000/api/v1/pump-log", newPumpLog);
      toast({
        title: "Pump log added",
        description: "The new pump log has been added successfully.",
      });
      fetchPumpLogs(); // Refetch data
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
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pump Logs</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pumpPrimary hover:bg-pumpSecondary">
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
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <PumpLogTable pumpLogs={pumpLogs} />
      )}
    </div>
  );
};

export default PumpLogs;
