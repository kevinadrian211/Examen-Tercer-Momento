// costumes.controller.ts
import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { CostumesService } from './costumes.service';

@Controller('costumes')
export class CostumesController {
  constructor(private readonly costumesService: CostumesService) {}

  @Get('stock')
  async getAvailableCostumes() {
    try {
      const costumes = await this.costumesService.getAvailableCostumes();
      return { costumes };
    } catch (error) {
      return { error: 'Error al obtener los disfraces en stock.' };
    }
  }

  @Post('supplying')
  async supplyCostumes(@Body('attendeesCount') attendeesCount: number) {
    try {
      const availableCostumes = await this.costumesService.getAvailableCostumes();

      if (availableCostumes.length < attendeesCount) {
        const costumesToAdd = attendeesCount - availableCostumes.length;
        await this.costumesService.addCostumesToInventory(costumesToAdd);
        return { success: true, message: `Se agregaron ${costumesToAdd} disfraces al inventario.` };
      } else {
        throw new BadRequestException('Inventario suficiente, no se requiere suministro.');
      }
    } catch (error) {
      return { error: 'Error al manejar el suministro de disfraces.' };
    }
  }
}
