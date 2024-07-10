import { CreateLogEntryRequest, LogEntryResponse } from "@mapistry/take-home-challenge-shared";

export interface CreateLogEntryParams {
  logId: string;
  logEntry: CreateLogEntryRequest;
}

export type FetchLogEntriesResponse = LogEntryResponse[];
export type CreateLogEntryResponse = LogEntryResponse;

export async function fetchLogEntries(logId: string): Promise<FetchLogEntriesResponse> {
  const res = await fetch(
    `/api/logs/${logId}/log-entries`,
    {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch log entries');
  }
  const logEntries: FetchLogEntriesResponse = await res.json();
  return logEntries;
}

export async function createLogEntry({
  logId,
  logEntry,
}: CreateLogEntryParams): Promise<CreateLogEntryResponse> {
  const res = await fetch(
    `/api/logs/${logId}/log-entries`,
    {
      body: JSON.stringify({ logEntry }),
      // TODO: consider change this PUT request to a POST request for adding new log entries
      method: 'put',
      headers: {
        'content-type': 'application/json',
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to create log entry');
  }
  const newlogEntry: CreateLogEntryResponse = await res.json();
  return newlogEntry;
}

export async function deleteLogEntry(logEntry: LogEntryResponse) {
  const { logId, id } = logEntry;
  const res = await fetch(
    `/api/logs/${logId}/log-entries/${id}`,
    {
      method: 'delete',
      headers: {
        'content-type': 'application/json',
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to delete log entry');
  }
}

// 
export async function editLogEntry(logEntry: LogEntryResponse): Promise<LogEntryResponse> {
  const res = await fetch( `/api/logs/${logEntry.logId}/log-entries/${logEntry.id}`, {
    body: JSON.stringify( {
      logDate: logEntry.logDate,
      logValue: logEntry.logValue
    } ),
    method: 'put',
    headers: {
      'content-type': 'application/json',
    },
})
if (!res.ok) {
  throw new Error('Failed to edit log entry');
}
const editedLogEntry: LogEntryResponse = await res.json();

return editedLogEntry;
}

// function to fetch log IDs from the server
export async function fetchLogIds() {
  const res = await fetch('/api/logs/log-ids', {
    method: 'get',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch log IDs');
  }
  // return the array of log IDs
  const logIds = await res.json();
  return logIds;
}