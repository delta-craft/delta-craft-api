import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ApiException } from "src/types/exceptions/api.exception";
import { Response, Request } from "express";
import { InjectSentry, SentryService } from "@ntegral/nestjs-sentry";
import { sendToSentry } from "./sentry";

@Catch(ApiException)
export class ApiExceptionFilter implements ExceptionFilter {
  public constructor(@InjectSentry() private readonly sentry: SentryService) {}

  catch(exception: ApiException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    const toSend = exception.res;

    if (exception.sentryHandling) {
      const request = ctx.getRequest<Request>();
      sendToSentry(
        this.sentry,
        request,
        statusCode,
        toSend,
        exception.originalException,
      );
    }

    response.status(statusCode).json(toSend);
  }
}
