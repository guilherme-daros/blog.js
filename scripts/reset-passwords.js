const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function resetPasswords() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    const newHash = await bcrypt.hash(user.username, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: newHash }
    });
    console.log(`Reset password for ${user.username} (password is same as username)`);
  }
}

resetPasswords()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
