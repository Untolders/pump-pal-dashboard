
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Pump } from "@/types/schema";
import { useApi } from "@/hooks/use-api";
import { AddressAPI, mockPaginatedResponse } from "@/services/api";

const pumpFormSchema = z.object({
  name: z.string().min(1, { message: "Pump name is required" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  status: z.enum(["active", "maintenance", "offline"]),
  address_id: z.string().min(1, { message: "Address is required" }),
});

interface PumpFormProps {
  onSuccess: (data: any) => void;
  initialData?: Pump;
  title?: string;
}

const PumpForm: React.FC<PumpFormProps> = ({ onSuccess, initialData, title = "Add New Pump" }) => {
  // Fetch addresses for dropdown
  const { data: addresses, isLoading: addressesLoading } = useApi(
    () => AddressAPI.getAll().catch(() => mockPaginatedResponse([])),
    { defaultData: [] }
  );

  const form = useForm<z.infer<typeof pumpFormSchema>>({
    resolver: zodResolver(pumpFormSchema),
    defaultValues: initialData ? {
      name: initialData.name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      status: (initialData.status as "active" | "maintenance" | "offline") || "active",
      address_id: initialData.address?.id || "",
    } : {
      name: "",
      email: "",
      phone: "",
      status: "active",
      address_id: "",
    }
  });

  const onSubmit = (data: z.infer<typeof pumpFormSchema>) => {
    onSuccess(data);
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pump Name</FormLabel>
                <FormControl>
                  <Input placeholder="Downtown Pump Station" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="pump@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select address" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {addressesLoading ? (
                        <SelectItem value="loading" disabled>Loading addresses...</SelectItem>
                      ) : addresses?.length ? (
                        addresses.map((address: any) => (
                          <SelectItem key={address.id} value={address.id}>
                            {address.address_line_1}, {address.city}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No addresses available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default PumpForm;
