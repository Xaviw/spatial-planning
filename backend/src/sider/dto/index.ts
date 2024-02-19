import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

enum Op {
  add = 'add',
  replace = 'replace',
  remove = 'remove',
}

export class UpdateOperationDto {
  @IsEnum(Op, { message: 'op错误' })
  @IsNotEmpty({ message: '缺少op' })
  op: 'add' | 'replace' | 'remove'

  @IsOptional()
  @IsString({ message: 'id应该是数组' })
  id?: string

  @IsOptional()
  @IsObject()
  value: Record<string, any>
}

export class UpdateSiderDto {
  @IsArray({ message: '修改操作应该是一个对象数组！' })
  @ValidateNested({ each: true })
  @Type(() => UpdateOperationDto)
  siders: UpdateOperationDto[]
}
