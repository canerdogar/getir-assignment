import { Request, Response, NextFunction } from "express";
import { Record, RecordDocument } from "../models/record";
import { getRecordsQuery } from "../util/queries";
import { dateComparison, isValidDate, maxGteMin } from "../util/validators";
import { Error } from "mongoose";
import { body, check, validationResult } from "express-validator";
import { ErrorMessages } from "../util/errorMessages"; 

export const getRecords = async (req: Request, res: Response, next: NextFunction) => {
    // validations
    await check("startDate").exists().withMessage(ErrorMessages.STARTDATE_NOT_GIVEN).run(req);
    await check("endDate").exists().withMessage(ErrorMessages.ENDDATE_NOT_GIVEN).run(req);
    await check("minCount").exists().withMessage(ErrorMessages.MIN_NOT_GIVEN).run(req);
    await check("maxCount").exists().withMessage(ErrorMessages.MAX_NOT_GIVEN).run(req);

    await body("startDate")
        .if(body("startDate").exists())
        .custom(isValidDate).withMessage(ErrorMessages.STARTDATE_NOT_VALID).run(req);

    await body("endDate")
        .if(body("endDate").exists())
        .custom(isValidDate).withMessage(ErrorMessages.ENDDATE_NOT_VALID).run(req);

    await body("endDate")
        .if(body("startDate").exists())
        .if(body("endDate").exists())
        .if(body("startDate").custom(isValidDate))
        .if(body("endDate").exists().custom(isValidDate))
        .custom(dateComparison).withMessage(ErrorMessages.STARTDATE_NOT_BEFORE_ENDDATE).run(req);
    
    await body("minCount").isNumeric().withMessage(ErrorMessages.MIN_NOT_NUMERIC).run(req);
    await body("maxCount").isNumeric().withMessage(ErrorMessages.MAX_NOT_NUMERIC).run(req);

    await body("maxCount")
        .if(body("minCount").exists())
        .if(body("minCount").isNumeric())
        .if(body("maxCount").exists())
        .if(body("maxCount").isNumeric())
        .custom(maxGteMin).withMessage(ErrorMessages.MAX_NOT_GTE_MIN).run(req);
    
    const errors = validationResult(req).formatWith(({ msg }) => {
        return msg;
    });

    if (!errors.isEmpty()) {
        return res.send(errors.array());
    }

    const { startDate, endDate, minCount, maxCount } = req.body;
    Record.aggregate(getRecordsQuery(startDate, endDate, minCount, maxCount), (err: Error, records: RecordDocument[]) => {
        if (err) { return next(err); }
        res.send(records);
    });
};