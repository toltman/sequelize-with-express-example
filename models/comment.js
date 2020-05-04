"use strict";
const Sequelize = require("sequelize");
const moment = require("moment");

module.exports = (sequelize) => {
  class Comment extends Sequelize.Model {
    publishedAt() {
      const date = moment(this.createdAt).format("MMMM D, YYYY, h:mma");
      return date;
    }
  }
  Comment.init(
    {
      author: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: '"Author" is required',
          },
        },
      },
      body: {
        type: Sequelize.TEXT, // should store up to 65kb of text data
        validate: {
          notEmpty: {
            msg: '"Body" is required',
          },
        },
      },
    },
    { sequelize }
  );

  return Comment;
};
