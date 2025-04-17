import OpenAI from "openai";
import Chat, { ChatI } from "../models/chat.model";
import BaseController from "./base.controller";
import { Request, Response } from 'express';


export default class ChatController extends BaseController<ChatI> {
    model = Chat;
    openai: OpenAI;
    MODEL = 'gpt-4o-mini';

    constructor(){
        super();
        this.openai = new OpenAI({ apiKey: process.env.API_KEY });
    }

    getMyChats = async (req: Request, res: Response): Promise<void> => {
        try {
            const userID = req.query.userID;
            const myChats = await this.model.find({ creatorId: userID });
            res.status(200).json(myChats);
            } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    };

    generateResponse = async (req: Request, res: Response): Promise<void> => {
        try {
            const prompt = req.body;
            const completion = await this.openai.chat.completions.create({
                model: this.MODEL,
                messages: [{ role: 'user', content: prompt }],
                //stream: true,
            });
            
            /*for await (const chunk of completion) {
                res.write(chunk.choices[0].delta.content);
            }*/

            res.status(200).json(completion.choices[0].message.content);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }
}