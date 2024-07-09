import { CreateLogEntryRequest, LogEntryResponse } from "@mapistry/take-home-challenge-shared";
import { LogEntriesQueryRepository } from "../../persistence/repositories/LogEntriesQueryRepository";
import { LogEntriesRepository } from "../../persistence/repositories/LogEntriesRepository";
import { LogEntriesApiMapper } from "../mappers/LogEntriesApiMapper";
import { LogEntriesRecord } from "../../shared/database";
import { RecordNotFoundError } from "../../shared/errors";

export class LogEntriesService {
  getLogEntries(logId: string): Promise<LogEntryResponse[]> {
    const logEntryRepository = new LogEntriesQueryRepository();
    return logEntryRepository.findLogEntries(logId);
  }

  async createLogEntry(logId: string, createLogEntry: CreateLogEntryRequest): Promise<LogEntryResponse> {
    const mapper = new LogEntriesApiMapper();
    const logEntry = mapper.fromRequest(logId, createLogEntry);
    const repository = new LogEntriesRepository(logId);
    const newEntry = await repository.createLogEntry(logEntry);
    return mapper.toResponse(newEntry);
  }

  async deleteLogEntry(logId: string, logEntryId: string): Promise<string> {
    const logEntryRepository = new LogEntriesRepository(logId);
    const logEntry = await logEntryRepository.findById(logEntryId);
    return logEntryRepository.destroyLogEntry(logEntry);
  }

  // function to edit a log entry
  async editLogEntry(
    logId: string, 
    logEntryId: string, 
    updatedEntry: Partial<LogEntriesRecord>
  ): Promise<LogEntryResponse> {
    const repository = new LogEntriesRepository(logId);
    const mapper = new LogEntriesApiMapper();
    try {
      // update the log entry in the repository
      const updatedLogEntry = await repository.editLogEntry(logEntryId, updatedEntry);
      return mapper.toResponse(updatedLogEntry);
    } catch (error) {
      if (error instanceof RecordNotFoundError) {
       throw error;
      } 
      throw new Error('Fail to edit the entry');
    }
  }
  
  async getAllLogIds(): Promise<string[]> {
    const logEntryRepository = new LogEntriesQueryRepository();
    return logEntryRepository.findAllLogIds();
  }
}