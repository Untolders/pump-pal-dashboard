
import { useState, useEffect } from 'react';
import { ApiResponse, PaginatedResponse } from '@/types/schema';
import { toast } from 'sonner';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  defaultData?: T;
  dependencies?: any[];
}

export function useApi<T>(
  fetchFn: () => Promise<ApiResponse<T> | PaginatedResponse<T> | T[]>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(options.defaultData || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const dependencies = options.dependencies || [];

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchFn();
        
        if (isMounted) {
          // Check response type and extract data appropriately
          if (Array.isArray(response)) {
            // Direct array response
            setData(response as T);
            if (options.onSuccess) options.onSuccess(response as T);
          } else if ('data' in response && Array.isArray(response.data)) {
            // Paginated response
            setData(response.data as T);
            if (options.onSuccess) options.onSuccess(response.data as T);
          } else if ('data' in response) {
            // Single item response
            setData(response.data as T);
            if (options.onSuccess) options.onSuccess(response.data as T);
          } else {
            // Direct object response
            setData(response as T);
            if (options.onSuccess) options.onSuccess(response as T);
          }
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Unknown error occurred');
          setError(error);
          if (options.onError) {
            options.onError(error);
          } else {
            toast.error(`Error: ${error.message}`);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [...dependencies]);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const response = await fetchFn();
      
      // Check response type and extract data appropriately
      if (Array.isArray(response)) {
        // Direct array response
        setData(response as unknown as T);
        if (options.onSuccess) options.onSuccess(response as unknown as T);
      } else if ('data' in response && Array.isArray(response.data)) {
        // Paginated response
        setData(response.data as unknown as T);
        if (options.onSuccess) options.onSuccess(response.data as unknown as T);
      } else if ('data' in response) {
        // Single item response
        setData(response.data);
        if (options.onSuccess) options.onSuccess(response.data);
      } else {
        // Direct object response
        setData(response as unknown as T);
        if (options.onSuccess) options.onSuccess(response as unknown as T);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      if (options.onError) {
        options.onError(error);
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    data: data as T extends any[] ? T : (T | null), 
    isLoading, 
    error, 
    refetch 
  };
}

export function useMutation<T, U = any>(
  mutationFn: (data: U) => Promise<ApiResponse<T> | T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = async (variables: U) => {
    setIsLoading(true);
    try {
      const response = await mutationFn(variables);
      let result: T;
      
      if (typeof response === 'object' && response !== null && 'data' in response && response.data !== undefined) {
        result = response.data;
      } else {
        result = response as T;
      }
      
      setData(result);
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      if (options.onError) {
        options.onError(error);
      } else {
        toast.error(`Error: ${error.message}`);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error, data };
}

export default useApi;
