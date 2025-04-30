import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PaymentForm from "@/components/payments/PaymentForm";
import PaymentTable from "@/components/payments/PaymentTable";
import { Payment } from "@/types/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Payments = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentsData, setPaymentsData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getUserPumpId = (): string | null => {
    try {
      const { user } = useAuth();
      return user.pumpId || null;
    } catch {
      return null;
    }
  };

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);

    
    if (!user.pumpId) {
      setError("Pump ID not found.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/v1/payment/${user.pumpId}`);
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      setPaymentsData(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load payments data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle new payment submission
  const handlePaymentAdded = async (newPayment: Partial<Payment>) => {
    const pumpId = getUserPumpId();
    if (!pumpId) {
      toast({ title: "Error", description: "Pump ID not found.", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/v1/payment/${pumpId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPayment),
      });

      if (!res.ok) throw new Error("Failed to create payment");

      toast({ title: "Payment added", description: "The new payment has been added successfully." });
      fetchPayments(); // Refresh the payments data
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
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pumpPrimary hover:bg-pumpSecondary">
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
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <PaymentTable payments={paymentsData || []} />
      )}
    </div>
  );
};

export default Payments;
