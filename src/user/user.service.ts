import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { HashingService } from 'src/common/hashing/hashing.service'
import { UpdatePasswordDto } from './dto/update-password.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async save(user: User) {
    return this.userRepository.save(user)
  }

  async findOneByOrFail(userDara: Partial<User>) {
    const user = await this.userRepository.findOneBy(userDara)
    if (!user) throw new NotFoundException('Usuário não encontrado')
    return user
  }

  async failIfEmailExists(email: string) {
    const existsEmail = await this.userRepository.existsBy({ email })
    if (existsEmail) throw new ConflictException('E-mail já existe')
  }

  async create(createUserDto: CreateUserDto) {
    await this.failIfEmailExists(createUserDto.email)
    const passwordHash = await this.hashingService.hash(createUserDto.password)
    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: passwordHash,
    })
    await this.save(user)
    return user
  }

  findOneById(id: string) {
    return this.userRepository.findOne({ where: { id } })
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!updateUserDto.name && !updateUserDto.email)
      throw new BadRequestException('Dados não enviados')
    const user = await this.findOneByOrFail({ id })
    user.name = updateUserDto.name ?? user.name
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.failIfEmailExists(updateUserDto.email)
      user.email = updateUserDto.email ?? user.email
      user.forceLogout = true
    }
    return this.userRepository.save(user)
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findOneByOrFail({ id })
    const isCurrentPasswordValid = await this.hashingService.compare(
      updatePasswordDto.currentPassword,
      user.password,
    )
    if (!isCurrentPasswordValid)
      throw new UnauthorizedException('Senha atual inválida')
    user.password = await this.hashingService.hash(
      updatePasswordDto.newPassword,
    )
    user.forceLogout = true
    return this.userRepository.save(user)
  }

  async remove(id: string) {
    const user = await this.findOneByOrFail({ id })
    await this.userRepository.delete({ id })
    return user
  }
}
