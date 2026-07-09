import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';
    let errors: string[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resContent = exception.getResponse();
      if (typeof resContent === 'object' && resContent !== null) {
        message = (resContent as any).message || (resContent as any).error || resContent;
        errors = (resContent as any).errors || [];
      } else {
        message = resContent;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma Known Constraints
      switch (exception.code) {
        case 'P2002': // Unique constraint violation
          status = HttpStatus.CONFLICT;
          const target = (exception.meta?.target as string[])?.join(', ') || 'fields';
          message = `Unique constraint validation failed on: ${target}`;
          break;
        case 'P2025': // Record not found
          status = HttpStatus.NOT_FOUND;
          message = exception.meta?.cause as string || 'Record not found';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = `Database constraint error: ${exception.message}`;
          break;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled Exception at ${request.url}: ${exception.message}`, exception.stack);
    } else {
      this.logger.error(`Unknown Exception: ${JSON.stringify(exception)}`);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message : (message as any).message || message,
      errors: errors.length > 0 ? errors : undefined,
    });
  }
}
