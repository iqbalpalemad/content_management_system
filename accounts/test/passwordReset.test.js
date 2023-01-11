const supertest = require('supertest');
const app       = require('../../app');
const db        = require('../../tests/db')

const request   = supertest(app);

beforeAll(async ()  => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async ()   => await db.close());

describe('Testing password reset API', () => {
    test("Testing un authorized password reset request", async () =>{
        const test_data = {
            id       : "6060a3d707daf00568d79726",
            password : "passw0rdd"
        }
        const response = await request.post('/accounts/passwordReset').send(test_data);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain("authorization failed")
    })


    test("Testing an invalid password reset request", async () =>{

        const test_data = {
            email    : "iqbal@test.com",
            password : "testpassw0rd"
        }
        const s_response        = await request.post('/accounts/signup').send(test_data);
        expect(s_response.status).toBe(200);
        var id = s_response.body.message;
        var uuid = s_response.body.uuid;
        const verify_response   = await request.post('/accounts/verify/'+uuid).send()
        expect(verify_response.body.result).toBe(true)
        const login      = await request.post('/accounts/login').send(test_data);
        expect(login.status).toBe(200);
        var jwt_token = login.body.token;

        const test_reset_data = {
            id       : id,
            password : "passw0rdd"
        }
        const response = await request.post('/accounts/passwordReset').set('Authorization', 'Basic dummy token').send(test_reset_data);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain("authorization failed")
    })


    test("Testing valid password reset request", async () =>{

        const test_data = {
            email    : "iqbal@test.com",
            password : "testpassw0rd"
        }
        const s_response        = await request.post('/accounts/signup').send(test_data);
        expect(s_response.status).toBe(200);
        var id = s_response.body.message;
        var uuid = s_response.body.uuid;
        const verify_response   = await request.post('/accounts/verify/'+uuid).send()
        expect(verify_response.body.result).toBe(true)
        const login      = await request.post('/accounts/login').send(test_data);
        expect(login.status).toBe(200);
        var jwt_token = login.body.token;

        const test_reset_data = {
            id       : id,
            password : "passw0rdd"
        }
        const response = await request.post('/accounts/passwordReset').set('Authorization', 'Basic ' + jwt_token).send(test_reset_data);
        expect(response.status).toBe(200);
    })



})