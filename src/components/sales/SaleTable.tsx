import React from "react";
import { Sale } from "@/types/schema";

interface SaleTableProps {
  sales: Sale[];
}

const SaleTable: React.FC<SaleTableProps> = ({ sales }) => {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
          <tr>
            <th className="px-4 py-3">Employee</th>
            <th className="px-4 py-3">Shift</th>
            <th className="px-4 py-3">Pump</th>
            <th className="px-4 py-3">Nozzle</th>
            <th className="px-4 py-3">Fuel Type</th>
            <th className="px-4 py-3">Quantity (L)</th>
            <th className="px-4 py-3">Rate/L (₹)</th>
            <th className="px-4 py-3">Amount (₹)</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-200">
          {sales.map((sale) => {
            const employeeName = `${sale.employee_log?.user?.first_name ?? ""} ${sale.employee_log?.user?.last_name ?? ""}`;
            const shiftName = sale.employee_log?.shift?.friendly_name ?? "N/A";
            const pumpName = sale.pump?.name ?? "N/A";
            const nozzleName = sale.employee_log?.nozzle?.friendly_name ?? "N/A";
            const fuelType = sale.employee_log?.nozzle?.fuel_type?.name ?? "N/A";
            const date = new Date(sale.created_at ?? "").toLocaleDateString();

            return (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{employeeName}</td>
                <td className="px-4 py-3">{shiftName}</td>
                <td className="px-4 py-3">{pumpName}</td>
                <td className="px-4 py-3">{nozzleName}</td>
                <td className="px-4 py-3">{fuelType}</td>
                <td className="px-4 py-3">{sale.quantity}</td>
                <td className="px-4 py-3">₹{sale.rate_per_l}</td>
                <td className="px-4 py-3 font-semibold text-green-700">₹{sale.amount}</td>
                <td className="px-4 py-3">{date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SaleTable;
