const express = require("express");
const path = require('path');
const stories = require("./server/stories");

const app = express();
const port= 8000;
console.log(__dirname);

app.use(express.static(path.join(__dirname, 'build')));
app.use("/story", stories);

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  
app.listen(port, () => {
	console.log(`Server running in Port ${port}`);
});