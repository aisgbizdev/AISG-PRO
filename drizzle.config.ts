/** Drizzle Config - compatible with drizzle-kit 0.19.x **/
export default {
  schema: "./shared/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL
  }
};
