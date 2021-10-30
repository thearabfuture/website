// Dependencies, lol
import React, { useEffect, useState } from "react";
import firebase from "./services/FirebaseService";
import { BrowserRouter, Switch, Route } from "react-router-dom";

// Pages
import HomePage from "./components/pages/HomePage";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";

// Cool styling ;)
import "./style.css";
import UserContext from "./context/UserContext";

const App = () => {

	const [ pending, setPending ] = useState(true);
	const [ user, setUser ] = useState(undefined);

	useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			if(user) {
				setUser(user);
			}
			setPending(false);

		});
	});

	if(pending) {
		return <></>;
	}

	return (
		<UserContext.Provider value={user}>
			<React.StrictMode>
				<BrowserRouter>
					<Switch>
						<Route exact path="/" component={HomePage} />
						<Route exact path="/signup" component={Signup} />
						<Route exact path="/login" component={Login} />
					</Switch>
				</BrowserRouter>
			</React.StrictMode>
		</UserContext.Provider>
	);
};

export default App;