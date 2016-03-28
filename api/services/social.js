import bcrypt from 'bcrypt';
import request from 'request';
import Q from 'q';
import jwt from 'jwt-simple';
import qs from 'querystring';

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

  service.twitter = (reqBody) => {
    const deferred = Q.defer();
    const requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    const accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    const profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

    // Part 1 of 2: Initial request from Satellizer.
    if (!reqBody.oauth_token || !reqBody.oauth_verifier) {
      const requestTokenOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        callback: reqBody.redirectUri,
      };
      // Step 1. Obtain request token for the authorization popup.
      request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, (err, response, body) => {
        const oauthToken = qs.parse(body);
        // Step 2. Send OAuth token back to open the authorization screen.
        deferred.resolve(oauthToken);
      });
    } else {
      // Part 2 of 2: Second request after Authorize app is clicked.
      const accessTokenOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        token: reqBody.oauth_token,
        verifier: reqBody.oauth_verifier,
      };

      // Step 3. Exchange oauth token and oauth verifier for access token.
      request.post({ url: accessTokenUrl, oauth: accessTokenOauth },
      (err, response, accessTokenParam) => {
        const accessToken = qs.parse(accessTokenParam);
        const profileOauth = {
          consumer_key: config.TWITTER_KEY,
          consumer_secret: config.TWITTER_SECRET,
          oauth_token: accessToken.oauth_token,
        };

        // Step 4. Retrieve profile information about the current user.
        request.get({
          url: profileUrl + accessToken.screen_name,
          oauth: profileOauth,
          json: true,
        }, (err2, response2, profile) => {
          // Step 5b. Create a new user account or return an existing one.
          Users.findOne({ twitter: profile.id })
          .then((err3, existingUser) => {
            if (existingUser) {
              deferred.resolve({
                user: {
                  id: existingUser.id,
                  name: existingUser.name,
                },
                token: createJWT(existingUser),
              });
            } else {
              const user = {};
              const salt = bcrypt.genSaltSync();
              user.password = bcrypt.hashSync(salt, salt);
              user.emailValidate = 1;
              user.email = profile.email;
              Users.create(user);
              user.twitter = profile.id;
              user.name = profile.name;
              user.picture = profile.profile_image_url.replace('_normal', '');
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
          // end
        });
      });
    }
    return deferred.promise;
  };

  service.instagram = (code, clientId, redirectUri) => {
    const deferred = Q.defer();
    const accessTokenUrl = 'https://api.instagram.com/oauth/access_token';
    const params = {
      client_id: clientId,
      redirect_uri: redirectUri,
      client_secret: config.INSTAGRAM_SECRET,
      code,
      grant_type: 'authorization_code',
    };
    request.post({ url: accessTokenUrl, form: params, json: true },
    (err, response, body) => {
      const query = { where: { instagram: body.user.id } };
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
          user.instagram = body.user.id;
          user.emailValidate = 1;
          user.email = body.user.username + '@instagram.com';
          user.picture = body.user.profile_picture;
          user.name = body.user.full_name;
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
    });
    return deferred.promise;
  };

  service.google = (code, clientId, redirectUri) => {
    const deferred = Q.defer();
    const accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    const peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    const params = {
      code,
      client_id: clientId,
      client_secret: config.GOOGLE_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    };
    request.post(accessTokenUrl, { form: params, json: true },
    (err, response, tokenReturn) => {
      const accessToken = tokenReturn.access_token;
      const headers = { Authorization: 'Bearer ' + accessToken };
      request.get({ url: peopleApiUrl, headers, json: true },
      (err2, response2, profile) => {
        if (profile.error) {
          deferred.reject({ err: profile.error.errors[0].message });
        } else {
          const query = { where: { google: profile.sub } };
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
              user.google = profile.sub;
              user.emailValidate = 1;
              user.email = profile.email;
              user.picture = profile.picture;
              user.name = profile.given_name + ' ' + profile.family_name;
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

