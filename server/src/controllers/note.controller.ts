
import { Request, Response } from 'express';
import BaseController from "./base.controller";
import Note, { NoteI } from '../models/note.model';

export default class NoteController extends BaseController<NoteI> {
    model = Note;

    getMyNotes =  async (req: Request, res: Response): Promise<void> => {
        try {
            const userID = req.query.userID;
            
            const myNotes = await this.model.find({ creatorId: userID });
            res.status(200).json(myNotes);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    };
}