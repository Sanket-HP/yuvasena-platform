import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const delay = Date.now() - start;
          this.logger.log(`[${req.method}] ${req.url} - Status: ${res.statusCode} - Time: ${delay}ms`);
        },
        error: (err) => {
          const delay = Date.now() - start;
          const status = err.status || 500;
          this.logger.error(`[${req.method}] ${req.url} - Status: ${status} - Time: ${delay}ms - Error: ${err.message}`);
        }
      })
    );
  }
}
