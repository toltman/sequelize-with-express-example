const express = require("express");
const router = express.Router();
const Article = require("../models").Article;

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

/* GET articles listing. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const articles = await Article.findAll({ order: [["createdAt", "DESC"]] });
    res.render("articles/index", {
      articles,
      title: "Sequelize-It!",
    });
  })
);

/* Create a new article form. */
router.get("/new", (req, res) => {
  res.render("articles/new", { article: {}, title: "New Article" });
});

/* POST create article. */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const article = await Article.create(req.body);
    res.redirect(`/articles/${article.id}`);
  })
);

/* Edit article form. */
router.get(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    const article = await Article.findByPk(req.params.id);
    res.render("articles/edit", {
      article: article.dataValues,
      title: "Edit Article",
    });
  })
);

/* GET individual article. */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const article = await Article.findByPk(req.params.id);
    res.render("articles/show", {
      article,
      title: article.title,
    });
  })
);

/* Update an article. */
router.post(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    const article = await Article.findByPk(req.params.id);
    await article.update(req.body);
    res.redirect("/articles/" + article.id);
  })
);

/* Delete article form. */
router.get(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const article = await Article.findByPk(req.params.id);
    res.render("articles/delete", {
      article,
      title: "Delete Article",
    });
  })
);

/* Delete individual article. */
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const article = await Article.findByPk(req.params.id);
    await article.destroy();
    res.redirect("/articles");
  })
);

module.exports = router;
