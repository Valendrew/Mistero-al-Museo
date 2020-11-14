const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");

const stories = require(path.join(__dirname, "server/stories"));
const games = require(path.join(__dirname, "server/games"));
const files = require(path.join(__dirname, "server/files"));
const auth = require(path.join(__dirname, "server/auth"));

app.use(cookieParser());
app.use("/stories", stories);
app.use("/games", games);
app.use("/files", files);
app.use("/auth", auth);

const port = 4000;
app.listen(port, () => {
	console.log(`Server running in Port ${port}`);
});
