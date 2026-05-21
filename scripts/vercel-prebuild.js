const { Pool } = require('pg');

async function main() {
  console.log("Running Vercel pre-build data migration...");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log("Casting posts.published_at to TIMESTAMP(3)...");
    await pool.query(`ALTER TABLE "posts" ALTER COLUMN "published_at" TYPE TIMESTAMP(3) USING "published_at"::timestamp(3)`);
    console.log("✅ Success");
  } catch(e) {
    console.log("ℹ️ Skipped: ", e.message.substring(0, 100));
  }
  
  try {
    console.log("Casting posts.is_featured to BOOLEAN...");
    await pool.query(`
      ALTER TABLE "posts" ALTER COLUMN "is_featured" DROP DEFAULT;
      ALTER TABLE "posts" ALTER COLUMN "is_featured" TYPE BOOLEAN USING CASE WHEN "is_featured" = 1 THEN true ELSE false END;
      ALTER TABLE "posts" ALTER COLUMN "is_featured" SET DEFAULT false;
    `);
    console.log("✅ Success");
  } catch(e) {
    console.log("ℹ️ Skipped: ", e.message.substring(0, 100));
  }

  try {
    console.log("Casting messages.read to BOOLEAN...");
    await pool.query(`
      ALTER TABLE "messages" ALTER COLUMN "read" DROP DEFAULT;
      ALTER TABLE "messages" ALTER COLUMN "read" TYPE BOOLEAN USING CASE WHEN "read" = 1 THEN true ELSE false END;
      ALTER TABLE "messages" ALTER COLUMN "read" SET DEFAULT false;
    `);
    console.log("✅ Success");
  } catch(e) {
    console.log("ℹ️ Skipped: ", e.message.substring(0, 100));
  }

  await pool.end();
}

main().catch(console.error);
