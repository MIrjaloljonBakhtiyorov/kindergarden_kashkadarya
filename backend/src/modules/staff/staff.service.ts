import { StaffRepository } from './staff.repository';

export class StaffService {
  private repository = new StaffRepository();

  async create(data: any) {
    return this.repository.create(data);
  }

  async getAll() {
    return this.repository.findAll();
  }

  async update(id: string, data: any) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
