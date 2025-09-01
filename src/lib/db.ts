import mysql from "mysql2/promise";

export async function getDBConnection() {
  const connection = await mysql.createConnection({
    host: import.meta.env.VITE_DB_HOST,      
    user: import.meta.env.VITE_DB_USER,      
    password: import.meta.env.VITE_DB_PASSWORD,  
    database: import.meta.env.VITE_DB_NAME,   // 👈 added
  });
  return connection;
}
