import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import request from "supertest";
import { setPrisma } from "../lib/prisma";
import app from "../app";

let container: StartedPostgreSqlContainer;
let prisma: PrismaClient;

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:16-alpine").start();

  const databaseUrl = container.getConnectionUri();

  // Push schema to test database
  execSync("npx prisma db push --skip-generate", {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    cwd: __dirname + "/../..",
  });

  prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
  setPrisma(prisma);
}, 60_000);

afterAll(async () => {
  await prisma?.$disconnect();
  await container?.stop();
});

beforeEach(async () => {
  await prisma.user.deleteMany();
});

describe("Users API Integration", () => {
  const alice = { name: "Alice", email: "alice@example.com" };
  const bob = { name: "Bob", email: "bob@example.com" };

  it("POST /api/users — creates a user", async () => {
    const res = await request(app).post("/api/users").send(alice);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(alice);
    expect(res.body.id).toBeDefined();
  });

  it("POST /api/users — returns 400 when name missing", async () => {
    const res = await request(app).post("/api/users").send({ email: "a@b.com" });
    expect(res.status).toBe(400);
  });

  it("POST /api/users — returns 409 on duplicate email", async () => {
    await request(app).post("/api/users").send(alice);
    const res = await request(app).post("/api/users").send({ name: "Alice2", email: alice.email });
    expect(res.status).toBe(409);
  });

  it("GET /api/users — lists users", async () => {
    await request(app).post("/api/users").send(alice);
    await request(app).post("/api/users").send(bob);
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("GET /api/users?name= — filters by name", async () => {
    await request(app).post("/api/users").send(alice);
    await request(app).post("/api/users").send(bob);
    const res = await request(app).get("/api/users").query({ name: "ali" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("Alice");
  });

  it("GET /api/users/:id — returns a user", async () => {
    const created = await request(app).post("/api/users").send(alice);
    const res = await request(app).get(`/api/users/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(alice);
  });

  it("GET /api/users/:id — returns 404 for non-existent user", async () => {
    const res = await request(app).get("/api/users/99999");
    expect(res.status).toBe(404);
  });

  it("PUT /api/users/:id — updates a user", async () => {
    const created = await request(app).post("/api/users").send(alice);
    const res = await request(app)
      .put(`/api/users/${created.body.id}`)
      .send({ name: "Alice Smith" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Alice Smith");
    expect(res.body.email).toBe(alice.email);
  });

  it("PUT /api/users/:id — returns 404 for non-existent user", async () => {
    const res = await request(app).put("/api/users/99999").send({ name: "Ghost" });
    expect(res.status).toBe(404);
  });

  it("DELETE /api/users/:id — deletes a user", async () => {
    const created = await request(app).post("/api/users").send(alice);
    const deleteRes = await request(app).delete(`/api/users/${created.body.id}`);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/api/users/${created.body.id}`);
    expect(getRes.status).toBe(404);
  });

  it("DELETE /api/users/:id — returns 404 for non-existent user", async () => {
    const res = await request(app).delete("/api/users/99999");
    expect(res.status).toBe(404);
  });
});
