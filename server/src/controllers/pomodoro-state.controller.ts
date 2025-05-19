// controllers/pomodoroState.controller.ts
import { Request, Response } from 'express';
import PomodoroState, { PomodoroStateI } from '../models/pomodoro-state.model';
import BaseController from './base.controller';

class PomodoroStateController extends BaseController<PomodoroStateI> {
  model = PomodoroState;

  // GET /pomodoro/user/:userId
  getByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const state = await this.model.findOne({ userId });
      if (!state) {
        res.sendStatus(404);
        return;
      }
      res.status(200).json(state);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  // POST /pomodoro/user
  saveOrUpdateByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.body;
      const updated = await this.model.findOneAndUpdate(
        { userId },
        req.body,
        { new: true, upsert: true }
      );
      res.status(200).json(updated);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };
}

export default PomodoroStateController;
