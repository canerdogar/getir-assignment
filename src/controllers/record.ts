import { Request, Response, NextFunction } from "express";
import { Record, RecordDocument } from "../models/record";
import { getRecordsQuery } from "../util/queries";
import { Error } from "mongoose";

export const getRecords = (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate, minCount, maxCount } = req.body;
    Record.aggregate(getRecordsQuery(startDate, endDate, minCount, maxCount), (err: Error, records: RecordDocument[]) => {
        if (err) { return next(err); }
        res.send(records);
    });
};