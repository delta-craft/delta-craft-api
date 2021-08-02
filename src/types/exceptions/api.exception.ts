import { HttpException, HttpStatus } from "@nestjs/common";

export class ApiException<T = any> extends HttpException {
  readonly res: T;
  constructor(response: T, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(response, status);
    this.res = response;
  }
}
