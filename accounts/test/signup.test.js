const supertest = require('supertest');
const app       = require('../../app');
const db        = require('../../tests/db')

const request   = supertest(app);

beforeAll(async ()  => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async ()   => await db.close());

describe('Testing signup API', () => {
    test("Testing an invalid signup request", async () => {
        const test_data = {
            email    : "iqbal@test.",
            password : "testpassw0rd"
        }
        const response = await request.post('/accounts/signup').send(test_data);
        expect(response.status).toBe(400);
        expect(response.body.result).toBe(false);
    })

    test("Testing a valid signup request", async () =>{
        const test_data = {
            email    : "iqbal@test.com",
            password : "testpassw0rd"
        }
        const response = await request.post('/accounts/signup').send(test_data);
        expect(response.status).toBe(200);
        expect(response.body.result).toBe(true);
    })


    test("Testing for duplicate signup", async () =>{
        const test_data = {
            email    : "iqbal@test.com",
            password : "testpassw0rd"
        }
        const response        = await request.post('/accounts/signup').send(test_data);
        const second_response = await request.post('/accounts/signup').send(test_data);
        expect(second_response.status).toBe(400);
        expect(second_response.body.result).toBe(false);
        expect(second_response.body.message).toContain("already")
    })

    
})

