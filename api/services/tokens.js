import Q from 'q';
import jwt from 'jwt-simple';

import config from './../config/config';
import Users from './../models/users';

const service = {};

service.signin = (email, password) => {
  const deferred = Q.defer();

  Users.findOne({ where: { email } })
    .then(user => {
      if (Users.isPassword(user.password, password)) {
        if (user.emailValidate) {
          const payload = { id: user.id };
          deferred.resolve({
            user: {
              id: user.id,
              name: user.name,
            },
            token: jwt.encode(payload, config.jwtSecret),
          });
        } else {
          deferred.reject({
            message: 'Email Not Validated',
          });
        }
      } else {
        deferred.reject({
          message: 'Invalid Password',
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

module.exports = service;
