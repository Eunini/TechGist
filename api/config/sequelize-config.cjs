require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const {
  DB_NAME = 'techgist_db',
  DB_USER = 'postgres',
  DB_PASSWORD = '',
  DB_HOST = '127.0.0.1',
  DB_PORT = '5432',
  DATABASE_URL
} = process.env;

const dbConfig = {
  username: DB_USER,
  password: String(DB_PASSWORD || ''),
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
};

// Export configuration
module.exports = {
  development: dbConfig,
  test: { ...dbConfig, database: 'techgist_db_test' },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // required for Render Postgres
      },
    },
  },
};