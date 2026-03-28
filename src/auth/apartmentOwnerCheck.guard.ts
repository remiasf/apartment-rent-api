import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  NotFoundException, 
  ForbiddenException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IsApartmentOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = request.user?.id; 
    
    const apartmentId = parseInt(request.params.id, 10); 

    if (!userId) {
      throw new ForbiddenException('User not authorized');
    }
    if (isNaN(apartmentId)) {
      throw new NotFoundException('Incorrect ID');
    }

    const apartment = await this.prisma.apartment.findUnique({
      where: { id: apartmentId },
      select: { userId: true } 
    });

    if (!apartment) {
      throw new NotFoundException('Apartment not found');
    }

    if (apartment.userId !== userId) {
      throw new ForbiddenException('You have no right to configure this apartment');
    }

    return true; 
  }
}