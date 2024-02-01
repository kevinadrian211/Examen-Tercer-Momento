// costumes.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CostumesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAvailableCostumes() {
    return this.prismaService.getAvailableCostumes();
  }

  async addCostumesToInventory(amount: number) {
    return this.prismaService.addCostumesToInventory(amount);
  }
}
