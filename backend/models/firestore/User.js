import { db } from "../../config/firestore.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// User model for Firestore
class User {
  // Create a new user
  static async createUser(userData) {
    try {
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Prepare user data for Firestore
      const user = {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        petName: userData.petName || "My Pet",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add user to Firestore
      const userRef = await db.collection("users").add(user);
      
      // Return user with ID
      return { id: userRef.id, ...user };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const usersQuery = db.collection("users").where("email", "==", email);
      const usersSnapshot = await usersQuery.get();

      if (usersSnapshot.empty) {
        return null;
      }

      // Return the first user (should be only one)
      const userDoc = usersSnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  // Validate password
  static async validatePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Error validating password: ${error.message}`);
    }
  }

  // Generate JWT token
  static generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const secret = process.env.JWT_SECRET || "pet_feeder_secret_key";
    const options = {
      expiresIn: "7d",
    };

    return jwt.sign(payload, secret, options);
  }

  // Get user by ID
  static async findById(userId) {
    try {
      const userDoc = await db.collection("users").doc(userId).get();

      if (!userDoc.exists) {
        return null;
      }

      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }
}

export default User;