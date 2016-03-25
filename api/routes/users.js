module.exports = app => {
  /**
   * Users policy
   * ACL configuration
   */
  app.acl.allow([{
    roles: ['user', 'admin'],
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
      resources: '/api/v1/auth/facebook',
      permissions: ['post'],
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
    roles: ['user', 'admin'],
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
  app.post('/api/v1/auth/facebook', (req, res) => {
    app.services.social.facebook(req.body.code, req.body.clientId,
    req.body.redirectUri, req.header('Authorization'))
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({ msg: error.message });
      });
  });
};
