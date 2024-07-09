import { useState, useEffect, useCallback } from 'react';
import { fetchLogIds } from '../shared/apiClient/logsApi';

export const useLogIds = () => {
  const [logIds, setLogIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const loadLogIds = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ids = await fetchLogIds();
      setLogIds(ids);
    } catch (err) {
      setError(err);
    } 
      setIsLoading(false);
  }, []);

  useEffect(() => {
    loadLogIds();
  }, [loadLogIds]);

  const refreshLogIds = useCallback(() => {
    loadLogIds();
  }, [loadLogIds]);

  return { logIds, isLoading, error, refreshLogIds };
};