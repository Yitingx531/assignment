import { useEffect, useMemo, useState } from 'react';
import { FetchLogsResponse, fetchLogs } from '../shared/apiClient/logsApi';

type UseLogEntriesParams = {
  logId: string;
};
type Cache = {
  key?: FetchLogsResponse,
}

const cache: Cache = {};

export const useLogEntries = ({
  logId,
}: UseLogEntriesParams) => {
  const [isLoading, setIsLoading] = useState(false);
  const [logEntries, setLogEntries] = useState([] as FetchLogsResponse);
  const [error, setError] = useState<unknown>();

  const fetchLogEntries = useMemo(() => async () => {
    try {
      setIsLoading(true);
      if (cache[logId as keyof Cache]) {
        setIsLoading(false);
        setLogEntries(cache[logId as keyof Cache] || []);
      } else {
        const result = await fetchLogs(logId);
        cache[logId as keyof Cache] = result;
        setIsLoading(false);
        setLogEntries(result);
      }
    } catch (e: unknown) {
      setIsLoading(false);
      setError(e);
    }
  }, [logId]);

  useEffect(() => {
    fetchLogEntries();
  }, [fetchLogEntries]);

  const refreshLogEntries = () => {
    delete cache[logId as keyof Cache];
    fetchLogEntries();
  }

  return {
    error,
    logEntries: logEntries || [],
    isLoading,
    refreshLogEntries,
  };
};
