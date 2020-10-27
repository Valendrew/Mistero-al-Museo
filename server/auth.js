const express = require("express");
const fs = require("fs");
const jwt = require('jsonwebtoken')
const withAuth = require('./middleware');;
const secret = 'parolasegreta';
const router = express.Router();
const jsonParser = express.json();

const path = require("path");
const dataPath = path.join(__dirname, "data/users.json");

router.post("/login", jsonParser, (req, res) => {
	let username = req.body.username;
	let pass = req.body.password;
	fs.readFile(dataPath, function (err, data) {
		var json = JSON.parse(data);
		var user_ = json.find(item => item.username === username);
		if (user_) {
			if (pass === user_.pass) {
				console.log("login success");
				const token = jwt.sign({ username }, secret, {
					expiresIn: '1h'
				});
				res.cookie('token', token, { httpOnly: true })
					.sendStatus(200);
			}
			else {
				res.sendStatus(401);
			}
		}
		else {
			res.sendStatus(401);
		}

	});

});
router.post("/signup", jsonParser, (req, res) => {
	let username = req.body.username;
	let pass = req.body.password;
	fs.readFile(dataPath, function (err, data) {
		var json = JSON.parse(data);
		if (json.some(item => item.username === username)) {
			res.sendStatus(401);
		}
		else {
			json.push({ username, pass });
			fs.writeFile(dataPath, JSON.stringify(json), () => {
				console.log("signup success");
				res.sendStatus(200);
			});
		}
	});

});
router.get('/checkToken', withAuth, function(req, res) {
	res.sendStatus(200);
  });
module.exports = router;