import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
console.log("URI:", process.env.MONGODB_URI)

const DB_TYPE = process.env.DB_TYPE || 'mongodb';
let dbInstance = null;

export const connectDatabase = async () => {
  if (DB_TYPE === 'mongodb') {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      
      console.log(`MongoDB Terhubung: ${conn.connection.host}`);
      dbInstance = conn;
      return dbInstance;
    } catch (error) {
      console.error(`Error MongoDB: ${error.message}`);
      process.exit(1);
    }
  } 
  
  if (DB_TYPE === 'mysql' || DB_TYPE === 'postgres') {
    try {
      const dialect = DB_TYPE === 'postgres' ? 'postgres' : 'mysql';
      const uri = DB_TYPE === 'postgres' ? process.env.POSTGRES_URI : process.env.MYSQL_URI;

      dbInstance = new Sequelize(uri, {
        dialect: dialect,
        logging: false, 
      });

      await dbInstance.authenticate();
      console.log(`Database SQL (${DB_TYPE}) Terhubung.`);
      return dbInstance;
    } catch (error) {
      console.error(`Error SQL (${DB_TYPE}): ${error.message}`);
      process.exit(1);
    }
  }

  console.error(`Tipe DB_TYPE '${DB_TYPE}' tidak dikenal!`);
  process.exit(1);
};

export { dbInstance, DB_TYPE };
