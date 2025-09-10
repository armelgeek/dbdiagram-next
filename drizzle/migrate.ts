import path from 'path';

import dotenv from 'dotenv';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { client, db } from '@/drizzle/db';

dotenv.config();

async function main() {
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), '/drizzle/migrations'),
  });
  console.log(`Migrations complete`);
  await client.end();
}

main();
