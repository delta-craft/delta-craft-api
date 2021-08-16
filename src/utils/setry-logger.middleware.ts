import { Injectable, NestMiddleware } from "@nestjs/common";
import { InjectSentry, SentryService } from "@ntegral/nestjs-sentry";
import { Request, Response, NextFunction } from "express";
import { sendToSentry } from "./sentry";

const ignoredStatus = [200, 201, 202, 204, 304, 400, 401, 404];

@Injectable()
export class SetryLoggerMiddleware implements NestMiddleware {
  public constructor(@InjectSentry() private readonly sentry: SentryService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
      if (!ignoredStatus.includes(res.statusCode)) {
        sendToSentry(this.sentry, req, res.statusCode, null, null);
      }
    });

    next();
  }
}
