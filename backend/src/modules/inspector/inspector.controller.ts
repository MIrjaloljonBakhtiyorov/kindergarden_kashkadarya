import { Router } from 'express';

export class InspectorController {
  public router = Router();

  constructor() {
    this.router.get('/', this.getAll);
    this.router.post('/', this.create);
  }

  private getAll = (req: any, res: any) => {
    res.json([]);
  };

  private create = (req: any, res: any) => {
    res.status(201).json({ id: Date.now().toString(), status: 'DRAFT' });
  };
}
