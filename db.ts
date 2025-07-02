import {Pool} from 'pg';

const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },  
});

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined, 
// });

pool.on('connect', () => {
  console.log('Connected to the database');
});

export default pool;
