import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const schema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  fuelTypeId: z.string().min(1, "Fuel type is required"),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .min(1, "Quantity must be greater than 0"),
  ratePerL: z
    .number({ invalid_type_error: "Rate per liter must be a number" })
    .positive("Rate must be positive"),
});

type FormData = z.infer<typeof schema>;

interface AddIncomingFuelFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddIncomingFuelForm = ({ onSuccess, onCancel }: AddIncomingFuelFormProps) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [fuelTypes, setFuelTypes] = useState<any[]>([]);
  const [pump, setPump] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.pumpId) return;
  
      try {
        const [vRes, fRes, pRes] = await Promise.all([
          fetch(`http://localhost:3000/api/v1/vehicle/${user.pumpId}`),
          fetch(`http://localhost:3000/api/v1/fuel-type/${user.pumpId}`),
          fetch(`http://localhost:3000/api/v1/pump/${user.pumpId}`),
        ]);
  
        const [vData, fData, pData] = await Promise.all([
          vRes.json(),
          fRes.json(),
          pRes.json(),
        ]);
  
        setVehicles(vData);
        setFuelTypes(fData);
        setPump(pData.data ?? pData); // <-- Key fix
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
  
    fetchData();
  }, [user?.pumpId]);
  

  const onSubmit = async (data: FormData) => {
    const vehicle = vehicles.find((v) => v.id === data.vehicleId);
    const fuelType = fuelTypes.find((f) => f.id === data.fuelTypeId);
    if (!vehicle || !fuelType || !pump) {
         return;
      }
      
  

    const payload = {
      quantity: data.quantity,
      rate_per_l: data.ratePerL,
      amount: data.quantity * data.ratePerL,
      vehicle: {
        id: vehicle.id,
        friendly_name: vehicle.friendly_name,
        vehicle_number: vehicle.vehicle_number,
        pump: pump,
      },
      fuel_type: {
        id: fuelType.id,
        name: fuelType.name,
        quantity: fuelType.quantity,
        pump: pump,
      },
      pump: pump,
    };

    try {
      const res = await fetch("http://localhost:3000/api/v1/incoming-fuel-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Server error:", err);
        throw new Error("Failed to submit data");
      }

      onSuccess();
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Vehicle</Label>
        <select {...register("vehicleId")} className="w-full border rounded p-2">
          <option value="">Select Vehicle</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.vehicle_number} - {v.friendly_name}
            </option>
          ))}
        </select>
        {errors.vehicleId && <p className="text-red-500 text-sm">{errors.vehicleId.message}</p>}
      </div>

      <div>
        <Label>Fuel Type</Label>
        <select {...register("fuelTypeId")} className="w-full border rounded p-2">
          <option value="">Select Fuel Type</option>
          {fuelTypes.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        {errors.fuelTypeId && <p className="text-red-500 text-sm">{errors.fuelTypeId.message}</p>}
      </div>

      <div>
        <Label>Quantity (Liters)</Label>
        <Input type="number" {...register("quantity", { valueAsNumber: true })} />
        {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
      </div>

      <div>
        <Label>Rate per Liter</Label>
        <Input type="number" {...register("ratePerL", { valueAsNumber: true })} />
        {errors.ratePerL && <p className="text-red-500 text-sm">{errors.ratePerL.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-pumpPrimary hover:bg-pumpSecondary">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AddIncomingFuelForm;
