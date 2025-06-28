import { CONFIG } from './config.js';
import Storage from './storage.js';

export default class Logger extends Storage {
  constructor() {
    super({
        logs: []
    })
    this.levels = { debug: 0, info: 1, warn: 2, error: 3 };
    this.level = this.levels[CONFIG.LOGGING.LEVEL];
    this.enabled = CONFIG.LOGGING.ENABLED;
    this.max = CONFIG.LOGGING.MAX_LOGS;
  }

  debug(message, data = null) {
    if (this.level === 0) {
      this._log(this.level, message, data);
    }
  }

  info(message, data = null) {
    if (this.level === 1) {
      this._log(this.level, message, data);
    }
  }

  warn(message, data = null) {
    if (this.level === 2) {
      this._log(this.level, message, data);
    }
  }

  error(message, error = null) {
    if (this.level === 3) {
      this._log(this.level, message, error.message);
    }
  }

  _log(level, message, data) {
    if (!this.enabled) return;

    const timestamp = new Date().toLocaleTimeString();
    const line = `[${timestamp}] ${level}: ${message} ${JSON.stringify(data, null, 4)}`;
    this.unshift(line, 'logs');

    if (this.data.logs.length >= this.max) {
      this.pop('logs');
    }
  }

  getLogs() {
    return this.data.logs;
  }

  clearLogs() {
    this.data.logs = [];
  }

  exportLogs() {
    return JSON.stringify(this.data.logs);
  }
}

// Exportă o instanță unică (Singleton pattern)
export const logger = new Logger();
