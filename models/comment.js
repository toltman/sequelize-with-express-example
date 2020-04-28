"use strict";
const Sequelize = require("sequelize");
// const moment = require("moment");

module.exports = (sequelize) => {
  class Comment extends Sequelize.Model {}
  Comment.init(
    {
      author: Sequelize.STRING,
      article_id: Sequelize.STRING,
      body: Sequelize.TEXT,
    },
    { sequelize }
  );

  return Comment;
};
