const supertest   = require('supertest');
const app         = require('../../app');
const db          = require('../../tests/db')
const signupLogin = require('../../tests/signupLogin')

const request   = supertest(app);

beforeAll(async ()  => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async ()   => await db.close());



describe('Testing update content API', () => {

    test("Testing a valid request", async () => {

        const c_data = {
            title       : "new test content"
        }
        const user = await signupLogin();
        const c_response = await request.post('/contents/create').set('Authorization', 'Basic '+user.token).send(c_data);
        expect(c_response.status).toBe(200);

        const u_data = {
            title       : "upate test content",
            body        : "update tes body"
        }

        const u_response = await request.post('/contents/'+c_response.body.message).set('Authorization', 'Basic '+user.token).send(u_data);
        expect(u_response.status).toBe(200);
        expect(u_response.body.result).toBe(true);

    })

})