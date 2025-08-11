import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { Umzug, SequelizeStorage } from 'umzug';
import sequelize from './config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const umzug = new Umzug({
  migrations: { glob: path.join(__dirname, 'migrations', '*.js') },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeMeta' }),
  logger: console,
});

async function run() {
  try {
    await sequelize.authenticate();
    console.log('[migrate] DB connected');
    await umzug.up();
    console.log('[migrate] All migrations executed');
    process.exit(0);
  } catch (e) {
    console.error('[migrate][error]', e);
    process.exit(1);
  }
}

run();
