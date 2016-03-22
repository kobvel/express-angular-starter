import bcrypt from 'bcrypt';

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
    user.tokenValidate = bcrypt.genSaltSync().replace(/\//g, '-');
    return Users.create(user);
  };

  service.edit = (body, user) => {
    const id = user.id;
    const query = { where: { id } };

    return Users.update(body, query);
  };

  service.validateEmail = (token) => {
    const query = { where: { tokenValidate: token } };
    const value = { emailValidate: 1 };
    return Users.update(value, query);
  };

  return service;
};
