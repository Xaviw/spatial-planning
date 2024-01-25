import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'
import { UpdateOperationDto } from '../../sider/dto'

export class UpdateMapDto {
  @IsArray({ message: '修改操作应该是一个对象数组！' })
  @ValidateNested({ each: true })
  @Type(() => UpdateOperationDto)
  layers: UpdateOperationDto[]

  @IsArray({ message: '修改操作应该是一个对象数组！' })
  @ValidateNested({ each: true })
  @Type(() => UpdateOperationDto)
  overlays: UpdateOperationDto[]

  @IsArray({ message: '修改操作应该是一个对象数组！' })
  @ValidateNested({ each: true })
  @Type(() => UpdateOperationDto)
  materials: UpdateOperationDto[]
}
