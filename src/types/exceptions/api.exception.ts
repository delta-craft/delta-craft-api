import { HttpException, HttpStatus } from "@nestjs/common";
import { Exception } from "@sentry/node";
import { IApiPluginResponse, PluginApiError } from "../ApiResponse";

export class ApiException<T = any> extends HttpException {
  readonly res: T;
  readonly sentryHandling: boolean;
  readonly originalException?: any;

  constructor(
    response: T,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    sentryHandling: boolean = false,
    originalException?: any,
  ) {
    super(response, status);
    this.res = response;
    this.sentryHandling = sentryHandling;
    this.originalException = originalException;
  }
}
export class PluginApiException<T = any> extends ApiException<
  IApiPluginResponse<T>
> {
  constructor(
    response: IApiPluginResponse<T>,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    sentryHandling: boolean = false,
    originalException?: any,
  ) {
    super(response, status, sentryHandling, originalException);
  }
}

export class BoolApiException extends PluginApiException<boolean> {
  constructor(
    response: IApiPluginResponse<boolean>,
    sentryHandling: boolean = false,
    originalException?: any,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    response.content = false;
    // Enable sentry handling on plugin unkown error
    const sentry = sentryHandling || response?.error === PluginApiError.Unknown;
    super(response, status, sentry, originalException);
  }
}
