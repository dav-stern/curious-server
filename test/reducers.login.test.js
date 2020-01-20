require('dotenv').config({ path: './.env.test' });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');

const mutationsResolvers = require('../graphQL/resolvers/mutations.resolvers');

jest.mock('../models', () => ({
  Roadmaps: {
    destroy: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  ChecklistItems: {
    destroy: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  Users: {
    destroy: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
describe('user login mutations', () => {
  test('allows existing user to login', async () => {
    db.Users.findOne.mockResolvedValue({ id: 88, name: 'Cipriana', email: 'cipriana@cipriana.com' });
    bcrypt.compare.mockResolvedValue(true);
    const resp = await mutationsResolvers.login({}, { email: 'cipriana@cipriana.com', password: 'mypassword' });
    expect(resp).toEqual(jwt.sign({ id: 88, name: 'Cipriana', email: 'cipriana@cipriana.com' }, process.env.JWT_SECRET));
  });
});
