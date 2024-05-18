import { LogEntry } from "../../domain/entities/LogEntry";
import { logEntriesTable, simulateDbSlowness } from '../../shared/database';
import { LogEntriesPersistenceMapper } from "../mappers/LogEntriesPersistenceMapper";

export class RecordNotFoundError extends Error {}

export class LogEntriesRepository {
  constructor(protected logId: string) {}

  async createLogEntry(logEntry: LogEntry): Promise<LogEntry> {
    await simulateDbSlowness(1000);
    const dto = LogEntriesPersistenceMapper.toPersistence(logEntry);
    logEntriesTable.push(dto);
    return logEntry;
  }

  async findById(logEntryId: string): Promise<LogEntry> {
    await simulateDbSlowness(1000);
    const record = logEntriesTable.find(le => le.id === logEntryId);
    if (!record) {
      throw new RecordNotFoundError(`log entry not found for id: ${logEntryId}`);
    }
    return LogEntriesPersistenceMapper.fromPersistence(record);
  }

  async destroyLogEntry(logEntry: LogEntry): Promise<string> {
    await simulateDbSlowness(1000);
    const index = logEntriesTable.findIndex((le) => le.id === logEntry.id.value);
    logEntriesTable.splice(index, 1)[0];
    return logEntry.id.value;
  }
}
