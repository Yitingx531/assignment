import { LogEntryResponse } from '@mapistry/take-home-challenge-shared';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
// Removed unused import
import { useLogEntries } from '../../hooks/useLogEntries';
import { createLogEntry, editLogEntry} from '../../shared/apiClient/logsApi';
import { Error } from '../shared/Error';
import { Loading } from '../shared/Loading';
import { CreateLogEntryModal } from './CreateLogEntryModal';
import { EditLogEntryModal } from './EditLogEntryModal'; 
import { ViewLogEntriesEmptyPage } from './ViewLogEntriesEmptyPage';
import { ViewLogEntriesHeader } from './ViewLogEntriesHeader';
import { ViewLogEntriesTable } from './ViewLogEntriesTable';
import { LogIdSelector } from './LogIdSelector'; 

const Container = styled.div`
  height: 100vh;
`;

export function ViewLogEntries() {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [isCreateEntryOpen, setIsCreateEntryOpen] = useState(false);
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false);
  const [currentLogEntry, setCurrentLogEntry] = useState<LogEntryResponse | null>(null);

  // TODO: Ensure selectedLogId is a valid string before calling useLogEntries.
  // Currently, this works with the existing database because the logId is never null 
  const { logEntries, error, isLoading, refreshLogEntries } = useLogEntries({ logId: selectedLogId! });

  const handleAddNew = useCallback(async () => {
    setIsCreateEntryOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsCreateEntryOpen(false);
    setIsEditEntryOpen(false);
  }, []);
  
  const handleCreateLogEntry = useCallback(async (logEntry) => {
    await createLogEntry({ logId: selectedLogId!, logEntry });
    setIsCreateEntryOpen(false);
    refreshLogEntries();
  }, [selectedLogId, refreshLogEntries]);

    // function to set the current log entry for editing
  const handleCurrentEntry = useCallback((logEntry: LogEntryResponse) => {
    setCurrentLogEntry(logEntry); 
    setIsEditEntryOpen(true);
  }, []);

  // function to handle the editing of an existing log entry
  const handleEditLogEntry = useCallback(async (logEntry) => {
    await editLogEntry(logEntry);
    setIsEditEntryOpen(false);
    refreshLogEntries();
  }, [refreshLogEntries]);

  function content() {
    if (isLoading) {
      return <Loading />
    }
    if (error) {
      return <Error message="Sorry, there was an error loading the log entries." />
    }
    // add conditional check to ensure that a log id is selected before rendering ViewLogEntriesTable
    if (!selectedLogId) {
      return <Error message="Please select a log ID to view entries." />;
    }
    return logEntries.length ?  <ViewLogEntriesTable logId={selectedLogId}  onCurrentEntry={handleCurrentEntry} /> : <ViewLogEntriesEmptyPage />
  }

  return (
    <Container>
     <LogIdSelector onSelectLogId={setSelectedLogId} />
    {isCreateEntryOpen && <CreateLogEntryModal handleClose={handleCloseModal} handleCreate={handleCreateLogEntry} />}
    {isEditEntryOpen && currentLogEntry && <EditLogEntryModal handleClose={handleCloseModal} handleEdit={handleEditLogEntry} logEntry={currentLogEntry} />}
    <ViewLogEntriesHeader
      onAddNew={handleAddNew}
      logName={selectedLogId ? `Log ID: ${selectedLogId}` : 'Select a Log'}
    />
    {content()}
  </Container>
  );
}

