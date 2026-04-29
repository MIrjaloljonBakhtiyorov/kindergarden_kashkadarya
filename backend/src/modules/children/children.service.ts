import { ChildrenRepository } from './children.repository';

export class ChildrenService {
  private repository = new ChildrenRepository();

  async createChild(data: any) {
    // Add validation logic here if needed
    return await this.repository.create(data);
  }

  async getAllChildren() {
    return await this.repository.findAll();
  }

  async updateChild(id: string, data: any) {
    return await this.repository.update(id, data);
  }

  async deleteChild(id: string) {
    return await this.repository.delete(id);
  }
}
