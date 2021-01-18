const express = require("express");
const cookieParser = require('cookie-parser');
const path = require('path');

const controllerFolder = path.join(__dirname, "server", "controller"); 
const stories = require(path.join(controllerFolder, "stories"));
const games = require(path.join(controllerFolder, "games"));
const files = require(path.join(controllerFolder, "files"));
const auth = require(path.join(controllerFolder, "auth"));

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(cookieParser());
app.use("/stories", stories);
app.use("/games", games);
app.use("/files", files);
app.use("/auth", auth);

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

const port= 8000;
app.listen(port, () => {
	console.log(`Server running in Port ${port}`);
});
