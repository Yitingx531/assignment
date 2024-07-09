import { LOG_1_ID, LOG_2_ID } from "@mapistry/take-home-challenge-shared";
import crypto from "crypto";
import fs from 'fs';
import { RecordNotFoundError } from './errors';

export type LogEntriesRecord = {
  id: string;
  logId: string;
  logDate: Date;
  logValue: number;
}

export const LOG_ENTRIES_TABLE_SEED: LogEntriesRecord[] = [
  {
    id: crypto.randomUUID().toString(),
    logId: LOG_1_ID,
    logDate: new Date('2024-01-01'),
    logValue: 5
  },
  {
    id: crypto.randomUUID().toString(),
    logId: LOG_1_ID,
    logDate: new Date('2024-01-02'),
    logValue: 15
  },
  {
    id: crypto.randomUUID().toString(),
    logId: LOG_1_ID,
    logDate: new Date('2024-01-03'),
    logValue: 23
  },
  {
    id: crypto.randomUUID().toString(),
    logId: LOG_2_ID,
    logDate: new Date('2024-01-01'),
    logValue: 15
  }
];

const FILE_NAME = 'database';

export class Database {
  public static async getAllLogEntries(logId: string) {
    let allEntries;
    try {
      await this.simulateDbSlowness();
      const db = await fs.readFileSync(FILE_NAME, 'utf8');
      allEntries = JSON.parse(db) as LogEntriesRecord[];
    } catch (e) {
      await fs.writeFileSync(FILE_NAME, JSON.stringify(LOG_ENTRIES_TABLE_SEED));
      allEntries = LOG_ENTRIES_TABLE_SEED;
    }
    return allEntries.filter(le => le.logId === logId);;
  }

  public static async createLogEntry(entry: LogEntriesRecord) {
    await this.simulateDbSlowness();
    const db = await fs.readFileSync(FILE_NAME, 'utf8');
    const allEntries = JSON.parse(db);
    allEntries.push(entry);
    await fs.writeFileSync(FILE_NAME, JSON.stringify(allEntries));
    return entry;
  }

  public static async findById(logEntryId: string): Promise<LogEntriesRecord | null> {
    await this.simulateDbSlowness();
    const db = await fs.readFileSync(FILE_NAME, 'utf8');
    const allEntries = JSON.parse(db) as LogEntriesRecord[];
    return allEntries.find(le => le.id === logEntryId) || null;
  }

  public static async deleteLogEntry(logEntryId: string) {
    await this.simulateDbSlowness();
    const db = await fs.readFileSync(FILE_NAME, 'utf8');
    const allEntries = JSON.parse(db) as LogEntriesRecord[];
    const index = allEntries.findIndex((le) => le.id === logEntryId);
    allEntries.splice(index, 1);
    await fs.writeFileSync(FILE_NAME, JSON.stringify(allEntries));
    return logEntryId;
  }

  // add function to edit a log entry
  public static async editLogEntry(logEntryId: string, updatedEntry: Partial<LogEntriesRecord>): Promise<LogEntriesRecord | Error> {
    await this.simulateDbSlowness();
    const db = await fs.readFileSync(FILE_NAME, 'utf8');

    try{
      // get all enties related to the logId
      const allEntries = JSON.parse(db) as LogEntriesRecord[];
      const index = allEntries.findIndex((le) => le.id === logEntryId);
      if (index === -1){
       return new RecordNotFoundError('Record Not Found');
      } 
       // update the log entry with the new data, preserving the original id
      allEntries[index] = { ...allEntries[index], ...updatedEntry, id: logEntryId };
     await fs.writeFileSync(FILE_NAME, JSON.stringify(allEntries));
     return allEntries[index];
    } catch(error) {
      return new Error(`An unexpected error occurred in editLogEntry: ${error}`);
  }
}

  // function to getAllLogIds
  public static async getAllLogIds(): Promise<string[]> {
    const db = await fs.readFileSync('database.json', 'utf8');
    const allEntries = JSON.parse(db) as LogEntriesRecord[];
    const uniqueLogIds = Array.from(new Set(allEntries.map(entry => entry.logId)));
    return uniqueLogIds;
  }

  private static simulateDbSlowness(ms = 1000) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}
