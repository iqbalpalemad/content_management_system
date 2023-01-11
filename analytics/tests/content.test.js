const supertest   = require('supertest');
const app         = require('../../app');
const db          = require('../../tests/db')
const signupLogin = require('../../tests/signupLogin')

const request   = supertest(app);

beforeAll(async ()  => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async ()   => await db.close());



describe('Testing analytics content API', () => {

    test("Testing a valid request", async () => {
        const user = await signupLogin();
        c_data     = {
            startTime : "2021-03-26T16:22:18.918+00:00",
            endTime   : "2021-03-29T16:22:18.918+00:00",
            id        : user.message
        }
        const c_response = await request.post('/analytics').set('Authorization', 'Basic '+user.token).send(c_data);
        expect(c_response.status).toBe(200);
        expect(c_response.body.result).toBe(true);
    })
})