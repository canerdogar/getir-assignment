import { RecordDocument } from "../models/Record";
import { ErrorMessages } from "./errorMessages";
import { GetirResponse } from "../models/GetirResponse";

export function prepareResponse(records: RecordDocument[], errorMessage?: string): GetirResponse {
    return {
        code: errorMessage ? 1 : 0,
        msg: errorMessage ? errorMessage : "success",
        records
    };
}