import { LogEntryResponse } from '@mapistry/take-home-challenge-shared';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useLastVisitedLog } from '../../hooks/useLastVisitedLog';
import { useLogEntries } from '../../hooks/useLogEntries';
import { createLogEntry, editLogEntry } from '../../shared/apiClient/logsApi';
import { Error } from '../shared/Error';
import { Loading } from '../shared/Loading';
import { CreateLogEntryModal } from './CreateLogEntryModal';
import { EditLogEntryModal } from './EditLogEntryModal'; // import EditLogEntryModal
import { ViewLogEntriesEmptyPage } from './ViewLogEntriesEmptyPage';
import { ViewLogEntriesHeader } from './ViewLogEntriesHeader';
import { ViewLogEntriesTable } from './ViewLogEntriesTable';

const Container = styled.div`
  height: 100vh;
`;

export function ViewLogEntries() {
  const { lastVisitedLog } = useLastVisitedLog();
  const { logEntries, error, isLoading, refreshLogEntries } = useLogEntries({ logId: lastVisitedLog.id });
  const [isCreateEntryOpen, setIsCreateEntryOpen] = useState(false);
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false);
  const [currentLogEntry, setCurrentLogEntry] = useState<LogEntryResponse | null>(null);


  const handleAddNew = useCallback(async () => {
    setIsCreateEntryOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsCreateEntryOpen(false);
  }, [setIsCreateEntryOpen]);

  const handleCloseEditModal = useCallback(() => {
    setIsEditEntryOpen(false);
  }, [setIsEditEntryOpen]);

  const handleCreateLogEntry = useCallback(async (logEntry) => {
    await createLogEntry({ logId: lastVisitedLog.id, logEntry });
    setIsCreateEntryOpen(false);
    refreshLogEntries();
  }, [lastVisitedLog, refreshLogEntries, setIsCreateEntryOpen]);

  const handleEditLogEntry = useCallback(async (logEntry) => {
    await editLogEntry(logEntry);
    setIsEditEntryOpen(false);
    refreshLogEntries();
  }, [refreshLogEntries]);

  const handleEdit = useCallback((logEntry: LogEntryResponse) => {
    setCurrentLogEntry(logEntry);
    setIsEditEntryOpen(true);
  }, []);

  function content() {
    if (isLoading) {
      return <Loading />
    }
    if (error) {
      return <Error message="Sorry, there was an error loading the log entries." />
    }
    return logEntries.length ?  <ViewLogEntriesTable logId={lastVisitedLog.id} onEdit={handleEdit} /> : <ViewLogEntriesEmptyPage />
  }

  return (
    <Container>
      {isCreateEntryOpen && <CreateLogEntryModal handleClose={handleCloseModal} handleCreate={handleCreateLogEntry} />}
      {isEditEntryOpen && currentLogEntry && <EditLogEntryModal handleClose={handleCloseEditModal} handleEdit={handleEditLogEntry} logEntry={currentLogEntry} />}
      <ViewLogEntriesHeader
        onAddNew={handleAddNew}
        logName={lastVisitedLog.name}
      />
      {content()}
    </Container>
  );
}
