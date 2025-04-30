
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  auth0_user_id: z.string().min(3, "User ID is required"),
  first_name: z.string().min(2, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(2, "Last name is required"),
  address_id: z.string({
    required_error: "Please select an address",
  }),
  phone: z.string().min(10).max(15, "Phone number should be between 10-15 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  pump: z.string({
    required_error: "Please select a pump",
  }),
});

// Mock addresses data (in a real app, this would come from an API)
const addresses = [
  { id: "1", displayName: "123 Main St, Anytown" },
  { id: "2", displayName: "456 Oak Ave, Somewhere" },
  { id: "3", displayName: "789 Pine Rd, Nowhere" },
];

// Mock pumps data
const pumps = [
  { id: "1", name: "Pump 1" },
  { id: "2", name: "Pump 2" },
  { id: "3", name: "Pump 3" },
];

const EmployeeForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      auth0_user_id: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      address_id: "",
      phone: "",
      email: "",
      pump: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Employee added successfully",
      description: `${values.first_name} ${values.last_name} has been added to the system.`,
    });
    console.log(values);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Employee</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="auth0_user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auth0 User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="auth0|123456789" {...field} />
                  </FormControl>
                  <FormDescription>
                    Unique identifier from Auth0
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Michael" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an address" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {addresses.map((address) => (
                        <SelectItem key={address.id} value={address.id}>
                          {address.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <Button type="submit">Add Employee</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
