import { CreateLogEntryRequest, LogEntryResponse } from "@mapistry/take-home-challenge-shared";

export interface CreateLogEntryParams {
  logId: string;
  logEntry: CreateLogEntryRequest;
}

export type FetchLogsResponse = LogEntryResponse[];
export type CreateLogEntryResponse = LogEntryResponse;

export async function fetchLogs(logId: string): Promise<FetchLogsResponse> {
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
  const logEntries: FetchLogsResponse = await res.json();
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