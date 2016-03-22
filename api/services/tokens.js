import Q from 'q';
import jwt from 'jwt-simple';

module.exports = app => {
  const Users = app.db.models.Users;
  const cfg = app.config.config;
  const service = {};

  service.signin = (email, password) => {
    const deferred = Q.defer();

    Users.findOne({ where: { email } })
      .then(user => {
        if (Users.isPassword(user.password, password) && user.emailValidate) {
          const payload = { id: user.id };
          deferred.resolve({
            user: {
              id: user.id,
              name: user.name,
            },
            token: jwt.encode(payload, cfg.jwtSecret),
          });
        } else {
          deferred.reject({
            message: 'Invalid Password or Email Not Validated',
          });
        }
      })
      .catch(error => {
        deferred.reject({
          message: 'Invalid Password',
        });
      });

    return deferred.promise;
  };

  return service;
};
