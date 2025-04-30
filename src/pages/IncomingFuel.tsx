import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import IncomingFuelTable from "@/components/incoming-fuel/IncomingFuelTable";
import AddIncomingFuelForm from "@/components/incoming-fuel/IncomingFuelForm";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

const IncomingFuel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);

  const {
    data: incomingFuelLogs,
    isLoading,
    error,
    refetch
  } = useApi<any[]>(
    () =>
      fetch(`http://localhost:3000/api/v1/incoming-fuel-log/${user?.pumpId}`).then(res =>
        res.json()
      ),
    { defaultData: [] }
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="space-y-1.5">
            <CardTitle>Incoming Fuel Logs</CardTitle>
            <CardDescription>
              View and add new incoming fuel entries
            </CardDescription>
          </div>
          <Button
            className="ml-auto bg-pumpPrimary hover:bg-pumpSecondary"
            onClick={() => setOpenDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-pumpPrimary border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <strong className="font-bold">Error:</strong> Failed to load data.
            </div>
          ) : (
            <IncomingFuelTable fuelLogs={incomingFuelLogs} />
          )}
        </CardContent>
      </Card>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Incoming Fuel</AlertDialogTitle>
            <AlertDialogDescription>
              Fill out the form to add new incoming fuel data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AddIncomingFuelForm
            onSuccess={() => {
              setOpenDialog(false);
              refetch();
              toast({
                title: "Success",
                description: "Incoming fuel log added.",
              });
            }}
            onCancel={() => setOpenDialog(false)}
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IncomingFuel;
