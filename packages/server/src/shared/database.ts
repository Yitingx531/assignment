import { LOG_1_ID, LOG_2_ID } from "@mapistry/take-home-challenge-shared";
import crypto from "crypto";

export type LogEntriesRecord = {
  id: string;
  logId: string;
  logDate: Date;
  logValue: number;
}

export const logEntriesTable: LogEntriesRecord[] = [
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

export function simulateDbSlowness(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
