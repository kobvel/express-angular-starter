module.exports = app => {
  const Users = app.db.models.Users;

  function adminsLoad() {
    function success(res) {
      const user = {
        name: 'Admin',
        password: 'admin',
        email: 'admin@admin.com',
        role: 'admin',
      };
      console.log(res.count);
      if (res.count === 0) {
        Users.create(user);
      }
      return {};
    }

    function error(err) {
      return {};
    }
    Users.findAndCount({
      where: {
        role: 'admin',
      },
    })
      .then(success)
      .catch(error);
  }

  adminsLoad();
};
