import { RecordDocument } from "../models/Record";
import { ErrorMessages } from "./errorMessages";
import { GetirResponse } from "../models/GetirResponse";

/**
 * returns the response in the expected format. if errorMessage param provided then sets status accordingly.
 * @param records 
 * @param errorMessage 
 */
export function prepareResponse(records: RecordDocument[], errorMessage?: string): GetirResponse {
    return {
        code: errorMessage ? 1 : 0,
        msg: errorMessage ? errorMessage : "success",
        records
    };
}