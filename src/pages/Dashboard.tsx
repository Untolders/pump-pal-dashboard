
import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { DataTable } from "@/components/ui/data-table";
import { Droplets, Fuel, Users, Gauge, Activity, Calendar, TrendingUp, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const salesData = [
  { name: "Jan", amount: 1200 },
  { name: "Feb", amount: 1900 },
  { name: "Mar", amount: 1500 },
  { name: "Apr", amount: 2400 },
  { name: "May", amount: 2800 },
  { name: "Jun", amount: 3200 },
  { name: "Jul", amount: 3800 },
];

const fuelDistribution = [
  { name: "Petrol", value: 45, color: "#9b87f5" },
  { name: "Diesel", value: 35, color: "#7E69AB" },
  { name: "Premium", value: 15, color: "#1EAEDB" },
  { name: "Electric", value: 5, color: "#ea384c" },
];

const recentTransactions = [
  { id: "1", date: "Today, 2:30 PM", customer: "John Doe", amount: 45.50, fuelType: "Petrol", volume: 10 },
  { id: "2", date: "Today, 1:15 PM", customer: "Jane Smith", amount: 68.25, fuelType: "Diesel", volume: 15 },
  { id: "3", date: "Yesterday, 5:45 PM", customer: "Bob Johnson", amount: 38.90, fuelType: "Premium", volume: 7 },
  { id: "4", date: "Yesterday, 3:20 PM", customer: "Alice Brown", amount: 89.75, fuelType: "Diesel", volume: 20 },
  { id: "5", date: "2 days ago", customer: "Charlie Wilson", amount: 22.50, fuelType: "Petrol", volume: 5 },
];

const Dashboard = () => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: "Welcome to PumpPal!",
      description: "This is your dashboard overview. Click around to explore features."
    });
  };

  React.useEffect(() => {
    // Show welcome toast on initial render
    const hasShownWelcome = sessionStorage.getItem("hasShownWelcome");
    if (!hasShownWelcome) {
      showToast();
      sessionStorage.setItem("hasShownWelcome", "true");
    }
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value="₹32,459"
          icon={ShoppingBag}
          description="Revenue for the current month"
          trend={{ value: 12.5, direction: "up" }}
          className="hover-scale"
        />
        <StatCard
          title="Fuel Volume"
          value="4,281 L"
          icon={Droplets}
          description="Total fuel dispensed this month"
          trend={{ value: 8.2, direction: "up" }}
          className="hover-scale"
        />
        <StatCard
          title="Active Pumps"
          value="8/10"
          icon={Gauge}
          description="Pumps currently operational"
          trend={{ value: 0, direction: "neutral" }}
          className="hover-scale"
        />
        <StatCard
          title="Employees on Duty"
          value="12"
          icon={Users}
          description="Staff currently working"
          trend={{ value: 2, direction: "up" }}
          className="hover-scale"
        />
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Overview</TabsTrigger>
          <TabsTrigger value="fuel">Fuel Distribution</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales</CardTitle>
              <CardDescription>
                Your sales performance over the last 7 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Amount']}/>
                    <Bar dataKey="amount" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fuel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Sales Distribution</CardTitle>
              <CardDescription>
                Breakdown of fuel sales by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fuelDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {fuelDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest customer purchases at your station
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { header: "Date & Time", accessorKey: "date" },
              { header: "Customer", accessorKey: "customer" },
              { 
                header: "Amount", 
                accessorKey: "amount",
                cell: (row) => `₹${row.amount.toFixed(2)}`
              },
              { header: "Fuel Type", accessorKey: "fuelType" },
              { 
                header: "Volume", 
                accessorKey: "volume",
                cell: (row) => `${row.volume} L`
              },
            ]}
            data={recentTransactions}
            onRowClick={(row) => {
              toast({
                title: `Transaction Details`,
                description: `Viewing transaction for ${row.customer} (₹${row.amount})`,
              });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
