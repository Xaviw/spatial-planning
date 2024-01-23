import { PrismaClient } from '@prisma/client'
import { md5 } from '../src/utils'

const prisma = new PrismaClient({ log: [{ emit: 'stdout', level: 'query' }] })

async function seed() {
  try {
    // 默认账户
    await prisma.user.create({
      data: { name: 'admin', password: md5('123456') },
    })
  } catch (error) {
    console.log(error)
  }
}

seed().catch(error => console.error(error))
