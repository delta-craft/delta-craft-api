import { Injectable, NestMiddleware } from "@nestjs/common";
import { InjectSentry, SentryService } from "@ntegral/nestjs-sentry";
import { Request, Response, NextFunction } from "express";

const ignoredStatus = [200, 201, 304, 401, 404];

@Injectable()
export class SetryLoggerMiddleware implements NestMiddleware {
  public constructor(@InjectSentry() private readonly client: SentryService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
      if (!ignoredStatus.includes(res.statusCode)) {
        this.client
          .instance()
          .captureException(new Error("Request failed"), (x) => {
            x.addBreadcrumb({
              type: "Status",
              category: "HTTP",
              data: {
                Method: req.method,
                Code: res.statusCode,
                URL: req.url,
                Headers: req.headers,
                Body: req.body,
              },
            });
            return x;
          });
      }
    });

    next();
  }
}
