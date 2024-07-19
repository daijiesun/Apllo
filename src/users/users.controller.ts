import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, Query,UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto,CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { PageRequest, ResPonseOB } from 'src/utils/api.interface';
import { SearchDto } from './users.interface';
import { DateTransformInterceptor } from '../interceptor/date-transform.interceptor';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.register(registerUserDto);
  }

  // 分页查询
  @Post('list')
  @UseInterceptors(DateTransformInterceptor)
  findPage(@Body() body: PageRequest<SearchDto>){
    return this.usersService.findPage(body);
  }

  // 查所有
  @Get('list')
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

}
