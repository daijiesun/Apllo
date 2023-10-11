import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto,CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { PageRequest, ResPonseOB } from 'src/utils/api.interface';
import { SearchDto } from './users.interface';

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

  @Post('create')
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  // 分页查询
  @Post('list')
  findPage(@Body() body: PageRequest<SearchDto>){
    return this.usersService.findPage(body);
  }

  // 查所有
  @Get('list')
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

  @Delete('')
  @Roles('admin')
  batchRemove(@Query('ids') ids: string) {
    let idList = ids.split(',')
    return this.usersService.batchRemove(idList);
  }
}
