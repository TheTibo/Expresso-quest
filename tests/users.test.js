const request = require("supertest");

const app = require("../src/app");
const database = require("../database");

const crypto = require("node:crypto");
const exp = require("node:constants");
afterAll(() => database.end());

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});

describe("POST /api/users", () => {
  it("should return one user", async () => {
    const newUser = {
      firstname: "Marie",

      lastname: "Martin",

      email: `${crypto.randomUUID()}@wild.co`,

      city: "Paris",

      language: "French",
    };
    const response = await request(app).post("/api/users").send(newUser);
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");
    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );
    const [userInDatabase] = result;
    expect(userInDatabase).toHaveProperty("id");
    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.firstname).toStrictEqual(newUser.firstname);
  });
  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "AXO" };

    const response = await request(app)
      .post("/api/users")

      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });
});

describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUser = {
      firstname: "AxoGomarr",

      lastname: "Gang",

      email: `${crypto.randomUUID()}@wild.co`,

      city: "Wild",

      language: "CSS",
    };
    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );
    const id = result.insertId;

    const updatedUser = {
      firstname: "AxoGomarr111111111",

      lastname: "Gang1111111111111",

      email: `${crypto.randomUUID()}@wild.co`,

      city: "Wild111111111111111",

      language: "CSS1111111111111111",
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);
    expect(response.status).toEqual(204);
    const [users] = await database.query("SELECT * FROM users WHERE id=?", id);

    const [userInDatabase] = users;
    expect(userInDatabase).toHaveProperty("id");
    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(updatedUser.firstname);

    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.lastname).toStrictEqual(updatedUser.lastname);

    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase.email).toStrictEqual(updatedUser.email);

    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase.city).toStrictEqual(updatedUser.city);

    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.language).toStrictEqual(updatedUser.language);
  });
  it("shoud return an error", async () => {
    const userWithMissingProps = { firstname: " Tibo" };
    const response = await request(app)
      .put(`/api/movies/1`)
      .send(userWithMissingProps);
    expect(response.status).toEqual(422);
  });

  it("should return no user", async () => {
    const newUser = {
      firstname: "121212AxoGomarr111111111",

      lastname: "11111Gang1111111111111",

      email: `${crypto.randomUUID()}@wild.co`,

      city: "111111Wild111111111111111",

      language: "11111CSS1111111111111111",
    };

    const response = await request(app).put("/api/users/0").send(newUser);
    expect(response.status).toEqual(404);
  });
});

describe("DELETE /api/users", () => {
  it("should delete a user", async () => {
    const newUser = {
      firstname: "121212AxoGomarr111111111",

      lastname: "11111Gang1111111111111",

      email: `${crypto.randomUUID()}@wild.co`,

      city: "111111Wild111111111111111",

      language: "11111CSS1111111111111111",
    };

    const response = await request(app).post("/api/users/0").send(newUser);
    expect(response.body).toHaveProperty("id");
    const { id } = response.body;
    const deleteResponse = await request(app).delete(`/api/users/${id}`);
    expect(deleteResponse.status).toEqual(204);
    expect(typeof response.body.id).toBe("Number");
    const [] = await database.query("SELECT * FROM users WHERE id=?", id);
  });
  it("should return an error", async () => {
    const response = await request(app).delete("/api/users/121212");
    expect(response.status).toEqual(404);
  });
});
