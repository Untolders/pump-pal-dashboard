
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  quantity: z.number().default(0),
  pump: z.string({
    required_error: "Please select a pump",
  }),
});

// Mock pumps data (in a real app, this would come from an API)
const pumps = [
  { id: "1", name: "Pump 1" },
  { id: "2", name: "Pump 2" },
  { id: "3", name: "Pump 3" },
  { id: "4", name: "Pump 4" },
];

export function FuelTypeForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 0,
      pump: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Fuel type added",
      description: `${values.name} has been added successfully with ${values.quantity} liters in ${values.pump}`,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fuel Type Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Premium Diesel" {...field} />
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
              <FormLabel>Initial Quantity (Liters)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Default value is 0 if not specified
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pump"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Pump</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pump" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pumps.map((pump) => (
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

        <Button type="submit" className="bg-pumpPrimary hover:bg-pumpSecondary">
          Add Fuel Type
        </Button>
      </form>
    </Form>
  );
}
