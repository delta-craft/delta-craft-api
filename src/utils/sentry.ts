import { SentryService } from "@ntegral/nestjs-sentry";
import { Request } from "express";

export const sendToSentry = <TRes = any, T = any>(
  sentry: SentryService,
  request: Request,
  status: number,
  content?: TRes,
  exception?: T,
) => {
  sentry
    .instance()
    .captureException(exception ?? new Error("Request failed"), (x) => {
      x.addBreadcrumb({
        type: "Status",
        category: "HTTP",
        data: {
          Method: request.method,
          Code: status,
          URL: request.url,
          Headers: request.headers,
          Body: request.body,
          Content: content,
        },
      });
      return x;
    });
};
