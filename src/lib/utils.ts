
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency (INR)
 */
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
}

/**
 * Format a date string
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format a datetime string
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get full name from user object
 */
export function getFullName(user: { first_name: string; middle_name?: string; last_name: string }): string {
  return [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(' ');
}

/**
 * Calculate duration between two dates
 */
export function calculateDuration(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

/**
 * Handle API errors and return default value
 */
export function handleApiError<T>(error: any, defaultValue: T): T {
  console.error('API Error:', error);
  return defaultValue;
}

/**
 * Get nested property safely with optional chaining
 */
export function getNestedProperty<T>(obj: any, path: string, defaultValue: T): T {
  try {
    const result = path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
    return result === undefined ? defaultValue : result;
  } catch (e) {
    return defaultValue;
  }
}

