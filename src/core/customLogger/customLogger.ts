import {
  ConsoleLogger,
  Inject,
  Injectable,
  LoggerService,
  Scope,
} from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { LogLevel, DEFAULT_CONTEXT } from './customLogger.consts';
import { ConfigService } from '@nestjs/config';

export interface Log {
  timestamp: string;
  level: LogLevel;
  message: string;
  sourceClass?: string;
  traceId?: string;
  error?: unknown;
  dataObject?: unknown; // Don't change the name, it's used by OpenSearch
}

/**
 * Custom logger for the application..
 */
@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger implements LoggerService {
  private readonly sourceClass: string;
  private readonly isLocalEnvironment: boolean;

  // The parent class is injected by NestJS, and defined as optional for standalone usage in main.ts
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(INQUIRER) private readonly parentClass?: object,
  ) {
    super();
    this.isLocalEnvironment = !this.configService.get('NODE_ENV');

    if (!this.isLocalEnvironment) {
      this.disableFormatters();
    }

    if (this.parentClass?.constructor.name) {
      this.sourceClass = this.parentClass.constructor.name;
    } else {
      this.sourceClass = DEFAULT_CONTEXT;
    }
    this.setContext(this.sourceClass);
  }

  disableFormatters() {
    this.formatPid = () => '';
    this.formatMessage = (logLevel: LogLevel, message: unknown) => {
      let jsonString = JSON.stringify(message);
      // Those spaces are required by OpenSearch to parse the json correctly
      jsonString = jsonString.replace(/":"/g, '" : "');
      jsonString = jsonString.replace(/","/g, '" , "');
      jsonString = jsonString.replace(/":/g, '": ');
      jsonString = jsonString.replace(/",/g, '", ');
      jsonString = jsonString.replace(/,"/g, ', "');
      jsonString = jsonString.replace(/{"/g, '{ "');
      jsonString = jsonString.replace(/"}/g, '" }');
      jsonString = jsonString.replace(/{{/g, '{ {');
      jsonString = jsonString.replace(/}}/g, '} }');
      jsonString += '\n';
      return jsonString;
    };
    this.formatContext = () => '';
  }

  private getBaseLog(
    level: LogLevel,
    message: string,
    data?: unknown,
  ): Log | string {
    if (this.isLocalEnvironment) {
      if (!data || typeof data === 'string') {
        return message;
      }

      return `${message}: ${JSON.stringify(data)}`;
    }

    const log: Log = {
      message,
      level,
      timestamp: new Date().toISOString(),
      sourceClass: this.sourceClass,
      dataObject: data,
    };

    if (typeof data === 'string') {
      log.sourceClass = data;
      log.dataObject = null;
    }

    return log;
  }

  trackRequest(
    method: string,
    url: string,
    body?: unknown,
    userId?: string,
  ): void {
    if (url !== '' && url !== '/') {
      const path = url.split('?')[0]?.replace('/api', '');
      this.debug('HTTP Request', { method, url, path, body, userId });
    }
  }

  log<T>(message: string, data?: T): void {
    const log = this.getBaseLog(LogLevel.LOG, message, data);
    super.log(log);
  }

  error<T>(message: string, data?: T): void {
    const log = this.getBaseLog(LogLevel.ERROR, message, data);
    super.error(log);
  }

  debug<T>(message: string, data?: T) {
    const log = this.getBaseLog(LogLevel.DEBUG, message, data);
    super.debug(log);
  }
}
