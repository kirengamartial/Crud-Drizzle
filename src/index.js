import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Node.js API with PostgreSQL and Drizzle ORM");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});