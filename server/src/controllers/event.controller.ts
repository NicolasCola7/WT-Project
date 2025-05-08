import CalendarEvent, { CalendarEventI } from "../models/event.model";
import { Request, Response } from 'express';
import BaseController from "./base.controller";

export default class CalendarEventController extends BaseController<CalendarEventI> {
    model = CalendarEvent;

    getMyEvents =  async (req: Request, res: Response): Promise<void> => {
        try {
            const userID = req.query.userID;
            const date = new Date(req.query.date as string);

             const query: any = { creatorId: userID };
            
             if (date) {
                 query.startDate = { $lte: date };
                 query.endDate = {$gt: date}
             }

             
 
             const myEvents = await this.model.find(query);
            res.status(200).json(myEvents);
            } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    };
}