
import { toast } from 'sonner';
import type { 
  Address, Pump, Vehicle, Shift, PumpLog, PaymentType,
  FuelType, IncomingFuel, Nozzle, EmployeeLog, Payment, Sale,
  ApiResponse, PaginatedResponse, User
} from '@/types/schema';

// Base API URL - should come from environment variables in production
const API_BASE_URL = 'http://localhost:3000/api/v1/';

// Create a custom fetch function with error handling
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    // Get auth token if available
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add auth token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Generic CRUD functions
export async function fetchList<T>(endpoint: string): Promise<ApiResponse<T[]>> {
  return apiRequest<ApiResponse<T[]>>(endpoint);
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
  getByPumpId: (pumpId: string) => fetchOne<Pump>('/pumps', pumpId),
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
  getByPumpId: (pumpId: string) => apiRequest<Shift[]>(`/shift/${pumpId}`),
};

export const PumpLogAPI = {
  getAll: () => fetchList<PumpLog>('/pump-logs'),
  getOne: (id: string) => fetchOne<PumpLog>('/pump-logs', id),
  create: (data: Partial<PumpLog>) => createItem<PumpLog>('/pump-logs', data),
  update: (id: string, data: Partial<PumpLog>) => updateItem<PumpLog>('/pump-logs', id, data),
  delete: (id: string) => deleteItem<PumpLog>('/pump-logs', id),
  getByPumpId: (pumpId: string) => apiRequest<PumpLog[]>(`/pump-log/${pumpId}`),
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
  getByPumpId: (pumpId: string) => apiRequest<FuelType[]>(`/fuel-type/${pumpId}`),
};

export const IncomingFuelAPI = {
  getAll: () => fetchList<IncomingFuel>('/incoming-fuel-logs'),
  getOne: (id: string) => fetchOne<IncomingFuel>('/incoming-fuel-logs', id),
  create: (data: Partial<IncomingFuel>) => createItem<IncomingFuel>('/incoming-fuel-logs', data),
  update: (id: string, data: Partial<IncomingFuel>) => updateItem<IncomingFuel>('/incoming-fuel-logs', id, data),
  delete: (id: string) => deleteItem<IncomingFuel>('/incoming-fuel-logs', id),
  getByPumpId: (pumpId: string) => apiRequest<IncomingFuel[]>(`/incoming-fuel-log/${pumpId}`),
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
  getByPumpId: (pumpId: string) => apiRequest<ApiResponse<EmployeeLog[]>>(`/employee-logs?pump_id=${pumpId}`),
};

export const PaymentAPI = {
  getAll: () => fetchList<Payment>('/payments'),
  getOne: (id: string) => fetchOne<Payment>('/payments', id),
  create: (data: Partial<Payment>) => createItem<Payment>('/payments', data),
  update: (id: string, data: Partial<Payment>) => updateItem<Payment>('/payments', id, data),
  delete: (id: string) => deleteItem<Payment>('/payments', id),
  getByPumpId: (pumpId: string) => apiRequest<ApiResponse<Payment[]>>(`/payment/${pumpId}`),
  createForPump: (pumpId: string, data: Partial<Payment>) => apiRequest<ApiResponse<Payment>>(`/payment/${pumpId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const SaleAPI = {
  getAll: () => fetchList<Sale>('/sales'),
  getOne: (id: string) => fetchOne<Sale>('/sales', id),
  create: (data: Partial<Sale>) => createItem<Sale>('/outgoing-fuel-logs', data),
  update: (id: string, data: Partial<Sale>) => updateItem<Sale>('/outgoing-fuel-logs', id, data),
  delete: (id: string) => deleteItem<Sale>('/outgoing-fuel-logs', id),
  getOutgoingFuelLogs: () => apiRequest<ApiResponse<Sale[]>>('/outgoing-fuel-logs'),
};

export const UserAPI = {
  getAll: () => fetchList<User>('/users'),
  getOne: (id: string) => fetchOne<User>('/users', id),
  create: (data: Partial<User>) => createItem<User>('/users', data),
  update: (id: string, data: Partial<User>) => updateItem<User>('/users', id, data),
  delete: (id: string) => deleteItem<User>('/users', id),
};

// Helper functions for formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateDuration = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffHrs}h ${diffMins}m`;
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
