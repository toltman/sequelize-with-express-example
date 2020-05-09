"use strict";
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init(
    {
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.STRING,
    },
    {
      hooks: {
        beforeCreate: async function (user) {
          user.password = await bcrypt.hash(user.password, 10);
        },
      },

      sequelize,
    }
  );
  User.authenticate = async function (email, password, callback) {
    try {
      // look up user by email
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        // user not found
        const err = new Error("User not found.");
        err.status = 401;
        return callback(err);
      }

      // compare password
      const result = await bcrypt.compare(password, user.password);
      if (result) {
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
