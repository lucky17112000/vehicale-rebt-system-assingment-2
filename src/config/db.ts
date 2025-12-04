import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDb = async () => {
  await pool.query(`
    
    CREATE TABLE IF NOT EXISTS Users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    CHECK (email = LOWER(email)),
    password TEXT NOT NULL CHECK (char_length(password)>=6),
    phone varchar(20) NOT NULL,
    role varchar(20) NOT NULL CHECK (role IN ('admin' , 'customer')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    
    
    )`);
};

export default initDb;
