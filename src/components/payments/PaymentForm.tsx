
import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockPumps } from "@/data/mockData";
import { X, Plus } from "lucide-react";

const paymentSchema = z.object({
  pump_id: z.string({
    required_error: "Pump is required",
  }),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  address: z.string().optional(),
  payment_items: z.array(
    z.object({
      type: z.string().min(1, "Type is required"),
      amount: z.coerce.number().positive("Amount must be positive"),
    })
  ).min(1, "At least one payment item is required"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onSuccess: (data: PaymentFormValues) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess }) => {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      pump_id: "",
      phone: "",
      email: "",
      address: "",
      payment_items: [
        { type: "", amount: 0 }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "payment_items",
  });

  const handlePumpChange = (pumpId: string) => {
    const selectedPump = mockPumps.find(p => p.id === pumpId);
    if (selectedPump) {
      form.setValue("phone", selectedPump.phone || "");
      form.setValue("email", selectedPump.email || "");
      form.setValue("address", selectedPump.address || "");
    }
  };

  const onSubmit = (data: PaymentFormValues) => {
    try {
      onSuccess(data);
      toast.success("Payment added successfully");
    } catch (error) {
      toast.error("Failed to add payment");
      console.error(error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Add New Payment</DialogTitle>
        <DialogDescription>
          Complete the form below to add a new payment record.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="pump_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pump</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handlePumpChange(value);
                  }} 
                  defaultValue={field.value}
                >
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

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <FormLabel className="text-base">Payment Items</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ type: "", amount: 0 })}
              >
                <Plus className="mr-1 h-4 w-4" /> Add Item
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-end">
                <FormField
                  control={form.control}
                  name={`payment_items.${index}.type`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className={index !== 0 ? "sr-only" : ""}>Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Item type (e.g. Petrol, UPI)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`payment_items.${index}.amount`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className={index !== 0 ? "sr-only" : ""}>Amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          placeholder="Amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mb-2"
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">Add Payment</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default PaymentForm;
