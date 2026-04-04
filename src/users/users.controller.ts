import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUserID } from 'src/common/decorators/currentUserID.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateInfoDto } from './dto/update-info.dto';
import { UpdateLoginDto } from './dto/update-login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@CurrentUserID() userId: number) {
    return this.usersService.getMyProfile(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  updatePassword(@CurrentUserID() id: number, @Body() dto: UpdatePasswordDto) {
    return this.usersService.updatePassword(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/info')
  updateInfo(@CurrentUserID() id: number, @Body() dto: UpdateInfoDto) {
    return this.usersService.updateInfo(id, dto);
  }
  
  @UseGuards(JwtAuthGuard)  
  @Delete('me')
  remove(@CurrentUserID() id: number) {
    return this.usersService.remove(id);
  }

  @Patch('me/login')
  updateLogin(@CurrentUserID() id: number, @Body() dto: UpdateLoginDto) {
    return this.usersService.updateLogin(id, dto);
  }
}
