import * as crypto from 'crypto'

export function md5(str: string) {
  const hash = crypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}

export function formatDateField<
  T extends { createTime: Date; updateTime?: Date },
>(list: T[]): Array<T & { createTime: string; updateTime?: string }> {
  return list.map(item => ({
    ...item,
    createTime: item.createTime.toLocaleString(),
    updateTime: item.updateTime?.toLocaleString(),
  }))
}
