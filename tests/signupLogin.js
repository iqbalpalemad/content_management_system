const supertest = require('supertest');
const app       = require('../app');
const db        = require('./db')

const request   = supertest(app);

beforeAll(async ()  => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async ()   => await db.close());

const signupLogin = async () => {
    const test_data = {
        email    : "iqbal@test.com",
        password : "testpassw0rd"
    }
    const s_response        = await request.post('/accounts/signup').send(test_data);
    var id                  = s_response.body.message;
    var uuid                = s_response.body.uuid;
    const verify_response   = await request.post('/accounts/verify/'+uuid).send()
    const login             = await request.post('/accounts/login').send(test_data);
    var jwt_token = login.body.token;
    return {id : id, token : jwt_token}
    
}

module.exports = signupLogin;