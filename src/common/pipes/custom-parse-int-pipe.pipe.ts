import { BadRequestException, ParseIntPipe } from '@nestjs/common'

export class CustomParseIntPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory() {
        return new BadRequestException('precisa ser um numero válido')
      },
    })
  }
}
