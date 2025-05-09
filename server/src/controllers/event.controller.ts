import CalendarEvent, { CalendarEventI } from "../models/event.model";
import { Request, Response } from 'express';
import BaseController from "./base.controller";

export default class CalendarEventController extends BaseController<CalendarEventI> {
    model = CalendarEvent;

    getMyEvents =  async (req: Request, res: Response): Promise<void> => {
        try {
            const userID = req.query.userID;
            const date = req.query.date as string;
            const query: any = { creatorId: userID };
            
             if (date) {
                const startOfDay = new Date(date);
        
                const endOfDay = new Date(startOfDay);
                endOfDay.setHours(23, 59, 59, 999);
                
                query.$or = [
                     // Events starting today
                    {
                        startDate: {
                            $gte: startOfDay,
                            $lte: endOfDay
                        }
                    },
                    // Events that started before today but haven't finished yet
                    {
                        startDate: { $lt: startOfDay },
                        endDate: { $gte: startOfDay }
                    },
                ];
             }

             const myEvents = await this.model.find(query);
            res.status(200).json(myEvents);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    };
}