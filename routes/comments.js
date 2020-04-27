const express = require("express");
const router = express.Router();
//const Comment = require("../models").Comment

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

/* Create a new comment form */
router.get(
  "/:articleId/comments/new",
  asyncHandler(async (req, res) => {
    const article = await article.findByPk(req.params.articleId);
    res.render("comments/new", {
      article,
      comment: {},
      title: "New Comment",
    });
  })
);

/* Edit comment form */
router.get(
  "/:articleId/comments/:commentId/edit",
  asyncHandler(async (req, res) => {
    const article = await article.findByPk(req.params.articleId);
    const comment = await article.findByPk(req.params.commentId);
    res.render("comments/edit", {
      article,
      comment,
      title: "Edit Comment",
    });
  })
);
