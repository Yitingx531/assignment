import {useCallback, useEffect, useState, useRef} from 'react'; // added useRef
import { FetchLogEntriesResponse, fetchLogEntries } from '../shared/apiClient/logsApi';

type UseLogEntriesParams = {
  logId: string;
};

type Cache = {
  [logId: string]: FetchLogEntriesResponse,
}

const cache: Cache = {};

export const useLogEntries = ({
  logId,
}: UseLogEntriesParams) => {
  const [isLoading, setIsLoading] = useState(false);
  const [logEntries, setLogEntries] = useState([] as FetchLogEntriesResponse);
  const [error, setError] = useState<unknown>();

  // add ref to track component mount state to prevent memory leak
  // see resource here: https://codedamn.com/news/reactjs/cant-perform-a-react-state-update-error
  const isComponentMounted = useRef(true);

  const fetcher = useCallback(async () => {
    // return if component is unmounted
    if (!isComponentMounted.current) return;

    try {
      setIsLoading(true);
      if (cache[logId]) {
        // check if component is still mounted before updating state
        if (isComponentMounted.current) {
          setIsLoading(false);
          setLogEntries(cache[logId] || []);
        }
      } else {
        const result = await fetchLogEntries(logId);
        // check if component is still mounted before updating state and cache
        if (isComponentMounted.current) {
          cache[logId] = result;
          setIsLoading(false);
          setLogEntries(result);
        }
      }
    } catch (e: unknown) {
      // check if component is still mounted before updating error state
      if (isComponentMounted.current) {
        setIsLoading(false);
        setError(e);
      }
    }
  }, [logId]);

  useEffect(() => {
    // set isComponentMounted to true when the component mounts
    isComponentMounted.current = true;
    
    fetcher();

    // set isComponentMounted to false when component unmounts
    return () => {
      isComponentMounted.current = false;
    };
  }, [fetcher]);

  const refreshLogEntries = useCallback(() => {
    delete cache[logId];
    fetcher();
  }, [logId, fetcher]);

  return {
    error,
    logEntries: logEntries || [],
    isLoading,
    refreshLogEntries,
  };
};