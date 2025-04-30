
import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface VehicleFormData {
  friendly_name: string;
  vehicle_number: string;
}

const VehicleForm = () => {
  const { toast } = useToast();
  const form = useForm<VehicleFormData>({
    defaultValues: {
      friendly_name: "",
      vehicle_number: "",
    },
  });

  const onSubmit = (data: VehicleFormData) => {
    toast({
      title: "Vehicle Added",
      description: `Vehicle ${data.friendly_name} has been added successfully.`,
    });
    console.log(data);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="friendly_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Friendly Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Family Car" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vehicle_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Number</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Add Vehicle</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;
