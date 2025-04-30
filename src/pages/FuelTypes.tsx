import React, { useState, useEffect } from "react";
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

const FuelTypes = () => {
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch fuel types from API
  useEffect(() => {
    const fetchFuelTypes = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/fuel-type/${user.pumpId}`);
        const data = await res.json();
        console.log(data);

        const transformedData: FuelType[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          pricePerLiter: parseFloat(item.quantity || "0"),
          color: item.color || "#9b87f5",
        }));

        setFuelTypes(transformedData);
      } catch (error) {
        toast({
          title: "Error fetching fuel types",
          description: "Could not load fuel types from the server.",
          variant: "destructive",
        });
      }
    };

    fetchFuelTypes();
  }, [user.pumpId]);

  const handleAddFuelType = (newFuelType: FuelType) => {
    setFuelTypes([...fuelTypes, newFuelType]);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="space-y-1.5">
            <CardTitle>Fuel Types</CardTitle>
            <CardDescription>
              Manage the fuel types available at your station
            </CardDescription>
          </div>
          <Button
            className="ml-auto bg-pumpPrimary hover:bg-pumpSecondary"
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
          <DataTable
            columns={[
              {
                header: "Name",
                accessorKey: "name",
                cell: (row) => (
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: row.color }}
                    />
                    <span>{row.name}</span>
                  </div>
                ),
              },
              { header: "Quantity", accessorKey: "quantity" },
              {
                header: "Price",
                accessorKey: "pricePerLiter",
                cell: (row) => (
                  <Badge variant="secondary">₹{row.pricePerLiter.toFixed(2)}/L</Badge>
                ),
              },
            ]}
            data={fuelTypes}
            onAdd={() => {
              setSelectedFuelType(null);
              setIsFormOpen(true);
            }}
            searchPlaceholder="Search fuel types..."
          />
        </CardContent>
      </Card>

      {isFormOpen && (
        <FuelTypeForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedFuelType(null);
          }}
          onSubmit={handleAddFuelType}
          initialData={selectedFuelType || undefined}
          title={"Add New Fuel Type"}
        />
      )}
    </div>
  );
};

export default FuelTypes;
