const supertest   = require('supertest');
const app         = require('../../app');
const db          = require('../../tests/db')
const signupLogin = require('../../tests/signupLogin')

const request   = supertest(app);

beforeAll(async ()  => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async ()   => await db.close());


describe('Testing get content API', () => {

    test("Testing a valid request", async () => {

        const user = await signupLogin();
        
        const c_data = {
            title       : "new test content"
        }

        const c_response = await request.post('/contents/create').set('Authorization', 'Basic '+user.token).send(c_data);
        expect(c_response.status).toBe(200);


        const g_response = await request.get('/contents/'+ c_response.body.message).set('Authorization', 'Basic '+user.token).send();
        expect(g_response.status).toBe(200);
        expect(g_response.body.result).toBe(true);
        const d_response = await request.delete('/contents/'+ c_response.body.message).set('Authorization', 'Basic '+user.token).send();
        expect(d_response.status).toBe(200);
        expect(d_response.body.result).toBe(true);
        const g_g_response = await request.get('/contents/'+ c_response.body.message).set('Authorization', 'Basic '+user.token).send();
        expect(g_g_response.status).toBe(400);
        expect(g_g_response.body.result).toBe(false);


    })
})