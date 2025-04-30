
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FuelTypeForm } from "@/components/fuel-types/SimpleForm";

const NewFuelType = () => {
  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Fuel Type</CardTitle>
        </CardHeader>
        <CardContent>
          <FuelTypeForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewFuelType;
