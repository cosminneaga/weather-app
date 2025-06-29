import { CONFIG } from './config.js';
import Storage from './storage.js';

export default class Logger extends Storage {
  constructor() {
    super({
      logs: [],
    });
    this.levels = { debug: 0, info: 1, warn: 2, error: 3 };
    this.configLevel = CONFIG.LOGGING.LEVEL;
    this.level = this.levels[this.configLevel];
    this.enabled = CONFIG.LOGGING.ENABLED;
    this.max = CONFIG.LOGGING.MAX_LOGS;

    /**
     * 'enablingStage' enables certain logs for each level
     * for instance if we have 'debug' level enabled all logs will be stored
     * as the level shrinks towards 'error' the levels above would not be stored
     * i.e. level 'warn' will store 'warn' & 'error' only
     */
    this.enablingStages = {
      debug: [0],
      info: [0, 1],
      warn: [0, 1, 2],
      error: [0, 1, 2, 3],
    };
  }

/**
 * Logs a debug message if the current log level is enabled for debugging.
 *
 * @param {string} message - The message to log.
 * @param {*} [data=null] - Optional additional data to log.
 */
  debug(message, data = null) {
    if (this.enablingStages.debug.includes(this.level)) {
        console.log('debug')
      this._log(this.level, message, data);
    }
  }

/**
 * Logs an informational message if the current log level allows it.
 *
 * @param {string} message - The message to log.
 * @param {*} [data=null] - Optional additional data to log.
 */
  info(message, data = null) {
    if (this.enablingStages.info.includes(this.level)) {
        console.log('info')
      this._log(this.level, message, data);
    }
  }

/**
 * Logs a warning message if the current log level is enabled for warnings.
 *
 * @param {string} message - The warning message to log.
 * @param {*} [data=null] - Optional additional data to include with the log entry.
 */
  warn(message, data = null) {
    if (this.enablingStages.warn.includes(this.level)) {
        console.log('warn')
      this._log(this.level, message, data);
    }
  }

/**
 * Logs an error message if the current log level is enabled for errors.
 *
 * @param {string} message - The error message to log.
 * @param {Error|null} [error=null] - An optional Error object containing additional error details.
 */
  error(message, error = null) {
    if (this.enablingStages.error.includes(this.level)) {
        console.log('error')
      this._log(this.level, message, error.message);
    }
  }

/**
 * Logs a message with a specified level and optional data if logging is enabled.
 *
 * @private
 * @param {string} level - The severity level of the log (e.g., 'info', 'error').
 * @param {string} message - The log message to record.
 * @param {Object} [data] - Optional additional data to include in the log entry.
 */
  _log(level, message, data) {
    if (!this.enabled) return;

    const timestamp = new Date().toLocaleTimeString();
    const line = `[${timestamp}] ${level}: ${message} ${JSON.stringify(data, null, 4)}`;
    this.unshift(line, 'logs');

    if (this.data.logs.length >= this.max) {
      this.pop('logs');
    }
  }

/**
 * Retrieves the logs stored in the logger.
 * @returns {Array} An array containing the log entries.
 */
  getLogs() {
    return this.data.logs;
  }

/**
 * Clears all log entries from the logger.
 *
 * Empties the `logs` array in the logger's data object.
 */
  clearLogs() {
    this.clear([], 'logs')
  }

/**
 * Exports the current logs as a JSON string.
 *
 * @returns {string} A JSON string representation of the logs.
 */
  exportLogs() {
    return JSON.stringify(this.data.logs);
  }
}

// Exportă o instanță unică (Singleton pattern)
export const logger = new Logger();
