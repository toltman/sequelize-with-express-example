# Using Sequelize ORM with Express

This project is an example project from the [Using Sequelize ORM With Express](https://teamtreehouse.com/library/introducing-the-project-21) course on Treehouse.

## Extensions

I have added several extensions to this project

- Added comments to articles.
  - Comments are uniquely associated with an article and are displayed on the article page.
  - Comments can be created, updated and deleted.
- Added error handling for all article and comment routes
- Comment counts are displayed on the /articles page.
- Added pagination for articles.
- Implemented user authentication for authoring articles and comments
  - users can sign up and login
  - user must create an account and login to post articles or comments
  - menu options are dynamic based on login status
  - routes are restricted based on login status and user ownership or articles and comments

Possible future extensions:

- pagination for comments (load more feature)
- implement sessions with a session store instead of server RAM for production
