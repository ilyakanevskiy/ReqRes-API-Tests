const axios = require('axios');
const { assert } = require('chai');

const base_url = "https://reqres.in/api";
const endpoints = {
    "register_user": "/register",
    "get_user": "/users/{{id}}",
    "log_user_in": "/login"
};

describe('New user: positive scenarios', async function () {

    const user_props = {
        "first_name": "Eve",
        "last_name": "Holt"
    };

    const user = {
        "email": "eve.holt@reqres.in",
        "password": "pistol"
    };

    let user_result = {
        "id": null,
        "token": null
    };

    it('Should register user', async function () {

        const response = await axios.post(base_url + endpoints.register_user, user);

        assert.equal(response.status, 200);
        assert.isObject(response.data);

        const id = response.data.id;
        assert.isNumber(id);
        user_result.id = id;

        const token = response.data.token;
        assert.isString(token);
        assert.isNotEmpty(token);
        user_result.token = token;
    });

    it('Should get registered user', async function () {

        const response = await axios.get(base_url + endpoints.get_user.replace("{{id}}", user_result.id));

        assert.equal(response.status, 200);
        assert.isObject(response.data);

        const data = response.data.data;
        assert.isObject(data);

        assert.equal(data.id, user_result.id);
        assert.equal(data.email, user.email);
        assert.equal(data.first_name, user_props.first_name);
        assert.equal(data.last_name, user_props.last_name);
    });

    it('Should log registered user in', async function () {

        const response = await axios.post(base_url + endpoints.log_user_in, user);

        assert.equal(response.status, 200);
        assert.isObject(response.data);

        const token = response.data.token;
        assert.isString(token);
        assert.isNotEmpty(token);
    });
});

describe('New user: negative scenarios', async function () {

    it('Should not register user without a password', async function () {

        const user = {
            "email": "eve.holt@reqres.in"
        };

        const response = await axios.post(base_url + endpoints.register_user, user, {
            validateStatus: function (status) {
                return status < 500;
            }
        });

        assert.equal(response.status, 400);
        assert.isObject(response.data);

        const error = response.data.error;
        assert.isString(error);
        assert.isNotEmpty(error);
    });

    it('Should not get unknown user', async function () {

        const user_id = 146;

        const response = await axios.get(base_url + endpoints.get_user.replace("{{id}}", user_id), {
            validateStatus: function (status) {
                return status < 500;
            }
        });

        assert.equal(response.status, 404);
        assert.isObject(response.data);
        assert.isEmpty(response.data);
    });

    it('Should not log user in without an email', async function () {

        const user = {
            "password": "pistol"
        };

        const response = await axios.post(base_url + endpoints.register_user, user, {
            validateStatus: function (status) {
                return status < 500;
            }
        });

        assert.equal(response.status, 400);
        assert.isObject(response.data);

        const error = response.data.error;
        assert.isString(error);
        assert.isNotEmpty(error);
    });    
});