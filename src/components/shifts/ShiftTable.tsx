
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Shift } from "@/types/schema";
import { format } from "date-fns";
import { calculateDuration } from "@/services/api";
import { useBreakpoint } from "@/hooks/use-responsive";

interface ShiftTableProps {
  shifts: Shift[];
}

const ShiftTable: React.FC<ShiftTableProps> = ({ shifts }) => {
  const isMobile = useBreakpoint('md', 'down');
  
  // Mobile-optimized columns (fewer columns)
  const mobileColumns = [
    {
      header: "Name",
      accessorKey: "friendly_name",
    },
    {
      header: "Start",
      accessorKey: "start",
      cell: (item: any) => format(new Date(item.start), "PPP"),
    },
    {
      header: "Duration",
      id: "duration",
      cell: (item: any) =>
        item.start && item.end ? calculateDuration(item.start, item.end) : "N/A",
    },
  ];
  
  // Full set of columns for larger screens
  const desktopColumns = [
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
    <DataTable 
      columns={isMobile ? mobileColumns : desktopColumns} 
      data={shifts} 
      searchPlaceholder="Search shifts..." 
    />
  );
};

export default ShiftTable;
