import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Shift } from "@/types/schema";
import { format } from "date-fns";
import { calculateDuration } from "@/lib/utils";

interface ShiftTableProps {
  shifts: Shift[];
}

const ShiftTable: React.FC<ShiftTableProps> = ({ shifts }) => {
  const columns = [
    {
      header: "Friendly Name",
      accessorKey: "friendly_name",
    },
    {
      header: "Start Time",
      accessorKey: "start",
      cell: (item: any) => format(new Date(item.start), "PPP HH:mm"),
    },
    {
      header: "End Time",
      accessorKey: "end",
      cell: (item: any) => format(new Date(item.end), "PPP HH:mm"),
    },
    {
      header: "Duration",
      id: "duration",
      cell: (item: any) =>
        item.start && item.end ? calculateDuration(item.start, item.end) : "N/A",
    },
    {
      header: "Pump",
      id: "pump",
      cell: (item: any) => item.pump?.name || "N/A",
    },
  ];

  return (
    <DataTable columns={columns} data={shifts} searchPlaceholder="Search shifts..." />
  );
};

export default ShiftTable;
