import { Request, Response } from 'express';
import { ChildrenService } from './children.service';

export class ChildrenController {
  private service = new ChildrenService();

  create = async (req: Request, res: Response) => {
    try {
      const result = await this.service.createChild(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const children = await this.service.getAllChildren();
      res.status(200).json(children);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      await this.service.updateChild(req.params.id as string, req.body);
      res.status(200).json({ message: 'Child updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.service.deleteChild(req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
