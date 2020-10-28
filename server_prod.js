const express = require("express");
const path = require("path");
const stories = require(path.join(__dirname, "server/stories"));
const games = require(path.join(__dirname, "server/games"));
const app = express();
const port = 4000;
const auth = require("./server/auth");
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');

app.use("/story", fileupload(), stories);
app.use("/games", games);
app.use(cookieParser());
app.use("/auth",auth);
app.listen(port, () => {
	console.log(`Server running in Port ${port}`);
});
