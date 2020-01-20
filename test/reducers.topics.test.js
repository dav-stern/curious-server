require('dotenv').config({ path: './.env.test' });
const mutationsResolvers = require('../graphQL/resolvers/mutations.resolvers');

const db = require('../models');

jest.mock('../models', () => ({

  Topics: {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('Topics', () => {
  test('should throw an error if trying to create more than 5 topics for a given roadmap', async () => {
    db.Topics.findAll.mockResolvedValue([{}, {}, {}, {}, {}]);
    await expect(mutationsResolvers.createTopic({}, { val: 'test' })).toReject();
  });
  test('should return proper values when creating', async () => {
    db.Topics.findAll.mockResolvedValue([]);
    db.Topics.create.mockResolvedValue({ dataValues: [{ hello: 'ok' }] });
    const res = await mutationsResolvers.createTopic({}, { hello: 'ok' });
    expect(res).toEqual({ 0: { hello: 'ok' }, checklist: [] });
  });

  test('create should be called with proper arguments', async () => {
    db.Topics.findAll.mockResolvedValue([]);
    await mutationsResolvers.createTopic({},
      {
        hello: 'ok',
        RoadmapId: 48,
        rowNumber: 52,
        title: 'an original title',
      });
    expect(db.Topics.create).toHaveBeenCalledWith({
      RoadmapId: 48, rowNumber: 52, title: 'an original title',
    });
  });
  test('should return proper values when updating', async () => {
    const mockResolvedVal = [1, { 0: { dataValues: 'correct' } }];
    db.Topics.update.mockResolvedValue(mockResolvedVal);
    const res = await mutationsResolvers.updateTopic({}, { hello: 'ok' });
    expect(res).toEqual('correct');
  });
  test('update should be called with proper arguments', async () => {
    const args = {
      id: 15,
      title: 'superTitle ',
      description: 'this is a desc',
      resources: 'ok ressources',
      completed: 0,
      rowNumber: 46,
    };

    const {
      id,
      title,
      description,
      resources,
      completed,
      rowNumber,
    } = args;

    const expectedObj = {
      title,
      description,
      resources,
      completed,
      rowNumber,
    };

    db.Topics.update.mockResolvedValue([{}, [{ dataValues: 'ou' }]]);
    await mutationsResolvers.updateTopic({}, args);
    expect(db.Topics.update).toHaveBeenCalledWith(
      expectedObj,
      { where: { id }, returning: true },
    );
  });


  test('should properly delete an existing topic', async () => {
    db.Topics.destroy.mockResolvedValue(true);
    const res = await mutationsResolvers.deleteTopic({}, { id: 1 });
    expect(res).toEqual(1);
  });

  test('destroy should be called with proper value', async () => {
    const id = 48;
    await mutationsResolvers.deleteTopic({}, { id });
    expect(db.Topics.destroy).toHaveBeenCalledWith({ where: { id } });
  });


  test('should throw error when deleting unexisting topic', async () => {
    db.Topics.destroy.mockResolvedValue(false);
    await expect(mutationsResolvers.deleteTopic({}, { id: 1 })).toReject();
  });
});
