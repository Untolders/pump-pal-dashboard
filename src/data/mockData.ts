
// Mock data for the application

// Pumps
export const mockPumps = [
  { id: "pump-1", name: "Pump A", phone: "9876543210", email: "pump-a@example.com", address: "123 Main St" },
  { id: "pump-2", name: "Pump B", phone: "9876543211", email: "pump-b@example.com", address: "456 Elm St" },
  { id: "pump-3", name: "Pump C", phone: "9876543212", email: "pump-c@example.com", address: "789 Oak St" },
];

// Employees
export const mockEmployees = [
  { id: "emp-1", name: "John Doe", email: "john@example.com", phone: "9876543200" },
  { id: "emp-2", name: "Jane Smith", email: "jane@example.com", phone: "9876543201" },
  { id: "emp-3", name: "Bob Johnson", email: "bob@example.com", phone: "9876543202" },
];

// Nozzles
export const mockNozzles = [
  { id: "noz-1", friendly_name: "Petrol Nozzle 1", fuel_type_id: "fuel-1" },
  { id: "noz-2", friendly_name: "Diesel Nozzle 1", fuel_type_id: "fuel-2" },
  { id: "noz-3", friendly_name: "Premium Nozzle", fuel_type_id: "fuel-3" },
];

// Fuel Types
export const mockFuelTypes = [
  { id: "fuel-1", name: "Regular Petrol", price_per_liter: 100.50 },
  { id: "fuel-2", name: "Diesel", price_per_liter: 90.75 },
  { id: "fuel-3", name: "Premium Petrol", price_per_liter: 110.25 },
];

// Addresses
export const mockAddresses = [
  { id: "addr-1", address_line_1: "123 Main St", city: "Mumbai", state: "Maharashtra", country: "India" },
  { id: "addr-2", address_line_1: "456 Elm St", city: "Delhi", state: "Delhi", country: "India" },
  { id: "addr-3", address_line_1: "789 Oak St", city: "Bangalore", state: "Karnataka", country: "India" },
];

// Initial Payments Data
export const mockPayments = [
  {
    id: "payment-1",
    pump_id: "pump-1",
    pumpName: "Pump A",
    phone: "9876543210",
    email: "pump-a@example.com",
    payment_items: [
      { type: "Petrol", amount: 1000 },
      { type: "UPI", amount: 1000 }
    ],
  },
  {
    id: "payment-2",
    pump_id: "pump-2",
    pumpName: "Pump B",
    phone: "9876543211",
    email: "pump-b@example.com",
    payment_items: [
      { type: "Diesel", amount: 850 },
      { type: "Cash", amount: 850 }
    ],
  },
];

// Initial Sales Data
export const mockSales = [
  {
    id: "sale-1",
    quantity: 10.5,
    rate_per_l: 100.50,
    amount: 1055.25,
    pump_id: "pump-1",
    employee_log_id: "emp-1",
    nozzle_id: "noz-1",
  },
  {
    id: "sale-2",
    quantity: 15,
    rate_per_l: 90.75,
    amount: 1361.25,
    pump_id: "pump-2",
    employee_log_id: "emp-2",
    nozzle_id: "noz-2",
  },
];

// Initial Pump Logs Data
export const mockPumpLogs = [
  {
    id: "pump-log-1",
    pump_id: "pump-1",
    is_toilet_cleaned: true,
    is_solar_panel_cleaned: false,
    is_office_cleaned: true,
    is_pump_area_cleaned: true,
    is_generator_fuel_ok: true,
    created_at: "2023-05-10",
  },
  {
    id: "pump-log-2",
    pump_id: "pump-2",
    is_toilet_cleaned: true,
    is_solar_panel_cleaned: true,
    is_office_cleaned: false,
    is_pump_area_cleaned: true,
    is_generator_fuel_ok: false,
    created_at: "2023-05-11",
  },
];

// Initial Shifts Data
export const mockShifts = [
  {
    id: "shift-1",
    friendly_name: "Morning Shift",
    start: new Date("2023-05-10T06:00:00"),
    end: new Date("2023-05-10T14:00:00"),
    pump_id: "pump-1",
  },
  {
    id: "shift-2",
    friendly_name: "Evening Shift",
    start: new Date("2023-05-10T14:00:00"),
    end: new Date("2023-05-10T22:00:00"),
    pump_id: "pump-2",
  },
];
