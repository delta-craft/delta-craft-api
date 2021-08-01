import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { Request, Response } from 'express';
import { PluginApiError } from 'src/types/ApiResponse';

@Catch()
export class SentryExceptionFilter<T> implements ExceptionFilter {
  public constructor(@InjectSentry() private readonly client: SentryService) { }

  async catch(exception: T, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    this.writeResponse(response, status, request);

    if (status == HttpStatus.UNAUTHORIZED) {
      return
    }

    this.client.instance().captureException(exception, x => {
      x.addBreadcrumb({
        type: "Status",
        category: "HTTP",
        data: {
          Method: request.method,
          Code: status,
          URL: request.url,
          Headers: request.headers,
          Body: request.body
        }
      })
      return x;
    })
  }

  private writeResponse(response: Response, status: HttpStatus, request: Request) {
    response.status(status).json({
      error: PluginApiError.Unknown,
      content: null,
      message: "Error",
      statusCode: status,
      timestamp: new Date().toISOString()
    });
  }
}
