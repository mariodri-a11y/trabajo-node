import mongoose from "mongoose";
import { magenta, red } from "colorette";

//local imports
import { APP_NAME, DB_NAME, DB_STRING } from "./config";
import { createDatabase } from "./utils/utils";

const connection = mongoose.connection;

export async function connectDB() {
  try {
    await mongoose.connect(DB_STRING, {
      appName: APP_NAME,
      dbName: DB_NAME,
    });

    if (connection.db) {
      console.log(
        magenta(`MongoDB connected to database ${connection.db.databaseName}`)
      );
    } else {
      console.log(red("MongoDB connection established, but database is undefined."));
    }

    await createDatabase();
  } catch (error: any) {
    console.log(red(`Can't connect to the database: ${error.message}`));
  }
}