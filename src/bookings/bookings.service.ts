import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingStatus, Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService){}
  async createBooking( id:number ,dto: CreateBookingDto) {
    
    if (dto.startDate > dto.endDate) {
      throw new BadRequestException('Invalid booking period');
    }

    if (dto.startDate < new Date()) {
      throw new BadRequestException('Invalid booking period');
    }
    
    const overlap = await this.prisma.booking.findFirst({
      where: {
        apartmentId: dto.apartmentId,
        status: {not: 'CANCELLED'},
        AND: [
          { startDate: { lt: dto.endDate }},
          { endDate: { gt: dto.startDate}}
        ]
      },
    });

    if (overlap) {
      throw new ConflictException('The apartment is already booked for these dates');
    }

    const newRecord = await this.prisma.booking.create({
      data: {
        ...dto,
        userId: id
      }
    });

    return {
      message: 'The apartment has been booked successfully',
      bookingId: newRecord.id
    };
  }

  async myBookings(id: number) {

    const bookings = await this.prisma.booking.findMany({
      where:{
        userId: id
      },
      orderBy:{
        createdAt: 'desc'
      },
    });

    return bookings;
  }

  async bookingInfo(bookingId:number, userId: number) {

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
