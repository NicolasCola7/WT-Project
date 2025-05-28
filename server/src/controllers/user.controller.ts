import { sign, Secret } from 'jsonwebtoken';
import { Request, Response } from 'express';
import User, { UserI } from '../models/user.model';
import BaseController from './base.controller';

class UserController extends BaseController<UserI> {
  model = User;
  secret: Secret = process.env.JWT_SECRET as string;

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.model.findOne({ email: req.body.email });
      if (!user) {
        res.sendStatus(403);
        return;
      }
      user.comparePassword(req.body.password, (error, isMatch: boolean) => {
        if (error || !isMatch) {
          res.sendStatus(403);
          return;
        }
        const token = sign({ user: { id: user._id } }, this.secret, { expiresIn: '24h' });
        res.status(200).json({ token });
      });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  updateLayout = async (req: Request, res: Response): Promise<void> => {
    const userId = req.body.userId;
    const layout = req.body.layout;

    if (!userId || !layout) {
      res.status(400).json({ error: 'Missing userId or layout' });
      return;
    }

    try {
      //trovo l'utente con id che corrispe a quello contenuto a 'userId' e aggiorno il campo gridLayout
      const user = await this.model.findByIdAndUpdate(
        userId,
        { gridLayout: layout },
        { new: true }
      );

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user.gridLayout);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  //ottiene il layout della dashboard salvato di ogni singolo utente
  getLayout = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;

    try {
      //query che mi restituisce il campo gridLayout dell'utente che ha come id 'userId'
      const user = await this.model.findById(userId).select('gridLayout');
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      //restituisco il layout sotto forma di json
      res.status(200).json(user.gridLayout);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  //api che legge il valore della time-machine dal db
  getTimeMachine = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
      const user = await this.model.findById(userId).select('timeMachine');
      if (!user) {
        res.status(404).json({ error: 'Utente non trovato' });
        return;
      }

      // Inizializza la timeMachine se mancante
      if (!user.timeMachine) {
        user.timeMachine = {
          isRealTime: true,
          selectedDateTime: new Date(),
          timestamp: new Date(),
        };
        await user.save();
      }

      //nella risposta faccio passare i tre parametri utili nel frontend
      res.status(200).json({
        isRealTime: user.timeMachine.isRealTime,
        selectedDateTime: user.timeMachine.selectedDateTime,
        timestamp: user.timeMachine.timestamp,
      });
    } catch (error: any) {
      console.error('Errore nel recupero della time-machine:', error);
      res.status(500).json({ error: error.message });
    }
  };

  //api che aggiorna il la time-machine sul db
  putTimeMachine = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { isRealTime, selectedDateTime } = req.body;

    try {
      const updated = await this.model.findByIdAndUpdate(
        userId,
        {
          $set: {
            timeMachine: {
              isRealTime: typeof isRealTime === 'boolean' ? isRealTime : true,
              selectedDateTime: selectedDateTime ? new Date(selectedDateTime) : new Date(),
              timestamp: new Date(),
            }
          }
        },
        { new: true }
      );

      if (!updated) {
        res.status(404).json({ error: 'Utente non trovato' });
        return;
      }

      res.status(200).json({ message: 'Time machine aggiornata', data: updated.timeMachine });
    } catch (error: any) {
      console.error("Errore nell'aggiornamento della time-machine:", error);
      res.status(500).json({ error: error.message });
    }
  };

}

export default UserController;