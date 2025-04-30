
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SaleForm from "@/components/sales/SaleForm";
import SaleTable from "@/components/sales/SaleTable";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { SaleAPI } from "@/services/api";
import { Sale } from "@/types/schema";

const Sales = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { 
    data: salesData = [], 
    isLoading, 
    error, 
    refetch 
  } = useApi<Sale[]>(
    async () => {
      const response = await SaleAPI.getOutgoingFuelLogs();
      return response.data || [];
    },
    { defaultData: [] }
  );

  const handleSaleAdded = async (newSale: Partial<Sale>) => {
    try {
      await SaleAPI.create(newSale);
      toast({
        title: "Sale added",
        description: "The new sale has been added successfully."
      });
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding sale:", error);
      toast({
        title: "Error",
        description: "Failed to add the new sale. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Sales</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pumpPrimary hover:bg-pumpSecondary w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add New Sale
            </Button>
          </DialogTrigger>
          <SaleForm onSuccess={handleSaleAdded} />
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-pumpPrimary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> Failed to load sales data. Please try again later.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <SaleTable sales={salesData} />
        </div>
      )}
    </div>
  );
};

export default Sales;
