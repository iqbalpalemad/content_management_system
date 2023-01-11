const supertest = require('supertest');
const app       = require('../../app');
const db        = require('../../tests/db')

const request   = supertest(app);

beforeAll(async ()  => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async ()   => await db.close());

describe("Testing forgot password API", () => {
    test("Testing and invalid forgot password request", async () => {
        const test_data = {
            email    : "iqbal@test."
        }

        const response = await request.post('/accounts/forgotPassword').send(test_data);
        expect(response.status).toBe(400);
        expect(response.body.result).toBe(false);
    })

    test("Testing  valid password request", async () => {
        const test_data = {
            email    : "iqbal@nethram.com"
        }

        const response = await request.post('/accounts/forgotPassword').send(test_data);
        expect(response.status).toBe(400);
        expect(response.body.result).toBe(false);
    })

})