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

}

export default UserController;