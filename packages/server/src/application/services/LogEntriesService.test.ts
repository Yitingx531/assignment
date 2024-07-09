/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LOG_2_ID, LogEntryResponse } from "@mapistry/take-home-challenge-shared";
import { Database, LogEntriesRecord } from "../../shared/database";
import { LogEntriesService } from './LogEntriesService';

describe('LogEntriesService', () => {
  const subject = new LogEntriesService();

  describe('getLogEntries', () => {
    let result: LogEntryResponse[];

    beforeAll(async () => {
      result = await subject.getLogEntries(LOG_2_ID);
    });

    it('returns all of the log entries for the given log id', async () => {
      expect(result).toHaveLength(1);
    });

    it('only returns log entries for the given log id', async () => {
      expect(result.every(le => le.logId === LOG_2_ID)).toBeTruthy();
    });
  });

  describe('createLogEntry', () => {
    const newEntry = {
      logDate: '2024-01-01',
      logValue: 23,
    };
    let result: LogEntryResponse;

    beforeAll(async () => {
      result = await subject.createLogEntry(LOG_2_ID, newEntry);
    });

    it('creates a new log entry', async () => {
      const allEntries = await subject.getLogEntries(LOG_2_ID);
      expect(allEntries).toHaveLength(2);
    });

    it('returns the new log entry with an id', async () => {
      expect(result.logDate).toEqual(new Date(newEntry.logDate));
      expect(result.logValue).toEqual(newEntry.logValue);
      expect(result.id).toBeDefined();
    });
  });

  describe('deleteLogEntry', () => {
    let entryToDelete: LogEntriesRecord | undefined;
    let result: string;

    beforeAll(async () => {
      [entryToDelete] = await Database.getAllLogEntries(LOG_2_ID);
      result = await subject.deleteLogEntry(LOG_2_ID, entryToDelete!.id);
    });

    it('deletes the log entry for the given id', async () => {
      const allEntries = await subject.getLogEntries(LOG_2_ID);
      expect(allEntries).toHaveLength(1);
      expect(allEntries.find(le => le.id === entryToDelete!.id)).toBeFalsy();
    });

    it('returns the deleted log entry id', () => {
      expect(result).toBe(entryToDelete!.id);
    });
  })

  describe('editLogEntry', () => {
    const updatedEntry = {
      logDate: '2024-06-01',
      logValue: 45,
    };
    let entryToEdit: LogEntriesRecord | undefined;
    let result: LogEntryResponse;

    beforeAll(async () => {
      const allEntries = await Database.getAllLogEntries(LOG_2_ID);
      [entryToEdit] = allEntries;
      result = await subject.editLogEntry(LOG_2_ID, entryToEdit!.id, {
        logDate: new Date(updatedEntry.logDate), // convert to Date object
        logValue: updatedEntry.logValue,
      });
    });

    it('updates the log entry for the given id', async () => {
      const allEntries = await subject.getLogEntries(LOG_2_ID);
      const updatedLogEntry = allEntries.find(le => le.id === entryToEdit!.id);
      expect(updatedLogEntry).toBeDefined();
      if (updatedLogEntry) { // Add null check here
        // eslint-disable-next-line jest/no-conditional-expect
        expect(new Date(updatedLogEntry.logDate).toISOString()).toEqual(new Date(updatedEntry.logDate).toISOString());
        // eslint-disable-next-line jest/no-conditional-expect
        expect(updatedLogEntry.logValue).toEqual(updatedEntry.logValue);
      }
    });

    it('returns the updated log entry with the new values', () => {
      expect(new Date(result.logDate).toISOString()).toEqual(new Date(updatedEntry.logDate).toISOString());
      expect(result.logValue).toEqual(updatedEntry.logValue);
    });
  });
});

