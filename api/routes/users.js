import request from 'request';
// import jwt from 'jwt-simple';

module.exports = app => {
  /**
   * Users policy
   * ACL configuration
   */
  app.acl.allow([{
    roles: ['user'],
    allows: [{
      resources: '/api/v1/users/me',
      permissions: ['get', 'delete'],
    }],
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/v1/users',
      permissions: ['post'],
    },
    {
      resources: '/api/v1/users/forgot',
      permissions: ['post'],
    },
    {
      resources: '/api/v1/users/validate/:token',
      permissions: ['get'],
    },
    {
      resources: '/api/v1/users/reset/validate/:token',
      permissions: ['get'],
    },
    {
      resources: '/auth/facebook',
      permissions: ['get'],
    },
    {
      resources: '/api/v1/users/reset/password/:token',
      permissions: ['post'],
    },
    {
      resources: '/api/v1/users/reset/:token',
      permissions: ['get'],
    }],
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/v1/users/me',
      permissions: ['put'],
    }],
  }]);

  /**
   * @api {get} /users/me Return the authenticated user's data
   * @apiGroup User
   * @apiHeader {String} Authorization Token of authenticated user
   * @apiHeaderExample {json} Header
   *    {"Authorization": "JWT xyz.abc.123.hgf"}
   * @apiSuccess {Number} id User id
   * @apiSuccess {String} name User name
   * @apiSuccess {String} email User email
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    {
   *      "id": 1,
   *      "name": "John Connor",
   *      "email": "john@connor.net"
   *    }
   * @apiErrorExample {json} Find error
   *    HTTP/1.1 412 Precondition Failed
   */
  app.get('/api/v1/users/me', app.acl.checkRoles, (req, res) => {
    app.services.users.findById(req.user.id)
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({ msg: error.message });
      });
  });

  /**
   * @api {delete} /users/me Deletes an authenticated user
   * @apiGroup User
   * @apiHeader {String} Authorization Token of authenticated user
   * @apiHeaderExample {json} Header
   *    {"Authorization": "JWT xyz.abc.123.hgf"}
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 204 No Content
   * @apiErrorExample {json} Delete error
   *    HTTP/1.1 412 Precondition Failed
   */
  app.delete('/api/v1/users/me', app.acl.checkRoles, (req, res) => {
    app.services.users.destroy(req.user.id)
      .then(result => res.sendStatus(204))
      .catch(error => {
        res.status(412).json({ msg: error.message });
      });
  });

  /**
   * @api {post} /users Register a new user
   * @apiGroup User
   * @apiParam {String} name User name
   * @apiParam {String} email User email
   * @apiParam {String} password User password
   * @apiParamExample {json} Input
   *    {
   *      "name": "John Connor",
   *      "email": "john@connor.net",
   *      "password": "123456"
   *    }
   * @apiSuccess {Number} id User id
   * @apiSuccess {String} name User name
   * @apiSuccess {String} email User email
   * @apiSuccess {String} password User encrypted password
   * @apiSuccess {Date} updated_at Update's date
   * @apiSuccess {Date} created_at Register's date
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    {
   *      "id": 1,
   *      "name": "John Connor",
   *      "email": "john@connor.net",
   *      "password": "$2a$10$SK1B1",
   *      "updated_at": "2016-02-10T15:20:11.700Z",
   *      "created_at": "2016-02-10T15:29:11.700Z",
   *    }
   * @apiErrorExample {json} Register error
   *    HTTP/1.1 412 Precondition Failed
   */
  app.post('/api/v1/users', app.acl.checkRoles, (req, res) => {
    delete req.body.role;
    app.services.users.create(req.body)
      .then(result => {
        app.services.email.sendValidateEmail(req.body.email, result.dataValues.tokenValidate);
        res.json(result);
      })
      .catch(error => {
        res.status(412).json({ msg: error.message });
      });
  });

  /**
   * @api {put} /users Edit a user
   * @apiGroup User
   * @apiParam {String} name User name
   * @apiParam {String} email User email
   * @apiParamExample {json} Input
   *    {
   *      "name": "John Connor",
   *      "email": "john@connor.net",
   *      "id": 1
   *    }
   * @apiSuccess {Number} id User id
   * @apiParam {String} name User name
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    {
   *      "id": 1,
   *      "email": "john@connor.net",
   *      "name": "John Connor"
   *    }
   * @apiErrorExample {json} Register error
   *    HTTP/1.1 412 Precondition Failed
   */
  app.put('/api/v1/users/me', app.acl.checkRoles, (req, res) => {
    delete req.body.role;
    app.services.users.edit(req.body, req.user)
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({ msg: error.message });
      });
  });

  /**
   * @api {get} /users/validate/:token Validate user email
   * @apiGroup User
   * @apiParam {String} token User tokenValidate
   * @apiSuccess {Number} [1] if is OK
   * @apiErrorExample {json} Find error
   *    HTTP/1.1 412 Precondition Failed
   */
  app.get('/api/v1/users/validate/:token', app.acl.checkRoles, (req, res) => {
    app.services.users.validateEmail(req.params.token)
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({ msg: error.message });
      });
  });

  /**
   * @api {post} /users/forgot Send email to recover pass
   * @apiGroup User
   * @apiParam {String} email User email
   * @apiParamExample {json} Input
   *    {
   *      "email": "john@connor.net"
   *    }
   * @apiSuccess {Number} 1 if operation was success
   * @apiErrorExample {json} Register error
   *    HTTP/1.1 412 Precondition Failed
   */
  app.post('/api/v1/users/forgot', app.acl.checkRoles, (req, res) => {
    delete req.body.role;
    app.services.users.forgot(req.body.email)
      .then(result => {
        app.services.email.sendRecoveryEmail(req.body.email, result.token);
        res.json(result);
      })
      .catch(error => {
        res.status(412).json({ msg: error.message });
      });
  });

  /**
   * @api {get} /users Validate token to recover pass
   * @apiGroup User
   * @apiParam {String} token to reset pass
   * @apiSuccess {Number} 1 if operation was success
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    {
   *      "res": 1,
   *    }
   * @apiErrorExample {json} Register error
   *    HTTP/1.1 412 Precondition Failed
   */
  app.get('/api/v1/users/reset/validate/:token', app.acl.checkRoles, (req, res) => {
    app.services.users.validateReset(req.params.token)
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({ msg: error.message });
      });
  });

  /**
   * @api {post} /users Register a new user
   * @apiGroup User
   * @apiParam {String} token of user
   * @apiParam {String} newPassword
   * @apiParam {String} verifyPassword
   * @apiParamExample {json} Input
   *    {
   *      "token": "abc",
   *      "newPassword": "abc",
   *      "verifyPassword": "abc"
   *    }
   * @apiSuccess {Number} 1 if operation was success
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    {
   *      "res": 1,
   *    }
   * @apiErrorExample {json} Register error
   *    HTTP/1.1 412 Precondition Failed
   */
  app.post('/api/v1/users/reset/password/:token', app.acl.checkRoles, (req, res) => {
    app.services.users.resetPassword(req.params.token, req.body.newPassword)
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({ msg: error.message });
      });
  });
  /*
   *  Facebook Login
   */
  app.post('/auth/facebook', (req, res) => {
    const fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    const accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    const graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    const params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.FACEBOOK_SECRET,
      redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: accessToken.error.message });
      }

      // Step 2. Retrieve profile information about the current user.
      request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
        if (response.statusCode !== 200) {
          return res.status(500).send({ message: profile.error.message });
        } 
        console.log(profile);
        /* if (req.header('Authorization')) {
          User.findOne({ facebook: profile.id }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
            }
            var token = req.header('Authorization').split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);
            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }
              user.facebook = profile.id;
              user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
              user.displayName = user.displayName || profile.name;
              user.save(function() {
                var token = createJWT(user);
                res.send({ token: token });
              });
            });
          });
        } else {
          // Step 3. Create a new user account or return an existing one.
          User.findOne({ facebook: profile.id }, function(err, existingUser) {
            if (existingUser) {
              var token = createJWT(existingUser);
              return res.send({ token: token });
            }
            var user = new User();
            user.facebook = profile.id;
            user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
            user.displayName = profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        } */
      });
    });
  });
};
