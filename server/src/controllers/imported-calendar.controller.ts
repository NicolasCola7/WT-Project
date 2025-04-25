import ImportedCalendar, { ImportedCalendarI } from "../models/imported-calendar.model";
import BaseController from "./base.controller";
import { Request, Response } from 'express';

export default class ImportedCalendarController extends BaseController<ImportedCalendarI> {
    model = ImportedCalendar;

    getMyImportedCalendars =  async (req: Request, res: Response): Promise<void> => {
        try {
            const userID = req.query.userID;
            const myCalendars = await this.model.find({ userId: userID });
            res.status(200).json(myCalendars);
            } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    };
}