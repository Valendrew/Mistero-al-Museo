const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const controllerFolder = path.join(__dirname, "server", "controller"); 
const stories = require(path.join(controllerFolder, "stories"));
const games = require(path.join(controllerFolder, "games"));
const files = require(path.join(controllerFolder, "files"));
const auth = require(path.join(controllerFolder, "auth"));

const app = express();
app.use(cookieParser());
app.use("/stories", stories);
app.use("/games", games);
app.use("/files", files);
app.use("/auth", auth);

const port = 4000;
app.listen(port, () => {
	console.log(`Server running in Port ${port}`);
});
