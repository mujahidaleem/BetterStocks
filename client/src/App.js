import React from "react";
import "./App.css";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";

import Navbar from "./react-components/navbar/Navbar";
import LoginPage from "./react-components/login-signup/LoginPage";
import SignupPage from "./react-components/login-signup/SignupPage";
import PaperTrade from "./react-components/PaperTrade";
import ProfilePage from "./react-components/profile/ProfilePage";
import ProfileEditPage from "./react-components/profile/ProfileEditPage";
import Stock from "./react-components/stock-trend/index";
import ReviewPage from "./react-components/ReviewComponents/ReviewPage";
import AdminPage from "./react-components/AdminComponents/AdminPage";
import StockListing from "./react-components/StockListing";
import GamePage from "./react-components/TypeGame/TypeGame";

import ENV from "./config.js";
const API_HOST = ENV.api_host;

class App extends React.Component {
	state = {
		loggedInUser: "",
		loginRedirect: false,
		profileRedirect: false,
		stocksRedirect: false,
	};

	handleLoginCallback = (childData) => {
		// console.log(childData)
		// console.log(`USERNAME IS ${childData.username} `)
		// console.log(`PASSWORD IS ${childData.password} `)

		if (childData.username === "admin" && childData.password === "admin") {
			this.setState({ loggedInUser: this.state.users.admin });
			// console.log("ISOKAY")
			this.setState({ profileRedirect: true });
		} else if (childData.username === "user" && childData.password === "user") {
			this.setState({ loggedInUser: this.state.users.user });
			this.setState({ profileRedirect: true });
		} else {
			// console.log("WRONG USER INFO ENTERED")
			this.handleLoginRedirect();
		}

		// console.log(this.state.loggedInUser.userName)
	};

	handleLoginCallbackServer = async (userJSON) => {
		// console.log(userJSON);

		const response = await fetch(`${API_HOST}/users/login`, {
			method: "POST",
			headers: {
				Accept: "application/json text/plain, */*",
				"Content-Type": "application/json",
			},
			body: userJSON,
		});
		const responseJSON = await response.json();
		console.log(responseJSON);
		if (!response.ok) this.handleLoginRedirect();
		else {
			this.setState({ loggedInUser: responseJSON, stocksRedirect: true });
			return true;
		}
		return false;
	};

	submitInfo = (signupJSON) => {
		console.log("submitting sugnup info");

		fetch(`${API_HOST}/api/users`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: signupJSON,
		}).then((response) => {
			console.log(response);
			if (!response.ok) throw new Error(response.status);
			else this.setState({ loggedInUser: response.json() });
		});

		console.log("HELLOOO", this.state.loggedInUser);
	};

	handleLoginRedirect = () => {
		this.setState({ loginRedirect: true });
	};

	constructor(props) {
		super(props);
		this.handleLoginCallback = this.handleLoginCallback.bind(this);
		this.handleLoginCallbackServer = this.handleLoginCallbackServer.bind(this);
		this.submitInfo = this.submitInfo.bind(this);
	}
	render() {
		// console.log(this.state.loggedInUser)

		if (this.state.loginRedirect) {
			this.setState({ loginRedirect: false });
		}

		return (
			<div className="App">
				<BrowserRouter>
					<Routes>
						<Route
							path="/"
							element={
								<LoginPage
									profileRedirect={this.state.profileRedirect}
									stocksRedirect={this.state.stocksRedirect}
									handleLoginCallback={this.handleLoginCallbackServer}
								/>
							}
						/>
						<Route
							path="/login"
							element={
								<LoginPage
									profileRedirect={this.state.profileRedirect}
									stocksRedirect={this.state.stocksRedirect}
									handleLoginCallback={this.handleLoginCallbackServer}
								/>
							}
						/>

						<Route
							path="signup"
							element={<SignupPage submitInfo={this.submitInfo} />}
						/>

						<Route
							path="paper-trade"
							element={
								<React.Fragment>
									<Navbar user={this.state.loggedInUser} />
									<PaperTrade loggedInUser={this.state.loggedInUser} />
								</React.Fragment>
							}
						/>

						<Route
							path="stocklisting"
							element={
								<React.Fragment>
									<Navbar user={this.state.loggedInUser} />
									<StockListing
										loggedInUser={this.state.loggedInUser}
										columns={[
											{
												name: "history",
												label: "24-Hr Price History",
												type: "trace",
												sortable: false,
											},
											{
												name: "price",
												label: "Last Known Price",
												type: "price",
												sortable: true,
											},
											{
												name: "week_stars",
												label: "7-Day Avg. Review Rating",
												type: "stars",
												sortable: true,
											},
										]}
									/>
								</React.Fragment>
							}
						/>

						<Route
							path="stocks"
							element={
								<React.Fragment>
									<Navbar user={this.state.loggedInUser} />
									<Stock />
								</React.Fragment>
							}
						/>

						<Route
							path="stocks/reviews"
							element={
								<React.Fragment>
									<Navbar user={this.state.loggedInUser} />
									<ReviewPage loggedInUser={this.state.loggedInUser} />
								</React.Fragment>
							}
						/>

						<Route
							path="admin"
							element={
								<React.Fragment>
									<Navbar user={this.state.loggedInUser} />
									<AdminPage loggedInUser={this.state.loggedInUser} />
								</React.Fragment>
							}
						/>

						<Route
							path="profile"
							element={
								<React.Fragment>
									<Navbar user={this.state.loggedInUser} />
									<ProfilePage />
								</React.Fragment>
							}
						/>

						<Route
							path="profile-edit"
							element={
								<React.Fragment>
									<Navbar user={this.state.loggedInUser} />
									<ProfileEditPage />
								</React.Fragment>
							}
						/>

						<Route
							path="game"
							element={
								<React.Fragment>
									<Navbar user={this.state.loggedInUser} />
									<GamePage loggedInUser={this.state.loggedInUser} />
								</React.Fragment>
							}
						/>

						<Route path="*" element={<p>404</p>} />
					</Routes>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
