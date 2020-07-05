import { Meta } from "express-validator";

export function isValidDate(value: string) {
    if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
  
    const date = new Date(value);
    if (!date.getTime()) return false;
    return date.toISOString().slice(0, 10) === value;
}

export const dateComparison = (endDate: string, meta: Meta) => new Date(endDate) >= new Date(meta.req.body.startDate);

export const maxGteMin = (maxCount: number, meta: Meta) => maxCount >= meta.req.body.minCount;
