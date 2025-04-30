
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmployeeForm from "@/components/employees/EmployeeForm";

const NewEmployee = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Add New Employee</h1>
      <div className="max-w-2xl mx-auto">
        <EmployeeForm />
      </div>
    </div>
  );
};

export default NewEmployee;
