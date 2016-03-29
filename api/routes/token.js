module.exports = app => {
  /**
   * Token policy
   * ACL configuration
   */
  app.acl.allow([{
    roles: ['guest', 'user', 'admin'],
    allows: [{
      resources: '/api/v1/token',
      permissions: 'post',
    }],
  }]);

  /**
   * @api {post} /token Authentication Token
   * @apiGroup Credentials
   * @apiParam {String} email User email
   * @apiParam {String} password User password
   * @apiParamExample {json} Input
   *    {
   *      "email": "john@connor.net",
   *      "password": "123456"
   *    }
   * @apiSuccess {String} token Token of authenticated user
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    {"token": "xyz.abc.123.hgf"}
   * @apiErrorExample {json} Authentication error
   *    HTTP/1.1 401 Unauthorized
   */
  app.post('/api/v1/token', app.acl.checkRoles, (req, res) => {
    if (req.body.email && req.body.password) {
      const email = req.body.email;
      const password = req.body.password;
      app.services.tokens.signin(email, password)
        .then(response => res.json(response))
        .catch(error => {
          res.sendStatus(401);
        });
    } else {
      res.sendStatus(401);
    }
  });
};
