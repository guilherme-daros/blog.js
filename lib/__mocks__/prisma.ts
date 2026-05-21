import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended'
import prisma from '../prisma'

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
