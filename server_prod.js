const express = require("express");
const path = require("path");
const stories = require(path.join(__dirname, "server/stories"));
const games = require(path.join(__dirname, "server/games"));
const app = express();
const port = 4000;

app.use("/story", stories);
app.use("/games", games);

app.listen(port, () => {
	console.log(`Server running in Port ${port}`);
});
