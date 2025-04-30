import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Define the pump schema
const pumpSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.object({
    address_line_1: z.string(),
    address_line_2: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
  }),
});

// Define the shift schema
const shiftSchema = z.object({
  friendly_name: z.string().min(1, "Name is required"),
  start: z.date({ required_error: "Start date is required" }),
  end: z.date({ required_error: "End date is required" }),
  pump: pumpSchema, // Now fixed and set in the code
}).refine(data => data.end > data.start, {
  message: "End date must be after start date",
  path: ["end"],
});

type ShiftFormValues = z.infer<typeof shiftSchema>;

interface ShiftFormProps {
  onSuccess: (data: ShiftFormValues) => void;
}

const ShiftForm: React.FC<ShiftFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      friendly_name: "",
    },
  });

  const [pump, setPump] = useState<any>(null);

  useEffect(() => {
    // Fetch a single pump based on the user's pumpId
    fetch(`http://localhost:3000/api/v1/pump/${user.pumpId}`)
      .then(res => res.json())
      .then(data => setPump(data))
      .catch((error) => console.error("Error fetching pump:", error));
  }, [user.pumpId]);

  const onSubmit = async (data: ShiftFormValues) => {
    try {
      // Add the fixed pump data to the form data
      data.pump = pump;

      await fetch("http://localhost:3000/api/v1/shift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      toast.success("Shift added successfully");
      onSuccess(data);
    } catch (error) {
      toast.error("Failed to add shift");
      console.error(error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Add New Shift</DialogTitle>
        <DialogDescription>
          Complete the form below to add a new shift.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="friendly_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Friendly Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Morning Shift, Evening Shift, etc." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date/Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP HH:mm")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <Input
                          type="time"
                          onChange={(e) => {
                            const date = new Date(field.value || new Date());
                            const [hours, minutes] = e.target.value.split(':').map(Number);
                            date.setHours(hours, minutes);
                            field.onChange(date);
                          }}
                          defaultValue={field.value ? format(field.value, "HH:mm") : "00:00"}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date/Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP HH:mm")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <Input
                          type="time"
                          onChange={(e) => {
                            const date = new Date(field.value || new Date());
                            const [hours, minutes] = e.target.value.split(':').map(Number);
                            date.setHours(hours, minutes);
                            field.onChange(date);
                          }}
                          defaultValue={field.value ? format(field.value, "HH:mm") : "00:00"}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Remove pump input as it's fixed */}
          <div className="hidden">
            <FormField
              control={form.control}
              name="pump"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pump</FormLabel>
                  <FormControl>
                    <Input {...field} value={pump?.name} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">Add Shift</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ShiftForm;
