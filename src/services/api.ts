
import { toast } from 'sonner';
import type { 
  Address, Pump, Vehicle, Shift, PumpLog, PaymentType,
  FuelType, IncomingFuel, Nozzle, EmployeeLog, Payment, Sale,
  ApiResponse, PaginatedResponse, User
} from '@/types/schema';
import { useAuth } from "../contexts/AuthContext";

// Base API URL - should come from environment variables in production
const API_BASE_URL = 'http://localhost:3000/api/v1/';


// Create a custom fetch function with error handling
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    toast.error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

// Generic CRUD functions
export async function fetchList<T>(endpoint: string): Promise<PaginatedResponse<T>> {
  return apiRequest<PaginatedResponse<T>>(endpoint);
}

export async function fetchOne<T>(endpoint: string, id: string): Promise<ApiResponse<T>> {
  return apiRequest<ApiResponse<T>>(`${endpoint}/${id}`);
}

export async function createItem<T>(endpoint: string, data: Partial<T>): Promise<ApiResponse<T>> {
  return apiRequest<ApiResponse<T>>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateItem<T>(endpoint: string, id: string, data: Partial<T>): Promise<ApiResponse<T>> {
  return apiRequest<ApiResponse<T>>(`${endpoint}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteItem<T>(endpoint: string, id: string): Promise<ApiResponse<T>> {
  return apiRequest<ApiResponse<T>>(`${endpoint}/${id}`, {
    method: 'DELETE',
  });
}

// Entity-specific API functions
export const AddressAPI = {
  getAll: () => fetchList<Address>('/addresses'),
  getOne: (id: string) => fetchOne<Address>('/addresses', id),
  create: (data: Partial<Address>) => createItem<Address>('/addresses', data),
  update: (id: string, data: Partial<Address>) => updateItem<Address>('/addresses', id, data),
  delete: (id: string) => deleteItem<Address>('/addresses', id),
};

export const PumpAPI = {
  getAll: () => fetchList<Pump>('/pumps'),
  getOne: (id: string) => fetchOne<Pump>('/pumps', id),
  create: (data: Partial<Pump>) => createItem<Pump>('/pumps', data),
  update: (id: string, data: Partial<Pump>) => updateItem<Pump>('/pumps', id, data),
  delete: (id: string) => deleteItem<Pump>('/pumps', id),
};

export const VehicleAPI = {
  getAll: () => fetchList<Vehicle>('/vehicles'),
  getOne: (id: string) => fetchOne<Vehicle>('/vehicles', id),
  create: (data: Partial<Vehicle>) => createItem<Vehicle>('/vehicles', data),
  update: (id: string, data: Partial<Vehicle>) => updateItem<Vehicle>('/vehicles', id, data),
  delete: (id: string) => deleteItem<Vehicle>('/vehicles', id),
};

export const ShiftAPI = {
  getAll: () => fetchList<Shift>('/shifts'),
  getOne: (id: string) => fetchOne<Shift>('/shifts', id),
  create: (data: Partial<Shift>) => createItem<Shift>('/shifts', data),
  update: (id: string, data: Partial<Shift>) => updateItem<Shift>('/shifts', id, data),
  delete: (id: string) => deleteItem<Shift>('/shifts', id),
};

export const PumpLogAPI = {
  getAll: () => fetchList<PumpLog>('/pump-logs'),
  getOne: (id: string) => fetchOne<PumpLog>('/pump-logs', id),
  create: (data: Partial<PumpLog>) => createItem<PumpLog>('/pump-logs', data),
  update: (id: string, data: Partial<PumpLog>) => updateItem<PumpLog>('/pump-logs', id, data),
  delete: (id: string) => deleteItem<PumpLog>('/pump-logs', id),
};

export const PaymentTypeAPI = {
  getAll: () => fetchList<PaymentType>('/payment-types'),
  getOne: (id: string) => fetchOne<PaymentType>('/payment-types', id),
  create: (data: Partial<PaymentType>) => createItem<PaymentType>('/payment-types', data),
  update: (id: string, data: Partial<PaymentType>) => updateItem<PaymentType>('/payment-types', id, data),
  delete: (id: string) => deleteItem<PaymentType>('/payment-types', id),
};

export const FuelTypeAPI = {
  getAll: () => fetchList<FuelType>('/fuel-types'),
  getOne: (id: string) => fetchOne<FuelType>('/fuel-types', id),
  create: (data: Partial<FuelType>) => createItem<FuelType>('/fuel-types', data),
  update: (id: string, data: Partial<FuelType>) => updateItem<FuelType>('/fuel-types', id, data),
  delete: (id: string) => deleteItem<FuelType>('/fuel-types', id),
};

export const NozzleAPI = {
  getAll: () => fetchList<Nozzle>('/nozzles'),
  getOne: (id: string) => fetchOne<Nozzle>('/nozzles', id),
  create: (data: Partial<Nozzle>) => createItem<Nozzle>('/nozzles', data),
  update: (id: string, data: Partial<Nozzle>) => updateItem<Nozzle>('/nozzles', id, data),
  delete: (id: string) => deleteItem<Nozzle>('/nozzles', id),
};

export const EmployeeLogAPI = {
  getAll: () => fetchList<EmployeeLog>('/employee-logs'),
  getOne: (id: string) => fetchOne<EmployeeLog>('/employee-logs', id),
  create: (data: Partial<EmployeeLog>) => createItem<EmployeeLog>('/employee-logs', data),
  update: (id: string, data: Partial<EmployeeLog>) => updateItem<EmployeeLog>('/employee-logs', id, data),
  delete: (id: string) => deleteItem<EmployeeLog>('/employee-logs', id),
};

export const PaymentAPI = {

  getAll: async () => {
    const { user } =useAuth();
    
    const res = await fetch(`http://localhost:3000/api/v1/payment/${user.pumpId}`);
    if (!res.ok) throw new Error("Failed to fetch payments");
    return await res.json();
  }
  
};

export const SaleAPI = {
  getAll: () => fetchList<Sale>('/sales'),
  getOne: (id: string) => fetchOne<Sale>('/sales', id),
  create: (data: Partial<Sale>) => createItem<Sale>('/sales', data),
  update: (id: string, data: Partial<Sale>) => updateItem<Sale>('/sales', id, data),
  delete: (id: string) => deleteItem<Sale>('/sales', id),
};

export const UserAPI = {
  getAll: () => fetchList<User>('/users'),
  getOne: (id: string) => fetchOne<User>('/users', id),
  create: (data: Partial<User>) => createItem<User>('/users', data),
  update: (id: string, data: Partial<User>) => updateItem<User>('/users', id, data),
  delete: (id: string) => deleteItem<User>('/users', id),
};

// For development/testing - can be removed in production
export const mockAPIResponse = <T>(data: T, delay = 500): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data, success: true });
    }, delay);
  });
};

export const mockPaginatedResponse = <T>(data: T[], delay = 500): Promise<PaginatedResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        data, 
        success: true, 
        total: data.length, 
        page: 1, 
        limit: data.length 
      });
    }, delay);
  });
};
