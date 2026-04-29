import { Request, Response } from 'express';
import { GroupsRepository } from './groups.repository';

export class GroupsController {
  private repository = new GroupsRepository();

  getAll = async (req: Request, res: Response) => {
    try {
      const groups = await this.repository.findAll();
      res.json(groups);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const group = await this.repository.create(req.body);
      res.status(201).json(group);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const group = await this.repository.update(req.params.id, req.body);
      res.json(group);
    } catch (error: any) {
      console.error('Group update error:', error);
      res.status(500).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.repository.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      console.error('Group delete error:', error);
      res.status(500).json({ error: error.message });
    }
  };
}
