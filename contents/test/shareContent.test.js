const supertest   = require('supertest');
const app         = require('../../app');
const db          = require('../../tests/db')
const signupLogin = require('../../tests/signupLogin')

const request   = supertest(app);

beforeAll(async ()  => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async ()   => await db.close());


describe('Testing share content API', () => {
    test("Testing a valid request", async () => {
        const user = await signupLogin();
        
        const c_data = {
            title       : "new test content"
        }

        const c_response = await request.post('/contents/create').set('Authorization', 'Basic '+user.token).send(c_data);
        expect(c_response.status).toBe(200);

        const s_data = {
            sharedWith       : "test",
            permissions      : ["Read"]
        }

        const s_response = await request.post('/contents/'+ c_response.body.message+ "/share").set('Authorization', 'Basic '+user.token).send(s_data);
        expect(s_response.status).toBe(200);
        expect(s_response.body.result).toBe(true);

    })
})