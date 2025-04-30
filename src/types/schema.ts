
// Basic entity interfaces with common properties
interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

// Address entity
export interface Address extends BaseEntity {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  country: string;
  isPrimary?: boolean; // keeping this from existing schema for compatibility
}

// Pump entity
export interface Pump extends BaseEntity {
  name: string;
  phone: string;
  email: string;
  address?: Address;
  fuelTypeId?: string; // keeping these from existing schema for compatibility
  status?: "active" | "maintenance" | "offline";
  lastMaintenance?: string;
  totalVolumeSold?: number;
}

// Vehicle entity
export interface Vehicle extends BaseEntity {
  friendly_name: string;
  vehicle_number: string;
  make?: string; // keeping these from existing schema for compatibility
  model?: string;
  year?: number;
  color?: string;
  fuelTypeId?: string;
  customerId?: string;
}

// Shift entity
export interface Shift extends BaseEntity {
  friendly_name: string;
  start: string;
  end: string;
  pump: Pump;
  pump_id?: string; // for form compatibility
}

// Pump Log entity
export interface PumpLog extends BaseEntity {
  is_toilet_cleaned: boolean;
  is_solar_panel_cleaned: boolean;
  is_office_cleaned: boolean;
  is_pump_area_cleaned: boolean;
  is_generator_fuel_ok: boolean;
  pump: Pump;
  pump_id?: string; // for form compatibility
}

// Payment Type entity
export interface PaymentType extends BaseEntity {
  name: string;
  pump: Pump;
  pump_id?: string; // for form compatibility
}

// Fuel Type entity
export interface FuelType extends BaseEntity {
  name: string;
  quantity: string;
  pump: Pump;
  pump_id?: string; // for form compatibility
  description?: string; // keeping these from existing schema for compatibility
  pricePerLiter?: number;
  color?: string;
}

// Incoming Fuel entity
export interface IncomingFuel extends BaseEntity {
  quantity: string;
  rate_per_l: string;
  amount: string;
  vehicle: Vehicle;
  fuel_type: FuelType;
  pump: Pump;
  vehicle_id?: string; // for form compatibility
  fuel_type_id?: string;
  pump_id?: string;
}

// Nozzle entity
export interface Nozzle extends BaseEntity {
  friendly_name: string;
  fuel_type: FuelType;
  fuel_type_id?: string; // for form compatibility
}

// User entity for Employee
export interface User extends BaseEntity {
  auth0_user_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone: string;
  email?: string;
  address_id?: string; // for form compatibility
  role?: string;
  joiningDate?: string;
}

// Employee Log entity
export interface EmployeeLog extends BaseEntity {
  is_on_time: boolean;
  is_in_uniform: boolean;
  additional_remark?: string;
  user: User;
  shift: Shift;
  nozzle:Nozzle;
  user_id?: string; // for form compatibility
  shift_id?: string;
  checkIn?: string; // keeping these from existing schema for compatibility
  checkOut?: string;
  totalHours?: number;
  notes?: string;
}

// Payment entity with items
export interface PaymentItem {
  type: string;
  amount: number;
}

export interface Payment extends BaseEntity {
  
  amount?: number;
  payment_type:PaymentType;
  sale:Sale
}

// Sale entity (OutgoingFuelLog)
export interface Sale extends BaseEntity {
  quantity: number;
  rate_per_l: number;
  amount: number;
  pump: Pump;
  employee_log: EmployeeLog;
  nozzle: Nozzle;
}

// Dashboard statistics
export interface DashboardStats {
  totalSales: number;
  totalVolume: number;
  activeEmployees: number;
  activePumps: number;
}

// Sales data for charts
export interface SalesData {
  date: string;
  amount: number;
}

// Fuel sales data for charts
export interface FuelSalesData {
  fuelType: string;
  volume: number;
  color: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
}
