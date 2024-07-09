import { HttpStatusCode } from '@mapistry/take-home-challenge-shared';
import { Router } from 'express';
import { LogEntriesService } from '../../application/services/LogEntriesService';
import { RecordNotFoundError, ValidationError } from '../../shared/errors';
import { LOG_ENTRIES_TABLE_SEED } from '../../shared/database'; 

export const logEntriesController = Router();

logEntriesController.get('/logs/:logId/log-entries', async (req, res) => {
  const { logId } = req.params;
  const logEntryService = new LogEntriesService();
  const logEntries = await logEntryService.getLogEntries(logId);
  res.json(logEntries);
});

// TODO: consider changing this to post request
logEntriesController.put('/logs/:logId/log-entries', async (req, res) => {
  const { logId } = req.params;
  const { logEntry } = req.body; // consider remove {} as the entire request body should be logEntry
  const logEntryService = new LogEntriesService();
  try {
    const logEntries = await logEntryService.createLogEntry(logId, logEntry);
    res.json(logEntries);
  } catch (e: unknown) {
    if (e instanceof ValidationError) {
      res.status(HttpStatusCode.INVALID_DATA);
      res.send(e.toString());
    } else {
      res.status(HttpStatusCode.SERVER_ERROR);
      res.send();
    }
  }
});

logEntriesController.delete('/logs/:logId/log-entries/:logEntryId', async (req, res) => {
  const { logId, logEntryId } = req.params;
  const logEntryService = new LogEntriesService();
  try {
    const logEntries = await logEntryService.deleteLogEntry(logId, logEntryId);
    res.json(logEntries);
  } catch (e: unknown) {
    if (e instanceof RecordNotFoundError) {
      res.status(HttpStatusCode.INVALID_DATA);
      res.send(e.toString());
    } else {
      res.status(HttpStatusCode.SERVER_ERROR);
      res.send();
    }
    res.json();
  }
});

  // add PUT route to edit log entries
  logEntriesController.put('/logs/:logId/log-entries/:logEntryId', async (req, res) => {
    const { logId, logEntryId } = req.params;
    const { logValue, logDate }  = req.body;
    const updatedLogEntryObj = {
      'logValue': logValue,
      'logDate': logDate
    }
    const logEntryService = new LogEntriesService();
    try {
      const updatedLogEntry = await logEntryService.editLogEntry(logId, logEntryId,updatedLogEntryObj);
      res.json(updatedLogEntry);
    } catch (e: unknown) {
      if (e instanceof RecordNotFoundError) {
        res.status(HttpStatusCode.INVALID_DATA);
        res.send(e.toString());
      } else {
        res.status(HttpStatusCode.SERVER_ERROR);
        res.send();
      }
    }
  });

// route to get all log IDs to later fetch logEntries related to the log ID
logEntriesController.get('/logs/log-ids', async (req, res) => {
  // extract unique log IDs from the LOG_ENTRIES_TABLE_SEED array
  const uniqueLogIds = Array.from(new Set(LOG_ENTRIES_TABLE_SEED.map(entry => entry.logId)));
  res.json(uniqueLogIds);
});



