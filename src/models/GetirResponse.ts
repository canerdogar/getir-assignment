import { ErrorMessages } from "../util/errorMessages";
import { RecordDocument } from "./Record";

export interface GetirResponse {
    code: number;
    msg: string;
    records: RecordDocument[];
}