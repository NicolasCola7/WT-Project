// controllers/settings.controller.ts
import { Request, Response } from 'express';
import Settings, { SettingsI } from '../models/settings-pomodoro.model';
import BaseController from './base.controller';

class SettingsPomodoroController extends BaseController<SettingsI> {
  model = Settings;

  // GET /settings/user/:userId
  getByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const settings = await this.model.findOne({ userId });
      if (!settings) {
        res.sendStatus(404);
        return;
      }
      res.status(200).json(settings);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  // POST /settings/user
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

export default SettingsPomodoroController;
