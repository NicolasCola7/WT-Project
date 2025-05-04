
import UploadedCalendar, { UploadedCalendarI } from "../models/uploaded-calendar.model";
import BaseController from "./base.controller";
import express, { Request, Response } from 'express';

export default class UploadedCalendarController extends BaseController<UploadedCalendarI> {
    model = UploadedCalendar;

    getMyUploadedCalendars =  async (req: Request, res: Response): Promise<void> => {
        try {
            const userID = req.query.userID;
            const myCalendars = await this.model.find({ userId: userID });
            res.status(200).json(myCalendars);
            } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    };
}