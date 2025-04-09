import Activity, { ActivityI } from "../models/activity.model";
import { Request, Response } from 'express';
import BaseController from "./base.controller";

export default class ActivityController extends BaseController<ActivityI> {
    model = Activity;

    getMyActivities =  async (req: Request, res: Response): Promise<void> => {
        try {
            const userID = req.query.userID;
            const myActivities = await this.model.find({ creatorId: userID });
            res.status(200).json(myActivities);
          } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    };
}