const express = require("express");
const jwt = require("jsonwebtoken");
const withAuth = require("./withAuth");
const fileOperations = require("./methods");
const path = require("path");

const router = express.Router();
const secret = "parolasegreta";
const dataPath = path.join(__dirname, "..", "data", "users");

router.use(express.json());

router.post("/login", async (req, res, next) => {
	let username = req.body.username;
	let password = req.body.password;
	let data;
	try {
		data = await fileOperations.read("users.json", dataPath);
	} catch (e) {
		next(e);
	}
	const pairUserPassword = data.find((element) => element.username === username && element.password === password);
	if (pairUserPassword) {
		console.log("login successful");
		const token = jwt.sign({ username }, secret, {
			expiresIn: "3h",
		});
		res.cookie("tokenAutore", token, { httpOnly: true }).sendStatus(200);
	} else {
		console.log("Accesso negato");
		res.sendStatus(401);
	}
});
router.post("/signup", async (req, res, next) => {
	let username = req.body.username;
	let password = req.body.password;
	let data;
	try {
		data = await fileOperations.read("users.json", dataPath);
	} catch (e) {
		next(e);
	}
	if (data.some((item) => item.username === username)) {
		res.sendStatus(401);
	} else {
		data.push({ username, password });
		fileOperations
			.write(data, "users.json", dataPath)
			.then(() => {
				res.sendStatus(200);
			})
			.catch(next);
	}
});

router.post("/setPlayerID", (req, res) => {
	res.cookie("playerID", "id", { httpOnly: true }).sendStatus(200);
});

router.get("/checkToken", withAuth, function (req, res) {
	res.sendStatus(200);
});
module.exports = router;
