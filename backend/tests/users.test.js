const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

describe("AUTH: /api/users", () => {
    const payload = {
        name: "Jane Doe",
        username: "auth_user",
        password: "Passw0rd!23",
        phone_number: "+358401234567",
        gender: "female",
        date_of_birth: "1995-05-20",
        role: "user",
        address: {
            street: "123 Main St",
            city: "Helsinki",
            state: "Uusimaa",
            zipCode: "00100",
        },
        profilePicture: "https://example.com/avatar.jpg",
    };

    it("signup: returns 201 with token", async () => {
        const res = await api.post("/api/users/signup").send(payload).expect(201);
        expect(res.body).toHaveProperty("token");
        expect(res.body.username).toBe(payload.username);
    });

    it("signup: duplicate username -> 400", async () => {
        await api.post("/api/users/signup").send(payload);
        const res = await api.post("/api/users/signup").send(payload).expect(400);
        expect(res.body).toHaveProperty("message");
    });

    it("login: success -> 200 with token", async () => {
        await api.post("/api/users/signup").send(payload); // ensure exists
        const res = await api
            .post("/api/users/login")
            .send({ username: payload.username, password: payload.password })
            .expect(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body.username).toBe(payload.username);
    });

    it("login: invalid credentials -> 400", async () => {
        const res = await api
            .post("/api/users/login")
            .send({ username: "nope", password: "wrong" })
            .expect(400);
        expect(res.body).toHaveProperty("message");
    });
});


