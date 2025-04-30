import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  quantity: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Quantity must be a positive number" }
  ),
  color: z.string().optional(),
});

interface FuelTypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onSuccess?: () => void;
}

export function FuelTypeForm({
  isOpen,
  onClose,
  title = "Add New Fuel Type",
  onSuccess,
}: FuelTypeFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: "",
      color: "#9b87f5",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const pumpRes = await fetch(`http://localhost:3000/api/v1/pump/${user.pumpId}`);
      const pumpData = await pumpRes.json();
      const pump = pumpData?.pump || pumpData;

      if (!pump || !pump.id) {
        throw new Error("Pump details not found.");
      }

      const payload = {
        name: values.name,
        quantity: parseFloat(values.quantity),
        color: values.color,
        pump: {
          id: pump.id,
          name: pump.name,
          phone: pump.phone,
          email: pump.email,
          address: {
            address_line_1: pump.address?.address_line_1 || "",
            address_line_2: pump.address?.address_line_2 || "",
            city: pump.address?.city || "",
            state: pump.address?.state || "",
            country: pump.address?.country || "",
          },
        },
      };

      const res = await fetch("http://localhost:3000/api/v1/fuel-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create fuel type");
      }

      toast({
        title: "Success!",
        description: `${values.name} has been added successfully.`,
      });

      form.reset();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast({
        title: "Failed to add fuel type",
        description: err.message || "Please check your input or try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription>
            Fill in the details for this fuel type. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Diesel, Petrol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (Liters)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 5000.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input type="color" className="w-12 h-8 p-1" {...field} />
                    </FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      className="flex-1"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-pumpPrimary hover:bg-pumpSecondary">
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
