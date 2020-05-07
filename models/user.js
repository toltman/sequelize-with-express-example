"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init(
    {
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.STRING,
    },
    { sequelize }
  );
  User.authenticate = async function (email, password, callback) {
    try {
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        const err = new Error("User not found.");
        err.status = 401;
        return callback(err);
      }

      // compare password
      // needs to be updated with bcrypt
      if (password === user.password) {
        return callback(null, user);
      } else {
        return callback();
      }
    } catch (err) {
      throw err;
    }
  };
  return User;
};
