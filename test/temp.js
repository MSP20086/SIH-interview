import request from "supertest";
import { expect } from "chai";
import { describe } from "mocha";

const server = "http://localhost:3000"; // Update if needed

describe("🔹 Signup API Tests", function () {
  before(function () {
    console.log(`Connecting to server at ${server}...`);
  });

  it("✅ Should successfully create a new user", async function () {
    console.log("Sending request to create a new user...");

    const res = await request(server).post("/api/auth/signup").send({
      name: "John Doe",
      email: "johndoe13@gmail.com",
      password: "password123",
      role: "Candidate",
    });

    console.log(
      "Request sent to /api/auth/signup. Response received:",
      res.body
    );

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal("Account created successfully");
    console.log("Successfully created a new user.");
  });

  it("❌ Should return error for existing user", async function () {
    console.log("Sending request to create an existing user...");

    const res = await request(server).post("/api/auth/signup").send({
      name: "Varun Sriram",
      email: "varunsriram10@gmail.com",
      password: "abcd@1234",
      role: "Candidate",
    });

    console.log(
      "Request sent to /api/auth/signup. Response received:",
      res.body
    );

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal("User already exists");
    console.log("Error: User already exists.");
  });

  it("❌ Should return error for weak password", async function () {
    console.log("Sending request with weak password...");

    const res = await request(server).post("/api/auth/signup").send({
      name: "Emily Clark",
      email: "emilyclark567@gmail.com",
      password: "123",
      role: "Candidate",
    });

    console.log(
      "Request sent to /api/auth/signup. Response received:",
      res.body
    );

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal("Password is too weak");
    console.log("Error: Password is too weak.");
  });

  it("❌ Should return error for invalid email format", async function () {
    console.log("Sending request with invalid email format...");

    const res = await request(server).post("/api/auth/signup").send({
      name: "Michael Smith",
      email: "michael.smith@.com",
      password: "mypass789",
      role: "Expert",
    });

    console.log(
      "Request sent to /api/auth/signup. Response received:",
      res.body
    );

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal("Invalid email format");
    console.log("Error: Invalid email format.");
  });

  after(function () {
    console.log(`Tests completed. All requests processed to ${server}`);
  });
});
