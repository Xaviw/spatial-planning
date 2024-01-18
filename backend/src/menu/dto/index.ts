import {
  IsString,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsNotEmpty,
} from 'class-validator'

class BaseDto {
  @IsNotEmpty({ message: '请填写菜单名称！' })
  @IsString({ message: '菜单名称只能是字符串！' })
  @MaxLength(20, { message: '菜单名称需要小于20个字符！' })
  name: string

  @IsNotEmpty({ message: '请选择菜单状态!' })
  @IsBoolean({ message: '菜单状态只能是布尔值！' })
  status: boolean
}

export class CreateMenuDto extends BaseDto {
  @IsString({ message: '父级菜单id只能是字符串！' })
  @IsOptional()
  parentId?: string | null
}

export class UpdateMenuDto extends BaseDto {
  @IsNotEmpty({ message: '请传入id！' })
  @IsString({ message: 'id只能是字符串！' })
  id: string
}

export class MoveMenuDto {
  @IsNotEmpty({ message: '请传入id！' })
  @IsString({ message: 'id只能是字符串！' })
  id: string

  @IsNotEmpty({ message: '请传入当前序号！' })
  @IsNumber({}, { message: '序号只能是数字！' })
  currentIndex: number

  @IsString({ message: '父级菜单id只能是字符串！' })
  @IsOptional()
  currentParentId?: string | null
}
