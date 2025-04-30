import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";

interface IncomingFuelTableProps {
  fuelLogs: any[];
}

const IncomingFuelTable: React.FC<IncomingFuelTableProps> = ({ fuelLogs }) => {
  const columns = [
    {
      header: "Vehicle",
      accessorKey: "vehicle",
      cell: (row: any) =>
        `${row.vehicle?.friendly_name || "N/A"} (${row.vehicle?.vehicle_number || "N/A"})`
    },
    {
      header: "Fuel Type",
      accessorKey: "fuel_type",
      cell: (row: any) => row.fuel_type?.name || "N/A"
    },
    {
      header: "Quantity (L)",
      accessorKey: "quantity",
      cell: (row: any) => row.quantity
    },
    {
      header: "Rate/L",
      accessorKey: "rate_per_l",
      cell: (row: any) => formatCurrency(row.rate_per_l)
    },
    
    {
      header: "Date",
      accessorKey: "created_at",
      cell: (row: any) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A"
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={fuelLogs}
      searchPlaceholder="Search fuel logs..."
    />
  );
};

export default IncomingFuelTable;
