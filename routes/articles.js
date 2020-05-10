const express = require("express");
const router = express.Router();
const mid = require("../middleware");
const Article = require("../models").Article;
const Comment = require("../models").Comment;
const sequelize = require("../models").sequelize;

/* Function to display result of query (for testing) */
function displayResults(results) {
  results.forEach((result) => {
    console.dir(result.toJSON());
  });
}

/* Error handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };
}

/* GET articles listing. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page = 1 } = req.query; // get page number from query
    const limit = 5; // max articles returned per page
    const offset = (page - 1) * limit;

    // get the maximum number of pages
    const maxPages = Math.ceil((await Article.count()) / limit);

    // get articles
    const articles = await Article.findAll({
      attributes: {
        include: [
          // get comment counts
          [
            sequelize.literal(
              `(SELECT COUNT(*)
              FROM comments AS comment
              WHERE comment.ArticleId = article.id
              )`
            ),
            "commentCount",
          ],
          // get article authors
          [
            sequelize.literal(
              `(SELECT user.name 
                FROM Users as user 
                WHERE user.id = article.UserId
                )`
            ),
            "author",
          ],
        ],
      },
      order: [["createdAt", "DESC"]], // reverse-chronological order
      limit,
      offset,
    }); //.then(displayResults);

    res.render("articles/index", {
      articles,
      title: "Articles",
      page,
      maxPages,
    });
  })
);

/* Create a new article form. */
router.get("/new", mid.requiresLogin, (req, res) => {
  res.render("articles/new", { article: {}, title: "New Article" });
});

/* POST create article. */
router.post(
  "/",
  mid.requiresLogin,
  asyncHandler(async (req, res) => {
    let article;
    try {
      article = await Article.create({
        ...req.body,
        // associate userId with the article
        UserId: req.session.userId,
      });
      res.redirect(`/articles/${article.id}`);
    } catch (error) {
      // checking the error type
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

/* Edit article form. */
router.get(
  "/:id/edit",
  mid.requiresLogin,
  asyncHandler(async (req, res) => {
    const article = await Article.findByPk(req.params.id);
    if (article) {
      // user is the author of the article
      if (article.UserId === req.session.userId) {
        res.render("articles/edit", {
          article,
          title: "Edit Article",
        });
      } else {
        res.send("You are not the author of this article.");
      }
    } else {
      // else article is not found
      res.sendStatus(404);
    }
  })
);

/* GET individual article. */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    // get article along with comments
    const article = await Article.findByPk(req.params.id, {
      attributes: {
        include: [
          [
            sequelize.literal(
              `(
                SELECT user.name
                FROM Users as user
                WHERE user.id = article.UserId
              )`
            ),
            "author",
          ],
        ],
      },
      include: {
        model: Comment,
        attributes: {
          include: [
            [
              sequelize.literal(
                `(
                  SELECT user.name
                  FROM Users as user
                  WHERE user.id = Comments.UserId
                )`
              ),
              "author",
            ],
          ],
        },
      },
      order: [[Comment, "createdAt", "DESC"]],
    });
    if (article) {
      res.render("articles/show", {
        article,
        title: article.title,
      });
    } else {
      res.sendStatus(404);
    }
  })
);

/* Update an article. */
router.post(
  "/:id/edit",
  mid.requiresLogin,
  asyncHandler(async (req, res) => {
    let article;
    try {
      article = await Article.findByPk(req.params.id);
      if (article) {
        if (article.UserId === req.session.userId) {
          // user is the author
          await article.update(req.body);
          res.redirect("/articles/" + article.id);
        } else {
          // user is not the author
          res.send("You are not the author of this article.");
        }
      } else {
        // article is not found
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        article = await Article.build(req.body);
        article.id = req.params.id; // make sure the correct article gets updated
        res.render("articles/edit", {
          article,
          errors: error.errors,
          title: "Edit Article",
        });
      }
    }
  })
);

/* Delete article form. */
router.get(
  "/:id/delete",
  mid.requiresLogin,
  asyncHandler(async (req, res) => {
    const article = await Article.findByPk(req.params.id);
    if (article) {
      if (article.UserId === req.session.userId) {
        res.render("articles/delete", {
          article,
          title: "Delete Article",
        });
      } else {
        res.send("You are not the author of this article.");
      }
    } else {
      res.sendStatus(404);
    }
  })
);

/* Delete individual article. */
router.post(
  "/:id/delete",
  mid.requiresLogin,
  asyncHandler(async (req, res) => {
    const article = await Article.findByPk(req.params.id);
    if (article) {
      if (article.UserId === req.session.userId) {
        await article.destroy();
        res.redirect("/articles");
      } else {
        res.send("You are not the author of this article.");
      }
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = router;
