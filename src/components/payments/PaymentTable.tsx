
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";
import { Payment } from "@/types/schema";

interface PaymentTableProps {
  payments: Payment[];
}

const PaymentTable: React.FC<PaymentTableProps> = ({ payments }) => {
  const columns = [
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
      columns={columns}
      data={payments}
      searchPlaceholder="Search payments..."
    />
  );
};

export default PaymentTable;
