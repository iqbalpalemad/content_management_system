const supertest   = require('supertest');
const app         = require('../../app');
const db          = require('../../tests/db')
const signupLogin = require('../../tests/signupLogin')

const request   = supertest(app);

beforeAll(async ()  => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async ()   => await db.close());


describe('Testing create content API', () => {

    test("Testing an authorized request", async () => {
        const user = await signupLogin();
        
        const test_data = {
            id       : user.id,
            password : "passw0rdd"
        }

        const response = await request.post('/contents/create').set('Authorization', 'Basic dummy_auth').send(test_data);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain("authorization failed")
        
    })


    test("Testing an invalid request", async () => {
        const user = await signupLogin();
        
        const test_data = {
            id       : user.id,
            password : "passw0rdd"
        }

        const response = await request.post('/contents/create').set('Authorization', 'Basic '+user.token).send(test_data);
        expect(response.status).toBe(400);
        expect(response.body.result).toBe(false);
        
    })


    test("Testing a valid request", async () => {
        const user = await signupLogin();
        
        const test_data = {
            title       : "new test content"
        }

        const response = await request.post('/contents/create').set('Authorization', 'Basic '+user.token).send(test_data);
        expect(response.status).toBe(200);
        expect(response.body.result).toBe(true);
        
    })

})