import { LogEntry,  LogEntryProps } from "../../domain/entities/LogEntry";
import { Database } from '../../shared/database';
import { RecordNotFoundError } from '../../shared/errors';
import { LogEntriesPersistenceMapper } from "../mappers/LogEntriesPersistenceMapper";

export class LogEntriesRepository {
  constructor(protected logId: string) {}

  async createLogEntry(logEntry: LogEntry): Promise<LogEntry> {
    const dto = LogEntriesPersistenceMapper.toPersistence(logEntry);
    await Database.createLogEntry(dto);
    return logEntry;
  }

  async findById(logEntryId: string): Promise<LogEntry> {
    const record = await Database.findById(logEntryId);
    if (!record) {
      throw new RecordNotFoundError(`log entry not found for id: ${logEntryId}`);
    }
    return LogEntriesPersistenceMapper.fromPersistence(record);
  }

  async destroyLogEntry(logEntry: LogEntry): Promise<string> {
    await Database.deleteLogEntry(logEntry.id.value);
    return logEntry.id.value;
  }

  // function to edit a log entry
  async editLogEntry(logEntryId: string, updatedEntry: Partial<LogEntryProps>): Promise<LogEntry> {
  try{
    // check if the entry exists by calling findById method
    const existingLogEntry = await this.findById(logEntryId);
    // merge the existing log entry with the updated properties
    const updatedLogEntryProps: LogEntryProps = {
      logDate: updatedEntry.logDate ?? existingLogEntry.logDate,
      logValue: updatedEntry.logValue ?? existingLogEntry.logValue,
      logId: existingLogEntry.logId // This should remain unchanged
    };
    const updatedLogEntry = LogEntry.createFromPersistence(updatedLogEntryProps, logEntryId);
    const dto = LogEntriesPersistenceMapper.toPersistence(updatedLogEntry);
    await Database.editLogEntry(dto.id, dto);
    return LogEntriesPersistenceMapper.fromPersistence(dto);
    } catch(error){
    throw new RecordNotFoundError;
    }
  } 
}
  

  

