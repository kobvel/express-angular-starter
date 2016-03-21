module.exports = app => {
  const Users = app.db.models.Users;
  const service = {};

  service.findById = (id) => {
    return Users.findById(id, {
      attributes: ['id', 'name', 'email', 'role'],
    });
  };

  service.destroy = (id) => {
    return Users.destroy({
      where: { id },
    });
  };

  service.create = (user) => {
    return Users.create(user);
  };

  service.edit = (id, body, user) => {
    const query = { where: { id } };

    return Users.update(body, query);
  };

  return service;
};
