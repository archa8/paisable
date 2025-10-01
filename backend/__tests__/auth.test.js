const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const User = require("../models/User");
const authRoutes = require("../routes/authRoutes");

let mongoServer;
let app;

beforeAll(async () => {
  process.env.JWT_SECRET = "test-jwt-secret";

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());
  app.use("/api/auth", authRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Auth API", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("User Signup", () => {
    it("should allow a new user to sign up", async () => {
      const newUser = {
        email: "testuser@gmail.com",
        password: "Password123!",
      };

      const response = await request(app).post("/api/auth/signup").send(newUser);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("token");

      const savedUser = await User.findOne({ email: "testuser@gmail.com" });
      expect(savedUser).not.toBeNull();
    });
  });

  describe("User Login", () => {
    const createTestUser = async () => {
      const testUser = {
        email: "testuser@gmail.com",
        password: "Password123!",
      };

      await request(app).post("/api/auth/signup").send(testUser);

      return testUser;
    };

    it("should successfully login with valid credentials", async () => {
      const testUser = await createTestUser();

      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("email", testUser.email);
      expect(response.body).toHaveProperty("_id");
    });

    it("should reject login with wrong password", async () => {
      const testUser = await createTestUser();

      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "WrongPassword123!",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
      expect(response.body.token).toBeUndefined();
    });

    it("should reject login with unregistered email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@gmail.com",
        password: "Password123!",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
      expect(response.body.token).toBeUndefined();
    });

    it("should reject login with missing credentials", async () => {
      const testCases = [{ password: "Password123!" }, { email: "test@gmail.com" }, { email: "", password: "" }];

      for (const credentials of testCases) {
        const response = await request(app).post("/api/auth/login").send(credentials);
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Invalid email or password");
        expect(response.body.token).toBeUndefined();
      }
    });
  });
});
