
const request = require('supertest');
const app = require('../../../src/app');
const database = require('../../../src/database/index');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiTHVjYXMgRGFtYXMiLCJlbWFpbCI6Imx1Y2FzLmRjb3JyZWExQGdhbWFpbC5jb20iLCJjcGZDbnBqIjo0NTkyODMwMTgwOCwidHlwZSI6MiwidHlwZVBlcnNvbiI6MSwicGFzc3dvcmRSZXNldFRva2VuIjpudWxsLCJwYXNzd29yZFJlc2V0RXhwaXJlcyI6bnVsbH0sImlhdCI6MTU4NTQyNTM4OCwiZXhwIjoxNTg1NDY4NTg4fQ.oaZ8DoG3jOU3gQc1eJg6xHJ0wzIHrqL9gs5LeJNNp0M'

const userCreate = {
  name: "Lucas Damas",
  email: "lucas.dcorrea1@gamail.com",
  cpfCnpj: 45928301808,
  typePerson: 1,
  type: 1,
  password: "123456"
}
const userAuth = {
  "email": "lucas.dcorrea1@gamail.com",
  "password": "1234567"
}

describe('Users', () => {
  beforeEach(async () => {
    await database.migrate.rollback();
    await database.migrate.latest();
  });

  afterAll(async () => {
    await database.destroy();
  });

  it('should gbe able to create a new User', async () => {
    const response = await request(app)
      .post('/api/v1/users/register')
      .send(userCreate)
      .set('autorization', 'dddd')
      .set('Accept', 'application/json')

    console.log(response.body)
    expect(response.statusCode).toEqual(200);
    // expect(response.body).toHaveProperty('id');
  });
});