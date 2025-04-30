
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
import { User } from "@/types/schema";
import { useApi } from "@/hooks/use-api";
import { AddressAPI, mockPaginatedResponse } from "@/services/api";
import { mockPumps } from "@/data/mockData";

const userFormSchema = z.object({
  auth0_user_id: z.string().min(1, { message: "Auth0 ID is required" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" })
    .max(15, { message: "Phone number must not exceed 15 characters" }),
  role: z.string().min(1, { message: "Role is required" }),
  address_id: z.string().optional(),
});

interface UserFormProps {
  onSuccess: (data: any) => void;
  initialData?: User;
  title?: string;
}

const UserForm: React.FC<UserFormProps> = ({ onSuccess, initialData, title = "Add New User" }) => {
  // Fetch addresses for dropdown
  const { data: addresses, isLoading: addressesLoading } = useApi(
    () => AddressAPI.getAll().catch(() => mockPaginatedResponse([])),
    { defaultData: [] }
  );

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData ? {
      auth0_user_id: initialData.auth0_user_id || "",
      first_name: initialData.first_name || "",
      middle_name: initialData.middle_name || "",
      last_name: initialData.last_name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      role: initialData.role || "user",
      address_id: initialData.address_id || "",
    } : {
      auth0_user_id: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "user",
      address_id: "",
    }
  });

  const onSubmit = (data: z.infer<typeof userFormSchema>) => {
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
            name="auth0_user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Auth0 User ID</FormLabel>
                <FormControl>
                  <Input placeholder="auth0|123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
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
                    <Input placeholder="Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
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

export default UserForm;
