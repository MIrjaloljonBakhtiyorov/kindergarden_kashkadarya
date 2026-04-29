import { Request, Response } from 'express';
import { StaffService } from './staff.service';

export class StaffController {
  private service = new StaffService();

  create = async (req: Request, res: Response) => {
    try {
      console.log('Creating staff with data:', req.body);
      const staff = await this.service.create(req.body);
      res.status(201).json(staff);
    } catch (error: any) {
      console.error('Error creating staff:', error);
      res.status(400).json({ error: error.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const staff = await this.service.getAll();
      res.json(staff);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      await this.service.update(req.params.id, req.body);
      res.json({ message: 'Staff updated successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
