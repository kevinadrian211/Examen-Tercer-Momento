// attendees.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CostumesService } from '../costumes/costumes.service';

@Injectable()
export class AttendeesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly costumesService: CostumesService,
  ) {}

  async purchaseCostumes(attendeeId: number, costumeIds: number[]) {
    // Verifica si el asistente existe
    const attendee = await this.prismaService.attendee.findUnique({
      where: { id: attendeeId },
      include: { costumes: true }, // Cargar disfraces actuales del asistente
    });

    if (!attendee) {
      throw new NotFoundException('Asistente no encontrado');
    }

    // Verifica si los disfraces solicitados existen y están en stock
    const requestedCostumes = await this.prismaService.costume.findMany({
      where: { id: { in: costumeIds }, stock: true },
    });

    if (requestedCostumes.length !== costumeIds.length) {
      throw new BadRequestException('Algunos disfraces no están disponibles o no existen');
    }

    // Realiza la compra actualizando la relación entre el asistente y los disfraces
    const updatedAttendee = await this.prismaService.attendee.update({
      where: { id: attendeeId },
      data: {
        costumes: {
          connect: requestedCostumes.map((costume) => ({ id: costume.id })),
        },
      },
      include: { costumes: true }, // Cargar disfraces después de la compra
    });

    // Actualiza el stock de los disfraces comprados
    await this.costumesService.updateCostumesStock(costumeIds, false);

    return updatedAttendee;
  }
}
