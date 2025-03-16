import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    return res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Failed to retrieve users" });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.select().from(users).where(eq(users.id, id));
    
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    return res.status(200).json(user[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Failed to retrieve user" });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    
    const newUser = await db.insert(users).values({
      name,
      email
    }).returning();
    
    return res.status(201).json(newUser[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.message.includes("duplicate key value violates unique constraint")) {
      return res.status(409).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Failed to create user" });
  }
};

// Update an existing user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    if (!name && !email) {
      return res.status(400).json({ error: "Provide at least one field to update" });
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    const updatedUser = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    
    if (updatedUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    return res.status(200).json(updatedUser[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.message.includes("duplicate key value violates unique constraint")) {
      return res.status(409).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedUser = await db.delete(users)
      .where(eq(users.id, id))
      .returning();
    
    if (deletedUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
};