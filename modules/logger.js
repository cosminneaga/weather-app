/**
 * Logger class for managing application logs with configurable log levels and storage.
 * Extends the Storage class to persist log entries.
 *
 * @class
 * @extends Storage
 *
 * @param {...*} args - Initial log entries to store.
 *
 * @property {Object} levels - Mapping of log level names to numeric values.
 * @property {string} configLevel - The log level configured in the application settings.
 * @property {number} level - The numeric value of the current log level.
 * @property {boolean} enabled - Whether logging is enabled.
 * @property {number} max - Maximum number of logs to retain.
 * @property {Object} enablingStages - Mapping of log levels to arrays of enabled numeric levels.
 */
import { CONFIG } from './config.js';
import Storage from './storage.js';

export default class Logger extends Storage {
  constructor(...args) {
    super({
      logs: [...args],
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
   * @param {*} [data] - Optional additional data to log.
   */
  debug(message, data) {
    if (this.enablingStages.debug.includes(this.level)) {
      this._log('DEBUG', message, data);
    }
  }

  /**
   * Logs an informational message if the current log level allows it.
   *
   * @param {string} message - The message to log.
   * @param {*} [data] - Optional additional data to log.
   */
  info(message, data) {
    if (this.enablingStages.info.includes(this.level)) {
      this._log('INFO', message, data);
    }
  }

  /**
   * Logs a warning message if the current log level is enabled for warnings.
   *
   * @param {string} message - The warning message to log.
   * @param {*} [data] - Optional additional data to include with the log entry.
   */
  warn(message, data) {
    if (this.enablingStages.warn.includes(this.level)) {
      this._log('WARN', message, data);
    }
  }

  /**
   * Logs an error message if the current log level is enabled for errors.
   *
   * @param {string} message - The error message to log.
   * @param {Error|null} [error] - An optional Error object containing additional error details.
   */
  error(message, error) {
    if (this.enablingStages.error.includes(this.level)) {
      this._log('ERROR', message, error.stack);
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
    if (typeof data === 'object') {
      data = JSON.stringify(data, null, 4);
    }
    const line = `[${timestamp}] ${level}: ${message}${data ? '|' + data + '|' : ''}`;
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
    this.clear([], 'logs');
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
