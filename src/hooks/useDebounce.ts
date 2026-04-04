import { useState, useEffect } from 'react';

/**
 * useDebounce hook
 * Delays updating the value until after a specified delay has passed.
 * Useful for debouncing API calls on search inputs.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
