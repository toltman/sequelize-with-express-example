const express = require("express");
const router = express.Router();
const Article = require("../models").Article;
const Comment = require("../models").Comment;

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
    const article = await Article.findByPk(req.params.articleId);
    res.render("comments/new", {
      article,
      comment: {},
      title: "New Comment",
    });
  })
);

/* POST new comment */
router.post(
  "/:articleId/comments/new",
  asyncHandler(async (req, res) => {
    const ArticleId = parseInt(req.params.articleId);
    let comment;
    try {
      comment = await Comment.create({ ...req.body, ArticleId });
      res.redirect(`/articles/${ArticleId}`);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        article = await Article.build(req.body);
        res.render("articles/new", {
          article,
          errors: error.errors,
          title: "New Article",
        });
      } else {
        // throw error to the asyncHandler's catch block
        throw error;
      }
    }
  })
);

/* Edit comment form */
router.get(
  "/:articleId/comments/:commentId/edit",
  asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.commentId);
    res.render("comments/edit", {
      comment,
      title: "Edit Comment",
    });
  })
);

/* Update a comment */
router.post(
  "/:articleId/comments/:commentId/edit",
  asyncHandler(async (req, res) => {
    let comment;
    try {
      comment = await Comment.findByPk(req.params.commentId);
      if (comment) {
        await comment.update({ ...req.body });
        res.redirect(`/articles/${comment.ArticleId}/`);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        article = await comment.build({ ...req.body });
        res.render("/:articleId/comments/:commentId/edit", {
          comment,
          errors: error.errors,
          title: "Edit Article",
        });
      }
    }
  })
);

/* Delete Comment form */
router.get(
  "/:articleId/comments/:commentId/delete",
  asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.commentId);
    if (comment) {
      res.render("comments/delete", {
        comment,
        title: "Delete Comment",
      });
    } else {
      res.sendStatus(404);
    }
  })
);

router.post(
  "/:articleId/comments/:commentId/delete",
  asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.commentId);
    if (comment) {
      await comment.destroy();
      res.redirect(`/articles/${req.params.articleId}`);
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = router;
