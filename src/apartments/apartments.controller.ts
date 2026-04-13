import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { DiscountApartmentDto } from './dto/discount-apartment.dto';
import { FilterApartmentDto } from './dto/filter-apartment.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { IsApartmentOwnerGuard } from 'src/common/guards/apartmentOwnerCheck.guard';
import { CurrentUserID } from 'src/common/decorators/currentUserID.decorator';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD)
  @Post()
  create(@CurrentUserID() userId: number, @Body()  createApartmentDto: CreateApartmentDto) {
    console.log('users data:', createApartmentDto);
    return this.apartmentsService.create(userId, createApartmentDto);
  }


  @Get()
  findAll(@Query() filterDto: FilterApartmentDto) {
    const pageNumber = Number(filterDto.page) || 1;
    return this.apartmentsService.findAll(filterDto, pageNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apartmentsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, IsApartmentOwnerGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN ,Role.ADMIN, Role.LANDLORD)
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
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.LANDLORD)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apartmentsService.remove(+id);
  }
}
