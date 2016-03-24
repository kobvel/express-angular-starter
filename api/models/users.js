import bcrypt from 'bcrypt';

module.exports = (sequelize, DataType) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataType.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: 'user',
      validate: {
        notEmpty: true,
      },
    },
    emailValidate: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    picture: {
      type: DataType.STRING,
      allowNull: true,
      defaultValue: null,
    },
    facebook: {
      type: DataType.STRING,
      unique: true,
      allowNull: true,
      defaultValue: null,
    },
    tokenValidate: {
      type: DataType.STRING,
      unique: true,
      allowNull: true,
      defaultValue: null,
    },
    tokenPassRecovery: {
      type: DataType.STRING,
      unique: true,
      allowNull: true,
      defaultValue: null,
    },
    tokenPassRecoveryDate: {
      type: DataType.DATE,
      defaultValue: new Date(),
    },
  }, {
    hooks: {
      beforeCreate: user => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      },
    },
    classMethods: {
      associate: models => {
        Users.hasMany(models.Tasks);
      },
      isPassword: (encodedPassword, password) => {
        return bcrypt.compareSync(password, encodedPassword);
      },
    },
  });
  return Users;
};
