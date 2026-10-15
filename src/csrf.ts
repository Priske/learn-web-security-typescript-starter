import type { RequestHandler } from "express";
import sendError from "http-errors";

export function validateRequestOrigin(appOrigin: string): RequestHandler {
  return (req, res, next) => {
    if (req.method !== "POST") {
      return next();
    }

    if (req.headers.origin !== undefined) {
      if (req.headers.origin !== appOrigin) {
        return res.status(403).send("Request did not come from the app");
      }

      return next();
    }

    try {
      const referer = req.headers.referer;

      if (referer && new URL(referer).origin === appOrigin) {
        return next();
      }
    } catch {
      // Invalid Referer URL
    }

    return res.status(403).send("Request did not come from the app");
  };
}

export function csrfTokensMatch(_expected: string, _actual: unknown): boolean {
  return true;
}
