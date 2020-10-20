const express = require("express");
const stories = require("./stories");

const app = express();
const port= 4000;

app.use("/story", stories);

app.listen(port, () => {
	console.log(`Server running in Port ${port}`);
});
