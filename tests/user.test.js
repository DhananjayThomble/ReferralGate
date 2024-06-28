const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

// beforeAll(async () => {
//     await mongoose.connect(process.env.TEST_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// });

// Clear database after each test
afterEach(async () => {
    if (mongoose.connection.readyState === 1) { // 1 = connected
        await mongoose.connection.db.dropDatabase();
    } else {
        console.error('No database connection to drop.');
    }
});

// Close database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('User API with Authentication', () => {
    let token;

    // Create a user and log in before running tests
    beforeAll(async () => {
        await request(app)
            .post('/worko/user')
            .send({
                email: 'auth@example.com',
                name: 'Auth User',
                age: 30,
                city: 'Auth City',
                zipCode: '54321',
                password: 'authPassword123',
            });

        const loginResponse = await request(app)
            .post('/worko/user/login')
            .send({
                email: 'auth@example.com',
                password: 'authPassword123',
            });
        token = loginResponse.body.token;
    });

    it('should get a list of users', async () => {
        const res = await request(app)
            .get('/worko/user')
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get a user by ID with authentication', async () => {
        // First, create a user without needing authentication
        const createUserResponse = await request(app)
            .post('/worko/user')
            .send({
                email: 'testById@example.com',
                name: 'Test ById User',
                age: 30,
                city: 'Test City',
                zipCode: '12345',
                password: 'password123',
            });

        const loginResponse = await request(app)
            .post('/worko/user/login')
            .send({
                email: 'testById@example.com',
                password: 'password123',
            });

        const token = loginResponse.body.token;

        const userId = createUserResponse.body.id;
        const res = await request(app)
            .get(`/worko/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('email', 'testById@example.com');
    });

    it('should update a user with authentication', async () => {
        const userResponse = await request(app)
            .post('/worko/user')
            .send({
                email: 'updateTest@example.com',
                name: 'Update Test User',
                age: 30,
                city: 'Update Test City',
                zipCode: '12345',
                password: 'password123',
            });

        const userId = userResponse.body.id;
        const updatedUser = {
            email: 'updated@example.com',
            name: 'Updated User',
            age: 35,
            city: 'Updated City',
            zipCode: '54321',
        };

        const res = await request(app)
            .put(`/worko/user/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUser);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('email', updatedUser.email);
    });

    it('should soft delete a user with authentication', async () => {
        const userResponse = await request(app)
            .post('/worko/user')
            .send({
                email: 'deleteTest@example.com',
                name: 'Delete Test User',
                age: 30,
                city: 'Delete Test City',
                zipCode: '12345',
                password: 'password123',
            });

        const userId = userResponse.body.id;
        const res = await request(app)
            .delete(`/worko/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(204);

        const checkUser = await request(app)
            .get(`/worko/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(checkUser.statusCode).toEqual(404); // Assuming soft delete makes the user not retrievable
    });
});
