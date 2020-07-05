import { ErrorMessages } from "../util/errorMessages";

export class GetirException extends Error {

    private errorMessage: ErrorMessages;

    constructor(message: ErrorMessages) {
      super(message);
      Error.captureStackTrace(this, this.constructor);
    }
  }