import { HttpException, HttpStatus } from "@nestjs/common";
import { IApiPluginResponse } from "../ApiResponse";

export class ApiException<T = any> extends HttpException {
  readonly res: T;
  readonly sentryHandling: boolean;

  constructor(
    response: T,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    sentryHandling: boolean = false,
  ) {
    super(response, status);
    this.res = response;
    this.sentryHandling = sentryHandling;
  }
}
export class PluginApiException<T = any> extends ApiException<
  IApiPluginResponse<T>
> {
  constructor(
    response: IApiPluginResponse<T>,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    sentryHandling: boolean = false,
  ) {
    super(response, status, sentryHandling);
  }
}

export class BoolApiException extends PluginApiException<boolean> {
  constructor(
    response: IApiPluginResponse<boolean>,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    sentryHandling: boolean = false,
  ) {
    response.content = false;
    super(response, status, sentryHandling);
  }
}
