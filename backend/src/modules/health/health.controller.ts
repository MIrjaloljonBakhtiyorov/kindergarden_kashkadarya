import { Request, Response } from 'express';
import { HealthRepository } from './health.repository';
import { OperationsRepository } from '../operations/operations.repository';

const healthRepo = new HealthRepository();

export class HealthController {
  async saveBatch(req: Request, res: Response) {
    const { group_name, records } = req.body;
    // records: Array of health check data
    try {
      for (const record of records) {
        await healthRepo.saveCheck(record);
      }
      await OperationsRepository.log('CREATE', 'HEALTH_CHECK', group_name, `Guruh uchun tibbiy ko'rik saqlandi: ${group_name}`);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getHistory(req: Request, res: Response) {
    const groupId = req.params.groupId as string;
    try {
      const history = await healthRepo.getHistoryByGroup(groupId);
      res.json(history);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getArchive(req: Request, res: Response) {
    try {
      const archive = await healthRepo.getArchiveSummary();
      res.json(archive);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
