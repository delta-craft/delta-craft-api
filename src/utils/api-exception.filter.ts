import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ApiException } from "src/types/exceptions/api.exception";
import { Response } from "express";

@Catch(ApiException)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: ApiException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const toSend = exception.res;

    response.status(exception.getStatus()).json(toSend);
  }
}
