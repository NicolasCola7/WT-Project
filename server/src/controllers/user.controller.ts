import { sign, Secret } from 'jsonwebtoken';
import { Request, Response } from 'express';
import User, { UserI } from '../models/user.model';
import BaseController from './base.controller';

const secret: Secret = process.env.JWT_TOKEN as string;

class UserController extends BaseController<UserI> {
  model = User;

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
        const token = sign({ user: { id: user._id } }, secret, { expiresIn: '24h' });
        res.status(200).json({ token });
      });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

}

export default UserController;