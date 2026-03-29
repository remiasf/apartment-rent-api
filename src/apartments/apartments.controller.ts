import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { DiscountApartmentDto } from './dto/discount-apartment.dto';
import { FilterApartmentDto } from './dto/filter-apartmenr.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { IsApartmentOwnerGuard } from 'src/auth/apartmentOwnerCheck.guard';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD)
  @Post()
  create(@Req() req, @Body()  createApartmentDto: CreateApartmentDto) {
    const currentUserId = req.user.id
    console.log('users data:', createApartmentDto);
    return this.apartmentsService.create(currentUserId, createApartmentDto);
  }


  @Get()
  findAll(@Query() filterDto: FilterApartmentDto, @Query('page') page: string) {
    const pageNumber = Number(page) || 1;
    return this.apartmentsService.findAll(filterDto, pageNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apartmentsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, IsApartmentOwnerGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LANDLORD)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApartmentDto: UpdateApartmentDto) {
    return this.apartmentsService.update(+id, updateApartmentDto);
  }

  @UseGuards(JwtAuthGuard, IsApartmentOwnerGuard, RolesGuard)
  @Roles(Role.LANDLORD)
  @Patch(':id/discount')
  setDiscount(@Param('id') id: string, @Body() discountDto: DiscountApartmentDto) {
    return this.apartmentsService.setDiscount(+id, discountDto);
  }

  @UseGuards(JwtAuthGuard, IsApartmentOwnerGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LANDLORD)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apartmentsService.remove(+id);
  }
}
