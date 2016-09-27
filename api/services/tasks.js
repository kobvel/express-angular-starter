import Tasks from './../models/tasks';

const service = {};

service.getAll = (user) => {
  return Tasks.findAll({
    where: { user_id: user.id },
  });
};

service.create = (task) => {
  return Tasks.create(task);
};

service.findById = (id, user) => {
  const query = { where: { id } };

  if (user) {
    query.where.user_id = user.id;
  }

  return Tasks.findOne(query);
};

service.update = (id, task, user) => {
  const query = { where: { id } };

  if (user) {
    query.where.user_id = user.id;
  }

  return Tasks.update(task, query);
};

service.destroy = (id, user) => {
  const query = { where: { id } };

  if (user) {
    query.where.user_id = user.id;
  }

  return Tasks.destroy(query);
};

module.exports = service;
