import React from "react";
import ReactDOM from "react-dom";
import Header from "../header/Header.js";
import "./LoginPage.css";
import { withRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";
import SignupPage from "./SignupPage.js";
import BackgroundVideo from "../backgroundVideo/index.js";

class LoginPage extends React.Component {
	state = {
		username: "",
		password: "",
		validPasswordConfirm: false,
		signupRedirect: null,
	};

	handleInputChange = (event) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	};

	handleSignup = () => {
		console.log("Signup pressed");
		this.setState({ signupRedirect: "/signup" });
	};

	loginPressed = async () => {
		const userData = {
			username: this.state.username,
			password: this.state.password,
		};
		const userJSON = JSON.stringify(userData);

		const loginDone = await this.props.handleLoginCallback(userJSON);
		if (loginDone) {
			this.setState({ stocksRedirect: true });
		}
	};

	handleForgotPassword = () => {
		console.log("Forgot password pressed");
	};

	constructor(props) {
		super(props);
		const a = 5;
	}

	handleLoginCallbackServer = (userJSON) => {
		const response = fetch("http://localhost:3100/users/login", {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: userJSON,
		});
		if (!response.ok);
		else return response.json();
	};

	render() {
		if (this.state.signupRedirect) {
			return <Navigate to={this.state.signupRedirect}></Navigate>;
		}
		if (this.props.profileRedirect) {
			return <Navigate to="/profile" />;
		}
		if (this.state.stocksRedirect) {
			this.setState({ stocksRedirect: false });
			return <Navigate to="/stocklisting" />;
		}
		return (
			<div>
				<BackgroundVideo />
				<Header />
				<div id="inputDivLogin">
					<div id="phrase"> Better trades today for an easier tomorrow</div>

					<input
						className="textbox"
						type="text"
						name="username"
						onChange={this.handleInputChange}
						value={this.state.username}
						placeholder="Enter Username"
					/>
					<input
						className="textbox"
						type="password"
						name="password"
						onChange={this.handleInputChange}
						value={this.state.password}
						placeholder="Enter Password"
					/>
					<input
						id="submit-button-login"
						type="submit"
						value="Log In"
						onClick={this.loginPressed}
					/>

					<ul className="bottom-links-list">
						<li className="bottom-links-listitem">
							<a
								className="bottom-loginsignup-button"
								href="#"
								onClick={this.handleForgotPassword}
							>
								Forgot Password?{" "}
							</a>
						</li>

						<li className="bottom-links-listitem">
							<a
								className="bottom-loginsignup-button"
								href="#"
								onClick={this.handleSignup}
							>
								Sign Up
							</a>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

export default LoginPage;
