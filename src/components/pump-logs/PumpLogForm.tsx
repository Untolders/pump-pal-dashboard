
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockPumps } from "@/data/mockData";
import { Checkbox } from "@/components/ui/checkbox";

const pumpLogSchema = z.object({
  pump_id: z.string({
    required_error: "Pump is required",
  }),
  is_toilet_cleaned: z.boolean().default(false),
  is_solar_panel_cleaned: z.boolean().default(false),
  is_office_cleaned: z.boolean().default(false),
  is_pump_area_cleaned: z.boolean().default(false),
  is_generator_fuel_ok: z.boolean().default(false),
});

type PumpLogFormValues = z.infer<typeof pumpLogSchema>;

interface PumpLogFormProps {
  onSuccess: (data: PumpLogFormValues) => void;
}

const PumpLogForm: React.FC<PumpLogFormProps> = ({ onSuccess }) => {
  const form = useForm<PumpLogFormValues>({
    resolver: zodResolver(pumpLogSchema),
    defaultValues: {
      pump_id: "",
      is_toilet_cleaned: false,
      is_solar_panel_cleaned: false,
      is_office_cleaned: false,
      is_pump_area_cleaned: false,
      is_generator_fuel_ok: false,
    },
  });

  const onSubmit = (data: PumpLogFormValues) => {
    try {
      onSuccess(data);
      toast.success("Pump log added successfully");
    } catch (error) {
      toast.error("Failed to add pump log");
      console.error(error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Add New Pump Log</DialogTitle>
        <DialogDescription>
          Complete the form below to add a new pump log.
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

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="is_toilet_cleaned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Toilet Cleaned</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_solar_panel_cleaned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Solar Panel Cleaned</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_office_cleaned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Office Cleaned</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_pump_area_cleaned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Pump Area Cleaned</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_generator_fuel_ok"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Generator Fuel OK</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">Add Pump Log</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default PumpLogForm;
