const supertest = require('supertest');
const app       = require('../../app');
const db        = require('../../tests/db')

const request   = supertest(app);

beforeAll(async ()  => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async ()   => await db.close());

describe("Testing verify email API", () => {
    test("Testing and invalid verify request", async () => {
        var   uuid        = "wronguuidtest";
        const response    = await request.post('/accounts/verify/'+uuid).send()
        expect(response.body.result).toBe(false)
        expect(response.body.message).toBe("Invalid URL")
    })

    test("Testing a valid verify request", async () => {
        const test_data = {
            email    : "iqbal@test.com",
            password : "testpassw0rd"
        }
        const s_response        = await request.post('/accounts/signup').send(test_data);
        expect(s_response.status).toBe(200);
        var uuid = s_response.body.uuid;
        const verify_response   = await request.post('/accounts/verify/'+uuid).send()
        expect(verify_response.body.result).toBe(true)
        expect(verify_response.body.message).toContain("verified")
    })
})