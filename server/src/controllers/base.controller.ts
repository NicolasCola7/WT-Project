import { Request, Response } from 'express';
import { Model } from 'mongoose';

//TUTTI I CONTROLLER LO DOVRANNO ESTENDERE
abstract class BaseController<T> {

  abstract model:Model<T>

  // Get all
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const docs = await this.model.find({});
      res.status(200).json(docs);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  // Insert
  insert = async (req: Request, res: Response): Promise<void> => {
    try {
      const obj = await new this.model(req.body).save();
      res.status(201).json(obj);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  // Get by id
  get = async (req: Request, res: Response): Promise<void> => {
    try {
      const obj = await this.model.findOne({ _id: req.params.id });
      res.status(200).json(obj);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  // Update by id
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.model.findOneAndUpdate({ _id: req.params.id }, req.body);
      res.sendStatus(200);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  // Delete by id
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.model.findOneAndDelete({ _id: req.params.id });
      res.sendStatus(200);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  // Drop collection
  deleteAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      await this.model.deleteMany();
      res.sendStatus(200);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };
}

export default BaseController;