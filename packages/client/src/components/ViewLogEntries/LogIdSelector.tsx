import React, { useEffect, useState, useCallback } from 'react';
import { useLogIds } from '../../hooks/useLogIds';

interface LogIdSelectorProps {
  onSelectLogId: (logId: string) => void;
}

export const LogIdSelector: React.FC<LogIdSelectorProps> = ({ onSelectLogId }) => {
  const { logIds, isLoading: isLoadingLogIds, error: logIdsError } = useLogIds();
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  useEffect(() => {
    // set the default logId to the first available logId if no logId is selected
    if (logIds.length > 0 && !selectedLogId) {
      const defaultLogId = logIds[0];
      setSelectedLogId(defaultLogId);
      onSelectLogId(defaultLogId);
    }
  }, [logIds, selectedLogId, onSelectLogId]);
   
  // function to set the id to selected id
  const handleSelectLogId = useCallback((logId: string) => {
    setSelectedLogId(logId);
    onSelectLogId(logId);
  }, [onSelectLogId]);

  if (isLoadingLogIds) {
    return <p>Loading log IDs...</p>;
  }

  if (logIdsError) {
    return <p>Error loading log IDs: {logIdsError}</p>;
  }

  return (
    <div>
      {logIds.map(id => (
        <button
          key={id}
          onClick={() => handleSelectLogId(id)}
          type="button"
        >
          Log ID {id}
        </button>
      ))}
    </div>
  );
};
