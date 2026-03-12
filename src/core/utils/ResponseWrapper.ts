export class ResponseWrapper<T> {
  statusCode: number;
  data?: T;
  message?: string;
  timestamp: string;

  constructor(data?: T, message?: string, statusCode = 200) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}