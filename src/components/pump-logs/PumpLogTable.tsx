
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Check, X } from "lucide-react";
import { PumpLog } from "@/types/schema";
import { useApi } from "@/hooks/use-api";
import { PumpAPI, mockPaginatedResponse } from "@/services/api";
import { mockPumps } from "@/data/mockData";

interface PumpLogTableProps {
  pumpLogs: PumpLog[];
}

const PumpLogTable: React.FC<PumpLogTableProps> = ({ pumpLogs }) => {
  // Fetch pumps data for better display if not nested
  const { data: pumps } = useApi(
    () => PumpAPI.getAll().catch(() => mockPaginatedResponse(mockPumps)),
    { defaultData: [] }
  );

  const BooleanCell = ({ value }: { value: boolean }) => {
    return value ? (
      <Check className="h-5 w-5 text-green-500" />
    ) : (
      <X className="h-5 w-5 text-red-500" />
    );
  };

  const columns = [
    {
      header: "Pump",
      accessorKey: "pump",
      cell: (item: any) => {
        // Handle direct API response with nested pump
        if (item.pump?.name) {
          return item.pump.name;
        }
        
        // Handle ID reference
        if (item.pump_id) {
          const pump = pumps?.find((p: any) => p.id === item.pump_id);
          return pump ? pump.name : "N/A";
        }
        
        return "N/A";
      },
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
          : (item.created_at || new Date().toLocaleDateString());
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={pumpLogs}
      searchPlaceholder="Search pump logs..."
    />
  );
};

export default PumpLogTable;
