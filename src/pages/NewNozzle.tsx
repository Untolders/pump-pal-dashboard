
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NozzleForm from "@/components/nozzles/NozzleForm";

const NewNozzle = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Add New Nozzle</h1>
      <div className="max-w-2xl mx-auto">
        <NozzleForm />
      </div>
    </div>
  );
};

export default NewNozzle;
