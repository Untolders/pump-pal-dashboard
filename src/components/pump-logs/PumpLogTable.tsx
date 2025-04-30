
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Check, X } from "lucide-react";
import { PumpLog } from "@/types/schema";
import { useBreakpoint } from "@/hooks/use-responsive";

interface PumpLogTableProps {
  pumpLogs: PumpLog[];
}

const PumpLogTable: React.FC<PumpLogTableProps> = ({ pumpLogs }) => {
  const isMobile = useBreakpoint('md', 'down');

  const BooleanCell = ({ value }: { value: boolean }) => {
    return value ? (
      <Check className="h-5 w-5 text-green-500" />
    ) : (
      <X className="h-5 w-5 text-red-500" />
    );
  };

  // Mobile-optimized columns (fewer columns)
  const mobileColumns = [
    {
      header: "Date",
      accessorKey: "created_at",
      cell: (item: any) => {
        return item.created_at 
          ? new Date(item.created_at).toLocaleDateString() 
          : new Date().toLocaleDateString();
      },
    },
    {
      header: "Toilet",
      accessorKey: "is_toilet_cleaned",
      cell: (item: any) => <BooleanCell value={item.is_toilet_cleaned} />,
    },
    {
      header: "Office",
      accessorKey: "is_office_cleaned",
      cell: (item: any) => <BooleanCell value={item.is_office_cleaned} />,
    },
  ];
  
  // Full set of columns for larger screens
  const desktopColumns = [
    {
      header: "Pump",
      accessorKey: "pump.name",
      cell: (item: any) => item.pump?.name || "N/A",
    },
    {
      header: "Toilet Cleaned",
      accessorKey: "is_toilet_cleaned",
      cell: (item: any) => <BooleanCell value={item.is_toilet_cleaned} />,
    },
    {
      header: "Solar Panel Cleaned",
      accessorKey: "is_solar_panel_cleaned",
      cell: (item: any) => <BooleanCell value={item.is_solar_panel_cleaned} />,
    },
    {
      header: "Office Cleaned",
      accessorKey: "is_office_cleaned",
      cell: (item: any) => <BooleanCell value={item.is_office_cleaned} />,
    },
    {
      header: "Pump Area Cleaned",
      accessorKey: "is_pump_area_cleaned",
      cell: (item: any) => <BooleanCell value={item.is_pump_area_cleaned} />,
    },
    {
      header: "Generator Fuel OK",
      accessorKey: "is_generator_fuel_ok",
      cell: (item: any) => <BooleanCell value={item.is_generator_fuel_ok} />,
    },
    {
      header: "Date",
      accessorKey: "created_at",
      cell: (item: any) => {
        return item.created_at 
          ? new Date(item.created_at).toLocaleDateString() 
          : new Date().toLocaleDateString();
      },
    },
  ];

  return (
    <DataTable
      columns={isMobile ? mobileColumns : desktopColumns}
      data={pumpLogs}
      searchPlaceholder="Search pump logs..."
    />
  );
};

export default PumpLogTable;
