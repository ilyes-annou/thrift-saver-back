const test = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const router = require("./controller");

const app = express();
app.set("port", 3080);

const baseUrl = "http://localhost:3080";
const request = test(baseUrl);


beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/thrift-saver-db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
});
  
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe("Spending Service Endpoints", () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    const userResponse = await request.post("/user/").send({
      email: "testSpending@example.com",
      password: "testpassword",
    }); 

    const loginResponse = await request.post("/login").send({
      email: "testSpending@example.com",
      password: "testpassword",
    });

    authToken = loginResponse.body.token;
    userId = loginResponse.body.id;
  });

  it("create new spending", async () => {
    const response = await request
      .post("/spending/")
      .set("Authorization", authToken)
      .send({
        description: "Test spending",
        price :200,
        date : "2024-01-10",
        category: "essential"

      })
      .expect(201);

    expect(response.body.description).toBe("Test spending");
    expect(response.body.price).toBe(200);
  });

  it("create empty spending", async () => {
    const response = await request
      .post("/spending/")
      .set("Authorization", authToken)
      .expect(400);

    expect(response.body.description).toBe("Test spending");
    expect(response.body.price).toBe(200);
  });

  it("get all spendings", async () => {
    await request
      .post("/spending/")
      .set("Authorization", authToken)
      .send({ description: "Spending 1", price: 100, date: "2024-01-01", category: "essential" });

    await request
      .post("/spending/")
      .set("Authorization", authToken)
      .send({ description: "Spending 2", price: 200, date: "2024-01-02", category: "essential" });

    const response = await request
      .get("/spending/")
      .set("Authorization", authToken)
      .expect(200);

    expect(response.body.length).toBe(3);
  });

});
