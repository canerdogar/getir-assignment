import { ErrorMessages } from "../util/errorMessages";
import { RecordDocument } from "./record";

export interface GetirResponse {
    code: number;
    msg: string;
    records: RecordDocument[];
}