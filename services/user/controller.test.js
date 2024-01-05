const test = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const router = require("./controller");
const { ObjectId } = require("mongodb");

const app = express();
app.set('port', 3080);

const baseUrl = "http://localhost:3080";
const request = test(baseUrl);

const testUser = {
  email: "test@example.com",
  password: "testpassword",
};

const updatedUserData = {
  email: "test2@example.com"
};

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

/*beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});*/

describe("User API Endpoints", () => {
  let token; // To store the authentication token
  let userId;

  it("create empty user", async () => {

    const requestTest = request.post("/user");
    const response = await requestTest.expect(400);
    
  });

  it("create new user", async () => {

    const requestTest = request.post("/user").send(testUser);
    const response = await requestTest.expect(201);
    expect(response.body.email).toBe(testUser.email);
  });

  it("create same user", async () => {

    const requestTest = request.post("/user").send(testUser);
    const response = await requestTest.expect(403);
    
  });

  

  it("login", async () => {
    const response = await request.post("/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    token = response.body.token; 
    userId=response.body.id;
    expect(token).toBeTruthy();
  });


  it("login no info", async () => {
    const response = await request.post("/login")
      .send({
        email: "",
        password: "",
      })
      .expect(400);
  });

  it("get empty spendings", async () => {
    const response = await request.get("/user/"+userId+"/spending")
      .set("Authorization", token)
      .set("id",userId)
      console.log(response)
      expect(response.text).toBe("[]");
  });

  it("update user", async () => {
    const updateUserResponse = await request.put("/user/"+userId)
      .set("Authorization", token)
      .send(updatedUserData)
      .expect(200);

    expect(updateUserResponse.body.email).toBe(updatedUserData.email);
    //expect(updateUserResponse.body.password).toBeUndefined();
  });

  it("update nonexistant user", async () => {
    const idNull= new ObjectId(0);
    const updateUserResponse = await request.put("/user/"+idNull)
      .set("Authorization", token)
      .send({ email: "nonexistant@example.com", password: "password1" })
      .expect(404);

  });


  

  it("get all users", async () => {
    await request.post("/user/").send({ email: "user1@example.com", password: "password1" });
    await request.post("/user/").send({ email: "user2@example.com", password: "password2" });

    const response = await request.get("/user/").expect(200);

    expect(response.body.length).toBe(3);
  });

  // Add more tests for other endpoints as needed
});