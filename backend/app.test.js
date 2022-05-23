const request = require('supertest');
const app = require('./app');

test('Get all books request without token, expects 200', async () => {
  await request(app).get('/books').expect(200);
});

test('Should get 200 if system running perfectly', async () => {
  await request(app).get('/').expect(200);
});

test('Should get 200 if category added perfectly', async () => {
  await request(app)
    .post('/categories')
    .send({
      name: 'test',
      description: 'Tested',
    })
    .expect(200);
});

test('Should get 200 if data logged in correctly', async () => {
  await request(app)
    .post('/user/login')
    .send({
      email: 'nani@gmail.com',
      password: 'uma',
    })
    .expect(200);
});

test('Get all Categories request without token, expects 200', async () => {
  await request(app).get('/categories').expect(200);
});

