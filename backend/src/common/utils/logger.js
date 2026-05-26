/**
 * Simple logger utility with levels
 */
class Logger {
  /**
   * Log an info message
   * @param {string} message - Log message
   * @param {Object} [meta] - Additional metadata
   */
  info(message, meta = {}) {
    this._log('INFO', message, meta);
  }

  /**
   * Log a warning message
   * @param {string} message - Log message
   * @param {Object} [meta] - Additional metadata
   */
  warn(message, meta = {}) {
    this._log('WARN', message, meta);
  }

  /**
   * Log an error message
   * @param {string} message - Log message
   * @param {Object} [meta] - Additional metadata
   */
  error(message, meta = {}) {
    this._log('ERROR', message, meta);
  }

  /**
   * Internal log method
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  _log(level, message, meta) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
    };

    if (level === 'ERROR') {
      console.error(JSON.stringify(logEntry));
    } else if (level === 'WARN') {
      console.warn(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }
}

export const logger = new Logger();
export default logger;
