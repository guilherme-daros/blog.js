const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const dataPath = path.join(__dirname, '..', 'prisma', 'db_export.json');
  if (!fs.existsSync(dataPath)) {
    console.error('db_export.json not found');
    return;
  }

  const rawData = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(rawData);

  // We should probably delete existing data first
  await prisma.post.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.message.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.user.deleteMany();

  console.log('Inserting users...');
  if (data.users) {
    for (const user of data.users) {
      await prisma.user.create({ data: {
        id: user.id,
        username: user.username,
        password_hash: user.password_hash,
        role: user.role,
        created_at: new Date(user.created_at)
      }});
    }
  }

  console.log('Inserting posts...');
  if (data.posts) {
    for (const post of data.posts) {
      await prisma.post.create({ data: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        tag: post.tag,
        read_time: post.read_time,
        reads: post.reads,
        reads_trend: post.reads_trend,
        published_at: new Date(post.published_at),
        is_featured: post.is_featured === 1 || post.is_featured === true,
      }});
    }
  }

  console.log('Inserting subscribers...');
  if (data.subscribers) {
    for (const sub of data.subscribers) {
      await prisma.subscriber.create({ data: {
        id: sub.id,
        email: sub.email,
        subscribed_at: new Date(sub.subscribed_at)
      }});
    }
  }

  console.log('Inserting messages...');
  if (data.messages) {
    for (const msg of data.messages) {
      await prisma.message.create({ data: {
        id: msg.id,
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        body: msg.body,
        read: msg.read,
        created_at: new Date(msg.created_at)
      }});
    }
  }

  console.log('Inserting social_links...');
  if (data.social_links) {
    for (const link of data.social_links) {
      await prisma.socialLink.create({ data: {
        id: link.id,
        platform: link.platform,
        url: link.url,
        handle: link.handle,
        sort_order: link.sort_order
      }});
    }
  }

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
