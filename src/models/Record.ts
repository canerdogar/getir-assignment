import mongoose from "mongoose";

export interface RecordJSON {
    key: string;
    createdAt: Date;
    counts: number[];
    value: string;
}

export type RecordDocument = mongoose.Document & RecordJSON;

const recordSchema = new mongoose.Schema({
    key: String,
    createdAt: Date,
    counts: [Number],
    value: String
});


export const Record = mongoose.model<RecordDocument>("records", recordSchema);