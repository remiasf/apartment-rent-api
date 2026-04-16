import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingStatus, Prisma } from '@prisma/client';
import { FilterBookingDto } from './dto/filter-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService){}
  async createBooking( id:number ,dto: CreateBookingDto) {
    
    if (dto.startDate > dto.endDate) {
      throw new BadRequestException('Invalid booking period');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(dto.startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(dto.endDate);
    end.setHours(0, 0, 0, 0);

    const rentPeriod = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) || 1);

    if (start < today) {
      throw new BadRequestException('You can`t book an apartment in the past');
    }
    
    const overlap = await this.prisma.booking.findFirst({
      where: {
        apartmentId: dto.apartmentId,
        status: {not: 'CANCELLED'},
        AND: [
          { startDate: { lt: end }},
          { endDate: { gt: start}}
        ]
      },
    });

    if (overlap) {
      throw new ConflictException('The apartment is already booked for these dates');
    }

    const apartment = await this.prisma.apartment.findUnique({
      where: {
        id: dto.apartmentId
      },
      select: {
        price: true
      }
    });

    if(!apartment){
      throw new NotFoundException('Apartment not found');
    }

    const newRecord = await this.prisma.booking.create({
      data: {
        startDate: start,
        endDate: end,
        apartmentId: dto.apartmentId,
        userId: id,
        dailyPrice: apartment.price,
        totalPrice: apartment.price * rentPeriod
      }
    });

    return {
      message: 'The apartment has been booked successfully',
      bookingId: newRecord.id
    };
  }

  async myBookings(id: number, dto: FilterBookingDto) {
    const {limit = 10, page = 1, status} = dto;
    
    const safeLimit = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;

    const whereCondition: Prisma.BookingWhereInput = {
      userId: id,
      ...(status && {status})
    };

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: whereCondition,
        take: safeLimit,
        skip: skip,
        select:{
          id: true,
          status: true,
          startDate: true,
          totalPrice: true,
          apartment: { select: { title: true } }
        },
        orderBy:{
          createdAt: 'desc'
        },
      }),
      this.prisma.booking.count({
        where: whereCondition,
      })
    ]);

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  }

  async landlordRequests(landlordId: number, dto: FilterBookingDto) {
    const {limit = 10, page = 1, status} = dto;
    
    const safeLimit = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;

    const whereCondition: Prisma.BookingWhereInput = {
      apartment:{userId: landlordId},
      ...(status && {status})
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: whereCondition,
        take: safeLimit,
        skip: skip,
        select:{
          id: true,
          status: true,
          startDate: true,
          endDate: true,
          totalPrice: true,
          apartment: {select:{title: true}},
          user: {select:{email: true}}
        },
        orderBy:{
          createdAt: 'desc'
        },
      }),
      this.prisma.booking.count({
        where: whereCondition
      })
    ]);

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    }
  }
  
  async bookingInfo(bookingId: number, userId: number) {

    const booking = await this.prisma.booking.findUnique({
      where:{
        id: bookingId,
        userId: userId
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async userCancelBooking(bookingId: number, userId: number) {
    try{
      const cancelledBooking = await this.prisma.booking.update({
        where: {
          id: bookingId,
          userId,
          status: {
            in: ['PENDING', 'APPROVED']
          }
        },
        data: {
          status: 'CANCELLED'
        }
      });

      return {
        message: 'Your booking has been cancelled successfully'
      };
      
    }catch(error){
      if(error.code === 'P2025'){
        throw new ForbiddenException('You can only cancel your own bookings, or booking not found');
      }
      throw error;
    }
  }

  async landlordRejectBooking(bookingId: number, landlordId: number){
    try {
      const cancelledBooking = await this.prisma.booking.update({
        where: {
          id: bookingId,
          apartment: {
            userId: landlordId
          },
          status: 'PENDING'
        },
        data: {
          status: 'CANCELLED'
        }  
      });

      return {
        message: 'Booking has been rejected successfully'
      }

    }catch(error){
      if(error.code === 'P2025'){
        throw new ForbiddenException('You can only cancel your own bookings, or booking not found');
      }
      throw error;
    }
  }

  async landlordApproveBooking(bookingId: number, landlordId: number){
    try {
      const cancelledBooking = await this.prisma.booking.update({
        where: {
          id: bookingId,
          apartment: {
            userId: landlordId
          },
          status: 'PENDING'
        },
        data: {
          status: 'APPROVED'
        }  
      });

      return {
        message: 'Booking has been approved successfully'
      }

    }catch(error){
      if(error.code === 'P2025'){
        throw new ForbiddenException('You can only approve your own bookings, or booking not found');
      }
      throw error;
    }
  }
}
