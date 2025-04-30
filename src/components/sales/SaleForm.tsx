
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockPumps, mockEmployees, mockNozzles } from "@/data/mockData";

const saleSchema = z.object({
  quantity: z.coerce.number().positive("Quantity must be positive"),
  rate_per_l: z.coerce.number().positive("Rate per liter must be positive"),
  amount: z.coerce.number().positive("Amount must be positive"),
  pump_id: z.string({
    required_error: "Pump is required",
  }),
  employee_log_id: z.string({
    required_error: "Employee is required",
  }),
  nozzle_id: z.string({
    required_error: "Nozzle is required",
  }),
});

type SaleFormValues = z.infer<typeof saleSchema>;

interface SaleFormProps {
  onSuccess: (data: SaleFormValues) => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ onSuccess }) => {
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      quantity: 0,
      rate_per_l: 0,
      amount: 0,
      pump_id: "",
      employee_log_id: "",
      nozzle_id: "",
    },
  });

  // Watch quantity and rate to calculate amount
  const quantity = form.watch("quantity");
  const ratePerL = form.watch("rate_per_l");

  useEffect(() => {
    if (quantity && ratePerL) {
      const calculatedAmount = quantity * ratePerL;
      form.setValue("amount", parseFloat(calculatedAmount.toFixed(2)));
    }
  }, [quantity, ratePerL, form]);

  const onSubmit = (data: SaleFormValues) => {
    try {
      onSuccess(data);
      toast.success("Sale added successfully");
    } catch (error) {
      toast.error("Failed to add sale");
      console.error(error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Add New Sale</DialogTitle>
        <DialogDescription>
          Complete the form below to add a new sale record.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (Liters)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number"
                      step="0.01"
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rate_per_l"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate per Liter</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number"
                      step="0.01" 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.01" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pump_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pump</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pump" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockPumps.map(pump => (
                      <SelectItem key={pump.id} value={pump.id}>
                        {pump.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="employee_log_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockEmployees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nozzle_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nozzle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a nozzle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockNozzles.map(nozzle => (
                        <SelectItem key={nozzle.id} value={nozzle.id}>
                          {nozzle.friendly_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">Add Sale</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default SaleForm;
