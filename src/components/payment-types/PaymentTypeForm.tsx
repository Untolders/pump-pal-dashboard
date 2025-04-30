
import React from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
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

const PaymentTypeForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Payment type added successfully",
      description: `${values.name} has been added to the system.`,
    });
    console.log(values);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Payment Type</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Type Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Credit Card" {...field} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <Button type="submit">Add Payment Type</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentTypeForm;
