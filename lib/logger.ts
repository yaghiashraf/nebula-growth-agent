// Simplified logger for deployment - no external dependencies

// Simple logger implementation
interface LogData {
  [key: string]: any;
}

class SimpleLogger {
  info(message: string, data?: LogData) {
    console.log(`[INFO] ${message}`, data || '');
  }
  
  error(message: string, data?: LogData) {
    console.error(`[ERROR] ${message}`, data || '');
  }
  
  warn(message: string, data?: LogData) {
    console.warn(`[WARN] ${message}`, data || '');
  }
  
  debug(message: string, data?: LogData) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  }
}

// Performance logger
class PerformanceLogger {
  start(operation: string) {
    const startTime = Date.now();
    return {
      end: () => {
        const duration = Date.now() - startTime;
        logger.info(`Performance: ${operation} took ${duration}ms`);
        return duration;
      }
    };
  }
  
  async logExecution<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const timer = this.start(operation);
    try {
      const result = await fn();
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      logger.error(`Failed during ${operation}`, { error });
      throw error;
    }
  }
}

// Component logger
class ComponentLogger {
  constructor(private component: string) {}
  
  info(message: string, data?: LogData) {
    logger.info(`[${this.component}] ${message}`, data);
  }
  
  error(message: string, data?: LogData) {
    logger.error(`[${this.component}] ${message}`, data);
  }
  
  warn(message: string, data?: LogData) {
    logger.warn(`[${this.component}] ${message}`, data);
  }
  
  debug(message: string, data?: LogData) {
    logger.debug(`[${this.component}] ${message}`, data);
  }
}

// Export logger instances
export const logger = new SimpleLogger();
export const performanceLogger = new PerformanceLogger();

// Component logger factory
export const componentLogger = (component: string) => new ComponentLogger(component);

// Default export
export default logger;