import winston, { format } from "winston";

export const WarnLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      format: format.combine(format.simple()),
    }),
    new winston.transports.File({ level: "warn", filename: "warn.log" }),
  ],
});

export const logger = () => (req, res, next) => {
  req.logger = WarnLogger;
  next();
};

export const ErrorLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      format: format.combine(format.simple()),
    }),
    new winston.transports.File({ level: "error", filename: "error.log" }),
  ],
});
