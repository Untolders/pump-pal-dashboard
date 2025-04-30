
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PaymentForm from "@/components/payments/PaymentForm";
import PaymentTable from "@/components/payments/PaymentTable";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentAPI } from "@/services/api";
import { Payment } from "@/types/schema";

const Payments = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { 
    data: paymentsData = [], 
    isLoading, 
    error, 
    refetch 
  } = useApi<Payment[]>(
    async () => {
      const response = await PaymentAPI.getByPumpId(user?.pumpId || "");
      return response.data || [];
    },
    { 
      dependencies: [user?.pumpId],
      defaultData: [] 
    }
  );

  // Handle new payment submission
  const handlePaymentAdded = async (newPayment: any) => {
    if (!user?.pumpId) {
      toast({ title: "Error", description: "Pump ID not found.", variant: "destructive" });
      return;
    }

    try {
      await PaymentAPI.createForPump(user.pumpId, newPayment);
      toast({ title: "Payment added", description: "The new payment has been added successfully." });
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding payment:", error);
      toast({
        title: "Error",
        description: "Failed to add the new payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Payments</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pumpPrimary hover:bg-pumpSecondary w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add New Payment
            </Button>
          </DialogTrigger>
          <PaymentForm onSuccess={handlePaymentAdded} />
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-pumpPrimary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error.message}</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <PaymentTable payments={paymentsData || []} />
        </div>
      )}
    </div>
  );
};

export default Payments;
