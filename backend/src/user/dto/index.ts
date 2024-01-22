import { IsNotEmpty, Matches } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: '请传入用户名' })
  @Matches(/^[\d\w_]{3,12}$/, {
    message: '用户名仅支持3-12位数字、字母、下划线',
  })
  name: string

  @IsNotEmpty({ message: '请传入密码' })
  @Matches(/^[\d\w]{6,16}$/, { message: '密码仅支持6-16位数字、字母' })
  password: string
}

export class UpdateUserDto extends CreateUserDto {
  @IsNotEmpty({ message: '请传入id' })
  id: string
}
