import { LogEntriesRecord, logEntriesTable, simulateDbSlowness } from "../../shared/database";

export class LogEntriesQueryRepository {
  async findLogEntries(logId: string): Promise<LogEntriesRecord[]> {
    await simulateDbSlowness(1000);
    return logEntriesTable.filter(le => le.logId === logId);
  }
}