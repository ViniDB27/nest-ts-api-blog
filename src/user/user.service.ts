import { ConflictException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { HashingService } from 'src/common/hashing/hashing.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existsEmail = await this.userRepository.exists({
      where: { email: createUserDto.email },
    })
    if (existsEmail) throw new ConflictException('E-mail já existe')
    const passwordHash = await this.hashingService.hash(createUserDto.password)
    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: passwordHash,
    })
    await this.userRepository.save(user)
    return user
  }

  findAll() {
    return `This action returns all user`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
