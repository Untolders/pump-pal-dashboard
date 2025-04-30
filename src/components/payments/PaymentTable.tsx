
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/services/api";
import { Payment } from "@/types/schema";
import { useBreakpoint } from "@/hooks/use-responsive";

interface PaymentTableProps {
  payments: Payment[];
}

const PaymentTable: React.FC<PaymentTableProps> = ({ payments }) => {
  const isMobile = useBreakpoint('md', 'down');
  
  // Mobile-optimized columns (fewer columns)
  const mobileColumns = [
    {
      header: "Payment Type",
      accessorKey: "payment_type",
      cell: (item: any) => {
        return item?.payment_type?.name || "N/A";
      },
    },
    {
      header: "Amount",
      id: "total_amount",
      cell: (item: any) => {
        const total = item?.amount || 0;
        return formatCurrency(total);
      },
    },
    {
      header: "Date",
      accessorKey: "created_at",
      cell: (item: any) => {
        const date = item?.created_at || item?.date;
        return date ? new Date(date).toLocaleDateString() : "N/A";
      },
    },
  ];
  
  // Full set of columns for larger screens
  const desktopColumns = [
    {
      header: "Pump Name",
      accessorKey: "pump",
      cell: (item: any) => {
        return item?.outgoing_fuel_log?.pump?.name ||  "N/A";
      },
    },
    {
      header: "Nozzle",
      accessorKey: "nozzle",
      cell: (item: any) => {
        return item?.outgoing_fuel_log?.nozzle?.friendly_name || "N/A";
      },
    },
    {
      header: "Payment Type",
      accessorKey: "payment_type",
      cell: (item: any) => {
        return item?.payment_type?.name || "N/A";
      },
    },
    {
      header: "Total Amount",
      id: "total_amount",
      cell: (item: any) => {
        const total = item?.amount || 0;
        return formatCurrency(total);
      },
    },
    {
      header: "Date",
      accessorKey: "created_at",
      cell: (item: any) => {
        const date = item?.created_at || item?.date;
        return date ? new Date(date).toLocaleDateString() : "N/A";
      },
    },
  ];

  return (
    <DataTable
      columns={isMobile ? mobileColumns : desktopColumns}
      data={payments}
      searchPlaceholder="Search payments..."
    />
  );
};

export default PaymentTable;
