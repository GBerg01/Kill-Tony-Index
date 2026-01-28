import { Pool } from "pg";

export const createDbPool = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  return new Pool({ connectionString: databaseUrl });
};
