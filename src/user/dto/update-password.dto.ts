import { IsNotEmpty, IsString } from 'class-validator'

export class UpdatePasswordDto {
  @IsString({ message: 'Senha precisa ser uma string' })
  @IsNotEmpty({ message: 'Senha não pode ser vazia' })
  currentPassword: string

  @IsString({ message: 'Nova senha precisa ser uma string' })
  @IsNotEmpty({ message: 'Nova senha não pode ser vazia' })
  newPassword: string
}
