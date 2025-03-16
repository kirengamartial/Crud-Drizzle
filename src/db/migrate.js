import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index.js";

// Run migrations
console.log("Running migrations...");
try {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations completed successfully!");
} catch (error) {
  console.error("Migration failed:", error);
} finally {
  process.exit(0);
}