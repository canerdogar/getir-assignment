import mongoose from "mongoose";

export type RecordDocument = mongoose.Document & {
    key: string;
    createdAt: Date;
    counts: number[];
    value: string;
};

const recordSchema = new mongoose.Schema({
    key: String,
    createdAt: Date,
    counts: [Number],
    value: String
});


export const Record = mongoose.model<RecordDocument>("records", recordSchema);