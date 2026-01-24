const request = require("supertest");

const server = "https://sih2024-seven.vercel.app";

describe("🔹 Signup API Tests", () => {
  jest.setTimeout(10000);

  test("✅ Should successfully create a new user", async () => {
    const res = await request(server).post("/api/auth/signup").send({
      name: "John Doe",
      email: "john1doe1113@gmail.com",
      role: "Candidate",
    });

    expect(res.status).toBe(200);
    console.log("✅ Passed: User created successfully");
  });

  jest.setTimeout(10000);
  test("❌ Should return error for existing user", async () => {
    const res = await request(server).post("/api/auth/signup").send({
      name: "Tanay Gada",
      email: "tanaygada14@gmail.com",
      password: "abcd@1234",
      role: "Candidate",
    });

    expect(res.status).toBe(400);
    if (res.status === 400) {
      console.log("✅ Passed: User already exists error handled");
    } else {
      console.error("❌ Failed: Expected status 400 and error message");
      console.error("Actual status:", res.status);
    }
  });

  jest.setTimeout(10000);
  test("❌ Should return error for weak password", async () => {
    const res = await request(server).post("/api/auth/signup").send({
      name: "Emily Clark",
      email: "emilyclark567@gmail.com",
      password: "123",
      role: "Candidate",
    });

    expect(res.status).toBe(400);
    if (res.status === 400) {
      console.log("✅ Passed: Weak password error handled");
      console.log("Status:", res.status);
    } else {
      console.error("❌ Failed: Expected status 400 and error message");
      console.error("Actual status:", res.status);
    }
  });

  jest.setTimeout(10000);
  test("❌ Should return error for invalid email format", async () => {
    const res = await request(server).post("/api/auth/signup").send({
      name: "Michael Smith",
      email: "michael.smith@gmail.com",
      password: "mypass789",
      role: "Expert",
    });

    expect(res.status).toBe(400);
    if (res.status === 400) {
      console.log("✅ Passed: Invalid email format error handled");
    } else {
      console.error("❌ Failed: Expected status 400 and error message");
      console.error("Actual status:", res.status);
    }
  });
});
