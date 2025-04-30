
import { useState, useEffect } from 'react';
import { ApiResponse, PaginatedResponse } from '@/types/schema';
import { handleApiError } from '@/lib/utils';
import { toast } from 'sonner';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  defaultData?: T;
  dependencies?: any[];
}

export function useApi<T>(
  fetchFn: () => Promise<ApiResponse<T> | PaginatedResponse<T>>,
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
          // Check if it's a paginated response or a single item response
          if ('data' in response && Array.isArray(response.data)) {
            setData(response.data as unknown as T);
          } else if ('data' in response) {
            setData(response.data);
          } else {
            setData(response as unknown as T);
          }
          
          if (options.onSuccess) {
            options.onSuccess('data' in response ? response.data : response as unknown as T);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const response = await fetchFn();
      // Check if it's a paginated response or a single item response
      if ('data' in response && Array.isArray(response.data)) {
        setData(response.data as unknown as T);
      } else if ('data' in response) {
        setData(response.data);
      } else {
        setData(response as unknown as T);
      }
      
      if (options.onSuccess) {
        options.onSuccess('data' in response ? response.data : response as unknown as T);
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

  return { data, isLoading, error, refetch };
}

export function useMutation<T, U = any>(
  mutationFn: (data: U) => Promise<ApiResponse<T>>,
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
      setData(response.data);
      if (options.onSuccess) {
        options.onSuccess(response.data);
      }
      return response.data;
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
