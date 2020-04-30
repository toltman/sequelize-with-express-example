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
      author: Sequelize.STRING,
      body: Sequelize.TEXT, // unlimited length - would need to control this
    },
    { sequelize }
  );

  return Comment;
};
