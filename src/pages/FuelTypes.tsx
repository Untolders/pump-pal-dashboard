
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { FuelTypeForm } from "@/components/fuel-types/FuelTypeForm";
import { useToast } from "@/hooks/use-toast";
import type { FuelType } from "@/types/schema";
import { useAuth } from "@/contexts/AuthContext";
import { FuelTypeAPI } from "@/services/api";
import { useApi } from "@/hooks/use-api";

const FuelTypes = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const { 
    data: fuelTypes = [], 
    isLoading, 
    error, 
    refetch 
  } = useApi<FuelType[]>(
    async () => {
      const response = await FuelTypeAPI.getByPumpId(user?.pumpId || "");
      return response;
    },
    { 
      dependencies: [user?.pumpId],
      defaultData: [] 
    }
  );

  const handleAddFuelType = async (newFuelType: Partial<FuelType>) => {
    try {
      await FuelTypeAPI.create(newFuelType);
      toast({
        title: "Fuel type added",
        description: `${newFuelType.name} has been added successfully.`
      });
      refetch();
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add fuel type.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in px-4 sm:px-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center">
          <div className="space-y-1.5 mb-4 sm:mb-0">
            <CardTitle>Fuel Types</CardTitle>
            <CardDescription>
              Manage the fuel types available at your station
            </CardDescription>
          </div>
          <Button
            className="ml-0 sm:ml-auto bg-pumpPrimary hover:bg-pumpSecondary w-full sm:w-auto"
            onClick={() => {
              setSelectedFuelType(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Fuel Type
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-pumpPrimary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> Failed to load fuel types.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable
                columns={[
                  {
                    header: "Name",
                    accessorKey: "name",
                    cell: (row) => (
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: row.color || "#9b87f5" }}
                        />
                        <span>{row.name}</span>
                      </div>
                    ),
                  },
                  { 
                    header: "Quantity", 
                    accessorKey: "quantity" 
                  },
                  {
                    header: "Price",
                    accessorKey: "quantity",
                    cell: (row) => {
                      const price = parseFloat(row.quantity || "0");
                      return (
                        <Badge variant="secondary">₹{price.toFixed(2)}/L</Badge>
                      );
                    },
                  },
                ]}
                data={fuelTypes}
                onAdd={() => {
                  setSelectedFuelType(null);
                  setIsFormOpen(true);
                }}
                searchPlaceholder="Search fuel types..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {isFormOpen && (
        <FuelTypeForm
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          defaultValues={selectedFuelType || undefined}
          title={"Add New Fuel Type"}
        />
      )}
    </div>
  );
};

export default FuelTypes;
