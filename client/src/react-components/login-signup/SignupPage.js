import React from "react";
import ReactDOM from "react-dom";
import Header from "../header/Header.js";
import "./SignupPage.css";
import { withRouter, NavLink } from "react-router-dom";
import BackgroundVideo from "../backgroundVideo/index.js";
class SignupPage extends React.Component {
	state = {
		displayName: "",
		username: "",
		password: "",
		confirmPassword: "",
		validPasswordConfirm: false,
	};

	handleInputChange = (event) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	};

	submitInfo = () => {
		console.log("submitting sugnup info");

		const user = {
			displayName: this.state.displayName,
			username: this.state.username,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword,
		};
		const signupJSON = JSON.stringify(user);
		const signupUser = this.props.submitInfo(signupJSON);
	};

	render() {
		return (
			<div>
				<BackgroundVideo/>
				<Header />
				<div id="inputDiv">
					<input
						className="signup-box"
						type="text"
						name="displayName"
						onChange={this.handleInputChange}
						value={this.state.displayName}
						placeholder="Display Name"
					/>
					<input
						className="signup-box"
						type="text"
						name="username"
						onChange={this.handleInputChange}
						value={this.state.username}
						placeholder="Username"
					/>
					<input
						className="signup-box"
						type="password"
						name="password"
						onChange={this.handleInputChange}
						value={this.state.password}
						placeholder="Password"
					/>
					<input
						className="signup-box"
						type="password"
						name="confirmPassword"
						onChange={this.handleInputChange}
						value={this.state.confirmPassword}
						placeholder="Confirm Password"
					/>
					<input
						id="submit-button-signup"
						type="submit"
						value="Submit"
						onChange={this.handleInputChange}
						onClick={this.submitInfo}
					/>

					<NavLink className="bottom-loginsignup-button" to="/">
						Login
					</NavLink>
				</div>
			</div>
		);
	}
}
export default SignupPage;
