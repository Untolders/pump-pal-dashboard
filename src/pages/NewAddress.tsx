
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddressForm from "@/components/addresses/AddressForm";

const NewAddress = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Add New Address</h1>
      <div className="max-w-2xl mx-auto">
        <AddressForm />
      </div>
    </div>
  );
};

export default NewAddress;
