// prisma.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient, Attendee } from '@prisma/client';

@Injectable()
export class PrismaService {
  constructor(private readonly prisma: PrismaClient) {}

  get attendee() {
    return this.prisma.attendee;
  }

  // ... otros métodos ...

  async createAttendee(data: Partial<Attendee>) {
    return this.attendee.create({ data });
  }

  async findAttendeeById(id: number) {
    return this.attendee.findUnique({ where: { id } });
  }

  // Añade otros métodos según tus necesidades
}
