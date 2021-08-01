import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SetryLoggerMiddleware implements NestMiddleware {
  public constructor(@InjectSentry() private readonly client: SentryService) { }

  use(req: Request, res: Response, next: NextFunction) {

    res.on("finish", () => {
      if (res.statusCode !== 200 && res.statusCode !== 401) {
        this.client.instance().captureMessage("Request failed", x => {
          x.addBreadcrumb({
            type: "Status",
            category: "HTTP",
            data: {
              Method: req.method,
              Code: status,
              URL: req.url,
              Headers: req.headers,
              Body: req.body
            }
          })
          return x;
        })
      }
    });

    next();
  }
}
