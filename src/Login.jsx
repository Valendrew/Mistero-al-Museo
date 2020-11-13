import React, { useState } from "react";
import sha256 from "crypto-js/sha256";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useEffect } from "react";
function Login() {
	const [accedi, setAccedi] = useState(true);
	const [errore, setErrore] = useState();
	const [username, setUsername] = useState();
	const [pass, setPass] = useState();
	const [accesso, setAccesso] = useState(false);
	useEffect(() => {
		fetch("/auth/checkToken", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => {
				if (res.status === 200) {
					setAccesso(true);
				} else {
					setAccesso(false);
				}
			})
			.catch((err) => err);
	});
	const Bottone = () => {
		if (accedi) {
			return (
				<div>
					<Button type="submit" value="Accedi">
						Accedi
					</Button>
					<Button variant="link" onClick={() => setAccedi(false)}>
						Oppure clicca qui per registrarti!
					</Button>
				</div>
			);
		} else {
			return (
				<div>
					<Button type="submit" value="Registrati">
						Registrati
					</Button>
					<Button variant="link" onClick={() => setAccedi(true)}>
						Oppure clicca qui per Accedere!
					</Button>
				</div>
			);
		}
	};
	const handleSubmit = (event) => {
		event.preventDefault();
		if (accedi) {
			fetch("/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: username,
					password: sha256(pass).toString(),
				}),
			}).then((res) => {
				if (res.status === 200) {
					alert("Login effettuato!");
					setUsername("");
					setPass("");
					setErrore("");
				} else {
					setErrore("Nome utente o password errati");
				}
			});
		} else {
			fetch("/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: username,
					password: sha256(pass).toString(),
				}),
			}).then((res) => {
				if (res.status === 200) {
					alert("Utente registrato correttamente! Adesso puoi accededere!");
					setUsername("");
					setPass("");
					setErrore("");
					setAccedi(true);
				} else {
					setErrore("Nome utente già registrato");
				}
			});
		}
	};

	return (
		<Container>
			{accesso ? (
				<Alert variant="success">
					Accesso eseguito! Adesso puoi utilizzare l'ambiente autore e
					valutatore, oppure accedi nuovamente per cambiare account
				</Alert>
			) : (
				<Alert variant="warning">
					Devi accedere per usufruire dell'ambiente autore e valutatore.
				</Alert>
			)}
			<Form onSubmit={(e) => handleSubmit(e)}>
				<Form.Group>
					<Form.Label>Inserisci nome utente:</Form.Label>
					<Form.Control
						required
						minLength="4"
						type="text"
						id="usr"
						value={username}
						onChange={(event) =>
							setUsername(event.target.value)
						}></Form.Control>
				</Form.Group>
				<Form.Group>
					<Form.Label>Inserisci la password:</Form.Label>
					<Form.Control
						required
						minLength="4"
						type="password"
						id="pwd"
						value={pass}
						onChange={(event) => setPass(event.target.value)}></Form.Control>
					<br />
				</Form.Group>
				<Bottone />
				<div className="text-danger">{errore}</div>
			</Form>
		</Container>
	);
}

export default Login;
