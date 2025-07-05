import winston from 'winston';
import type { Logger, LogLevel } from '../types';

// Create winston logger instance
const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
      const metaString = Object.keys(meta).length > 0 ? 
        `\n${JSON.stringify(meta, null, 2)}` : '';
      const stackString = stack ? `\n${stack}` : '';
      return `${timestamp} [${level}]: ${message}${metaString}${stackString}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

// Add file transport for production
if (process.env.NODE_ENV === 'production') {
  winstonLogger.add(new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }));

  winstonLogger.add(new winston.transports.File({
    filename: 'logs/combined.log',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }));
}

// Custom logger implementation
export const logger: Logger = {
  error(message: string, meta?: any): void {
    winstonLogger.error(message, meta);
  },

  warn(message: string, meta?: any): void {
    winstonLogger.warn(message, meta);
  },

  info(message: string, meta?: any): void {
    winstonLogger.info(message, meta);
  },

  debug(message: string, meta?: any): void {
    winstonLogger.debug(message, meta);
  },
};

// Performance tracking utilities
export const performanceLogger = {
  start(operation: string): () => void {
    const startTime = process.hrtime.bigint();
    return () => {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // Convert to ms
      logger.info(`Performance: ${operation}`, { duration: `${duration.toFixed(2)}ms` });
    };
  },

  async track<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const endTimer = this.start(operation);
    try {
      const result = await fn();
      endTimer();
      return result;
    } catch (error) {
      endTimer();
      logger.error(`Performance: ${operation} failed`, { error });
      throw error;
    }
  },
};

// Error handling utilities
export const errorHandler = {
  handle(error: Error, context?: Record<string, any>): void {
    logger.error('Unhandled error', { 
      error: error.message, 
      stack: error.stack,
      ...context 
    });
  },

  async handleAsync<T>(
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error as Error, context);
      return null;
    }
  },

  wrap<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context?: Record<string, any>
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handle(error as Error, { ...context, args });
        throw error;
      }
    }) as T;
  },
};

// Request/response logging for Netlify functions
export const requestLogger = {
  logRequest(
    method: string,
    path: string,
    headers: Record<string, string>,
    body?: string
  ): void {
    logger.info('Incoming request', {
      method,
      path,
      userAgent: headers['user-agent'],
      contentLength: headers['content-length'],
      hasBody: !!body,
    });
  },

  logResponse(
    statusCode: number,
    duration: number,
    responseSize?: number
  ): void {
    logger.info('Response sent', {
      statusCode,
      duration: `${duration}ms`,
      responseSize: responseSize ? `${responseSize} bytes` : undefined,
    });
  },

  middleware() {
    return (req: any, res: any, next: any) => {
      const startTime = Date.now();
      
      // Log request
      this.logRequest(
        req.method,
        req.path,
        req.headers,
        req.body
      );

      // Override res.end to log response
      const originalEnd = res.end;
      res.end = function(chunk?: any, encoding?: any) {
        const duration = Date.now() - startTime;
        const responseSize = chunk ? Buffer.byteLength(chunk, encoding) : 0;
        
        requestLogger.logResponse(
          res.statusCode,
          duration,
          responseSize
        );

        originalEnd.call(this, chunk, encoding);
      };

      next();
    };
  },
};

// Structured logging for different components
export const componentLogger = {
  crawler: {
    start(url: string): void {
      logger.info('Crawler started', { url });
    },
    success(url: string, duration: number, contentSize: number): void {
      logger.info('Crawler completed', { url, duration, contentSize });
    },
    error(url: string, error: Error): void {
      logger.error('Crawler failed', { url, error: error.message });
    },
  },

  ai: {
    request(provider: string, tokens: number): void {
      logger.info('AI request', { provider, tokens });
    },
    response(provider: string, tokens: number, cost?: number): void {
      logger.info('AI response', { provider, tokens, cost });
    },
    error(provider: string, error: Error): void {
      logger.error('AI request failed', { provider, error: error.message });
    },
  },

  github: {
    prCreated(repo: string, prNumber: number, prUrl: string): void {
      logger.info('GitHub PR created', { repo, prNumber, prUrl });
    },
    prMerged(repo: string, prNumber: number): void {
      logger.info('GitHub PR merged', { repo, prNumber });
    },
    error(repo: string, error: Error): void {
      logger.error('GitHub operation failed', { repo, error: error.message });
    },
  },

  performance: {
    lighthouse(url: string, score: number): void {
      logger.info('Lighthouse audit completed', { url, score });
    },
    regression(url: string, oldScore: number, newScore: number): void {
      logger.warn('Performance regression detected', { url, oldScore, newScore });
    },
  },
};

export default logger;