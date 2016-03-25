import bcrypt from 'bcrypt';
import request from 'request';
import Q from 'q';
import jwt from 'jwt-simple';

module.exports = app => {
  const Users = app.db.models.Users;
  const config = app.config.config;
  const service = {};

  function createJWT(user) {
    const payload = { id: user.id };
    return jwt.encode(payload, config.jwtSecret);
  }

  service.facebook = (code, clientId, redirectUri, authorization) => {
    const deferred = Q.defer();
    const fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    const accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    const graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    const params = {
      code,
      client_id: clientId,
      client_secret: config.FACEBOOK_SECRET,
      redirect_uri: redirectUri,
    };
    request.get({ url: accessTokenUrl, qs: params, json: true },
    (err, response, accessToken) => {
      if (response.statusCode !== 200) {
        deferred.reject({ err: accessToken.error.message });
      }
      request.get({ url: graphApiUrl, qs: accessToken, json: true },
      (err2, response2, profile) => {
        if (response2.statusCode !== 200) {
          deferred.reject({ err: profile.error.message });
        } else {
          const query = { where: { facebook: profile.id } };
          Users.findOne(query)
          .then((existingUser) => {
            if (existingUser) {
              const token = createJWT(existingUser);
              deferred.resolve({
                user: {
                  id: existingUser.dataValues.id,
                  name: existingUser.name,
                },
                token,
              });
            } else {
              const user = {};
              const salt = bcrypt.genSaltSync();
              user.password = bcrypt.hashSync(salt, salt);
              user.facebook = profile.id;
              user.emailValidate = 1;
              user.email = profile.email;
              user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
              user.name = profile.first_name + ' ' + profile.last_name;
              Users.create(user)
              .then((data) => {
                const token = createJWT(user);
                deferred.resolve({
                  user: {
                    id: data.dataValues.id,
                    name: user.name,
                  },
                  token,
                });
              });
            }
          });
        }
      });
    });
    return deferred.promise;
  };

  return service;
};

