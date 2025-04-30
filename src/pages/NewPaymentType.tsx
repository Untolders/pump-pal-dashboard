
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentTypeForm from "@/components/payment-types/PaymentTypeForm";

const NewPaymentType = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Add New Payment Type</h1>
      <div className="max-w-2xl mx-auto">
        <PaymentTypeForm />
      </div>
    </div>
  );
};

export default NewPaymentType;
