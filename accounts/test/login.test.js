const supertest = require('supertest');
const app       = require('../../app');
const db        = require('../../tests/db')

const request   = supertest(app);

beforeAll(async ()  => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async ()   => await db.close());

describe("Testing login API", () => {
    test("Testing an invalid login request", async () => {
        const test_data = {
            email    : "iqbal@test",
            password : "testpassw0rd"
        }
        const login      = await request.post('/accounts/login').send(test_data);
        expect(login.status).toBe(400);
        expect(login.body.result).toBe(false)
    })

    test("Testing an invalid user login", async () => {
        const test_data = {
            email    : "invalid@invalid.com",
            password : "testpassw0rd"
        }
        const login      = await request.post('/accounts/login').send(test_data);
        expect(login.status).toBe(400);
        expect(login.body.result).toBe(false)
        expect(login.body.message).toContain("not found")
    })

    test("Testing wrong password login", async () => {
        const s_test_data = {
            email    : "iqbal@test.com",
            password : "testpassw0rd"
        }
        const s_response        = await request.post('/accounts/signup').send(s_test_data);
        expect(s_response.status).toBe(200);
        
        const l_test_data = {
            email    : "iqbal@test.com",
            password : "wrongpassw0rd"
        }

        const login      = await request.post('/accounts/login').send(l_test_data);
        expect(login.status).toBe(400);
        expect(login.body.result).toBe(false)
        expect(login.body.message).toContain("doesn't match")
    })

    test("Testing login - email not verified", async () => {
        const test_data = {
            email    : "iqbal@test.com",
            password : "testpassw0rd"
        }
        const s_response        = await request.post('/accounts/signup').send(test_data);
        expect(s_response.status).toBe(200);
        const login      = await request.post('/accounts/login').send(test_data);
        expect(login.status).toBe(400);
        expect(login.body.result).toBe(false)
        expect(login.body.message).toContain("not verified")
    })

    test("Valid login test", async () => {
        const test_data = {
            email    : "iqbal@test.com",
            password : "testpassw0rd"
        }
        const s_response        = await request.post('/accounts/signup').send(test_data);
        expect(s_response.status).toBe(200);
        var uuid = s_response.body.uuid;
        const verify_response   = await request.post('/accounts/verify/'+uuid).send()
        expect(verify_response.body.result).toBe(true)
        const login      = await request.post('/accounts/login').send(test_data);
        expect(login.status).toBe(200);
        expect(login.body.result).toBe(true)
        expect(login.body.message).toContain("successfully")

    })
})