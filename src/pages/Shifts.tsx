import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ShiftForm from "@/components/shifts/ShiftForm";
import ShiftTable from "@/components/shifts/ShiftTable";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Shift } from "@/types/schema";
import { useAuth } from "../contexts/AuthContext";

const Shifts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth(); // user.pumpId must be available

  const fetchShifts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`http://localhost:3000/api/v1/shift/${user.pumpId}`);
      setShifts(res.data);
    } catch (err) {
      console.error("Error fetching shifts:", err);
      setError("Failed to load shifts data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.pumpId) fetchShifts();
  }, [user?.pumpId]);

  const handleShiftAdded = async (newShift: Partial<Shift>) => {
    try {
      await axios.post("http://localhost:3000/api/v1/shift", newShift);
      toast({ title: "Shift added", description: "New shift has been added." });
      fetchShifts();
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
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shifts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pumpPrimary hover:bg-pumpSecondary">
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
        <div className="text-red-500">{error}</div>
      ) : (
        <ShiftTable shifts={shifts} />
      )}
    </div>
  );
};

export default Shifts;
