import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request'
import { UserResponseDto } from './dto/user-response.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto)
    return new UserResponseDto(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findOne(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.findOneByOrFail({ id: req.user.id })
    return new UserResponseDto(user)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(req.user.id, updateUserDto)
    return new UserResponseDto(user)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  async updatePassword(
    @Req() req: AuthenticatedRequest,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = await this.userService.updatePassword(
      req.user.id,
      updatePasswordDto,
    )
    return new UserResponseDto(user)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async remove(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.remove(req.user.id)
    return new UserResponseDto(user)
  }
}
