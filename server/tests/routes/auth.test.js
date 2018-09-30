const request = require("supertest");

const { app } = require("../../index");
const User = require("mongoose").model("User");

describe("auth routes", () => {
  describe("register", () => {
    const endpoint = "/api/auth/register";

    it("handles valid registration", async () => {
      const body = { email: "test1@test.com", password: "random123" };
      const res = await request(app)
        .post(endpoint)
        .send(body)
        .expect(200);

      expect(await User.findOne({ email: body.email })).toBeTruthy();
      expect(res.body.payload.token).toBeTruthy();
    });

    it("handles duplicate emails", async () => {
      const body = { email: testUserCredentials.email, password: "random123" };
      const res = await request(app)
        .post(endpoint)
        .send(body)
        .expect(403);

      expect(await User.countDocuments({ email: body.email })).toEqual(1);
    });
  });

  describe("login", () => {
    const endpoint = "/api/auth";

    it("handles valid login", async () => {
      const body = {
        email: testUserCredentials.email,
        password: testUserCredentials.password
      };
      const res = await request(app)
        .post(endpoint)
        .send(body)
        .expect(200);

      expect(res.body.payload.token).toBeTruthy();
    });

    it("handles wrong password", async () => {
      const body = {
        email: testUserCredentials.email,
        password: "wrongpassword"
      };
      const res = await request(app)
        .post(endpoint)
        .send(body)
        .expect(401);
    });

    it("handles wrong email", async () => {
      const body = {
        email: "userdoesntexist@test.com",
        password: "123456"
      };
      const res = await request(app)
        .post(endpoint)
        .send(body)
        .expect(401);
    });
  });

  describe("refreshSession", () => {
    const endpoint = "/api/auth";

    it("sends user data w/ new token when supplied with valid token", async () => {
      const res = await request(app)
        .get(endpoint)
        .set("Authorization", testToken)
        .expect(200);

      expect(res.body.payload.token).toBeTruthy();
    });

    it("401 when no token is supplied", async () => {
      const res = await request(app)
        .get(endpoint)
        .expect(401);
    });
  });
});
