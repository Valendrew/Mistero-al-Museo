const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const router = express.Router();
const app = express();
const port= 4000;

const jsonParser = bodyParser.json();

app.use("/", router);

router.get("/", (req, res) => res.send("Welcome to Express"));

router.post("/add_missions", jsonParser, (req, res) => {
	const json_res = {
		response: "success",
	};
	fs.writeFileSync("./src/json/mission.json", JSON.stringify(req.body, null, 4), () => {});
	res.status(201).json(json_res);
});

router.post("/add_story", jsonParser, (req, res) => {
	const json_res = {
		response: "success",
	};
	fs.writeFileSync("./src/json/mission_transition.json", JSON.stringify(req.body, null, 4), () => {});
	res.status(201).json(json_res);
});

app.listen(port, () => {
	console.log(`Server running in Port ${port}`);
});
