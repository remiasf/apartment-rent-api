import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CurrentUserID } from 'src/common/decorators/currentUserID.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FilterBookingDto } from './dto/filter-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('book')
  createBooking(@CurrentUserID() id: number, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(id, dto);
  }

  @Get('me')
  myBookings(@CurrentUserID() id: number, @Body() dto: FilterBookingDto) {
    return this.bookingsService.myBookings(id, dto);
  }

  @Get(':id')
  bookingInfo(@Param('id', ParseIntPipe) bookingId: number, @CurrentUserID() userId: number) {
    return this.bookingsService.bookingInfo(bookingId, userId);
  }

  @Patch(':id/cancel')
  userCancelBooking(@Param('id', ParseIntPipe) bookingId: number, @CurrentUserID() userId: number) {
    return this.bookingsService.userCancelBooking(bookingId, userId);
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles('LANDLORD', 'ADMIN', 'SUPER_ADMIN')
  landlordRejectBooking(@Param('id', ParseIntPipe) bookingId: number, @CurrentUserID() landlordId: number) {
    return this.bookingsService.landlordRejectBooking(bookingId, landlordId);
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('LANDLORD', 'ADMIN', 'SUPER_ADMIN')
  landlordApproveBooking(@Param('id', ParseIntPipe) bookingId: number, @CurrentUserID() landlordId: number) {
    return this.bookingsService.landlordApproveBooking(bookingId, landlordId);
  }
}
