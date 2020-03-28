
const request = require('supertest');
const app = require('../../../src/app');
const database = require('../../../src/database/index');

const USER = {
  name: "Lucas Damas",
  email: "lucas.dcorrea6@gamail.com",
  cpfCnpj: 459283018047,
  type: 1,
  password: "123456"
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
      .send(USER);

      console.log(response.data)
      expect(response.statusCode).toEqual(200);
    // expect(response.body).toHaveProperty('id');
  });
});